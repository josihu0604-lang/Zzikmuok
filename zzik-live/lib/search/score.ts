/**
 * Search Scoring Functions
 * 
 * Implements BM25-inspired text matching combined with:
 * - GeoProximity (exponential decay based on distance)
 * - Freshness (recent content boost)
 * - Popularity (saves, visits, post count)
 * 
 * Score = 0.40 * TextMatch + 0.25 * GeoProximity + 0.20 * Freshness + 0.15 * Popularity
 * 
 * Phase 6: Place Search 1.0
 */

import { tokenize, type Token } from './tokenize';
import { haversineDistance } from './geohash';

/**
 * BM25 constants
 * k1: Term frequency saturation parameter (1.2-2.0)
 * b: Length normalization parameter (0.75)
 */
const BM25_K1 = 1.5;
const BM25_B = 0.75;

/**
 * Scoring weights (must sum to 1.0)
 */
export const WEIGHTS = {
  textMatch: 0.40,
  geoProximity: 0.25,
  freshness: 0.20,
  popularity: 0.15,
} as const;

/**
 * Place candidate for scoring
 */
export interface PlaceCandidate {
  placeId: string;
  name: string;
  nameEn?: string;
  tags?: string[];
  description?: string;
  latitude: number;
  longitude: number;
  createdAt: string | Date;
  postCount: number;
  saveCount: number;
  visitCount: number;
}

/**
 * Scored place result
 */
export interface ScoredPlace extends PlaceCandidate {
  score: number;
  distance: number; // meters
  scoreBreakdown: {
    textMatch: number;
    geoProximity: number;
    freshness: number;
    popularity: number;
    penalties: number;
  };
  matchedFields: string[]; // Which fields matched the query
}

/**
 * Calculate BM25-inspired text match score
 * 
 * Factors:
 * - Term frequency (TF)
 * - Inverse document frequency (IDF) - approximated
 * - Document length normalization
 * - Prefix matching bonus
 * 
 * @param query Query text
 * @param place Place candidate
 * @returns Score (0-1)
 */
export function calculateTextMatch(query: string, place: PlaceCandidate): {
  score: number;
  matchedFields: string[];
} {
  const queryTokens = tokenize(query.toLowerCase());
  const matchedFields: string[] = [];
  
  // Fields to search with weights
  const fields = [
    { text: place.name, weight: 3.0, name: 'name' },
    { text: place.nameEn || '', weight: 2.0, name: 'nameEn' },
    { text: place.tags?.join(' ') || '', weight: 1.5, name: 'tags' },
    { text: place.description || '', weight: 1.0, name: 'description' },
  ];
  
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const field of fields) {
    if (!field.text) continue;
    
    const fieldTokens = tokenize(field.text.toLowerCase());
    const fieldLength = fieldTokens.length;
    
    let fieldScore = 0;
    
    for (const qToken of queryTokens) {
      // Count occurrences of query token in field
      const tf = fieldTokens.filter(fToken => 
        fToken.normalized.includes(qToken.normalized) ||
        qToken.normalized.includes(fToken.normalized)
      ).length;
      
      if (tf > 0) {
        matchedFields.push(field.name);
        
        // BM25-inspired formula
        // Score = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (fieldLength / avgLength)))
        const avgLength = 5; // Average field length (estimated)
        const bm25Score = (tf * (BM25_K1 + 1)) / (tf + BM25_K1 * (1 - BM25_B + BM25_B * (fieldLength / avgLength)));
        
        // Prefix matching bonus
        const prefixBonus = field.text.toLowerCase().startsWith(query.toLowerCase()) ? 0.3 : 0;
        
        // Exact match bonus
        const exactBonus = field.text.toLowerCase() === query.toLowerCase() ? 0.5 : 0;
        
        fieldScore += bm25Score + prefixBonus + exactBonus;
      }
    }
    
    totalScore += fieldScore * field.weight;
    totalWeight += field.weight;
  }
  
  // Normalize to 0-1 range
  const normalizedScore = totalWeight > 0 ? Math.min(totalScore / totalWeight, 1) : 0;
  
  return {
    score: normalizedScore,
    matchedFields: [...new Set(matchedFields)], // Remove duplicates
  };
}

/**
 * Calculate geo-proximity score with exponential decay
 * 
 * Formula: exp(-α * distance_meters)
 * α = 1/1200 (half value at ~830m)
 * 
 * @param userLat User latitude
 * @param userLon User longitude
 * @param placeLat Place latitude
 * @param placeLon Place longitude
 * @returns Score (0-1) and distance in meters
 */
export function calculateGeoProximity(
  userLat: number,
  userLon: number,
  placeLat: number,
  placeLon: number
): { score: number; distance: number } {
  const distance = haversineDistance(userLat, userLon, placeLat, placeLon);
  
  // Exponential decay: exp(-distance / 1200)
  // At 0m: 1.0
  // At 600m: 0.61
  // At 1200m: 0.37
  // At 2400m: 0.14
  const alpha = 1 / 1200;
  const score = Math.exp(-alpha * distance);
  
  return { score, distance };
}

/**
 * Calculate freshness score with 7-day half-life
 * 
 * Formula: exp(-λ * days_since_creation)
 * λ = ln(2) / 7 ≈ 0.099
 * 
 * @param createdAt Creation timestamp
 * @returns Score (0-1)
 */
export function calculateFreshness(createdAt: string | Date): number {
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const now = new Date();
  const daysSince = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  
  // 7-day half-life: exp(-0.099 * days)
  // At 0 days: 1.0
  // At 7 days: 0.5
  // At 14 days: 0.25
  // At 30 days: 0.06
  const lambda = Math.LN2 / 7;
  const score = Math.exp(-lambda * daysSince);
  
  return Math.max(score, 0.01); // Minimum 0.01 to avoid zero scores
}

/**
 * Calculate popularity score based on saves, visits, and post count
 * 
 * Normalized to 0-1 range using log scaling
 * 
 * @param place Place candidate
 * @returns Score (0-1)
 */
export function calculatePopularity(place: PlaceCandidate): number {
  // Weighted combination: saves > visits > posts
  const saveWeight = 3.0;
  const visitWeight = 2.0;
  const postWeight = 1.0;
  
  const saveScore = Math.log10(place.saveCount + 1);
  const visitScore = Math.log10(place.visitCount + 1);
  const postScore = Math.log10(place.postCount + 1);
  
  // Normalize using typical maximum values
  // Assume max: 1000 saves, 10000 visits, 100 posts
  const normalizedSave = saveScore / Math.log10(1001);   // ~3.0
  const normalizedVisit = visitScore / Math.log10(10001); // ~4.0
  const normalizedPost = postScore / Math.log10(101);     // ~2.0
  
  const weightedScore = 
    normalizedSave * saveWeight +
    normalizedVisit * visitWeight +
    normalizedPost * postWeight;
  
  const totalWeight = saveWeight + visitWeight + postWeight;
  
  return Math.min(weightedScore / totalWeight, 1);
}

/**
 * Calculate penalty score for duplicates, noise, etc.
 * 
 * @param place Place candidate
 * @returns Penalty (0-1, higher = more penalty)
 */
export function calculatePenalties(place: PlaceCandidate): number {
  let penalty = 0;
  
  // Penalty for very short names (likely incomplete or test data)
  if (place.name.length < 2) {
    penalty += 0.5;
  }
  
  // Penalty for places with no posts
  if (place.postCount === 0) {
    penalty += 0.1;
  }
  
  // Penalty for places with suspicious patterns
  if (place.name.match(/test|테스트|임시/i)) {
    penalty += 0.3;
  }
  
  return Math.min(penalty, 0.9); // Cap at 0.9
}

/**
 * Calculate overall score for a place candidate
 * 
 * Score = 0.40 * TextMatch + 0.25 * GeoProximity + 0.20 * Freshness + 0.15 * Popularity - Penalties
 * 
 * @param query Search query
 * @param place Place candidate
 * @param userLat User latitude
 * @param userLon User longitude
 * @returns Scored place with breakdown
 */
export function scorePlace(
  query: string,
  place: PlaceCandidate,
  userLat: number,
  userLon: number
): ScoredPlace {
  // Calculate individual components
  const textMatch = calculateTextMatch(query, place);
  const geoProximity = calculateGeoProximity(userLat, userLon, place.latitude, place.longitude);
  const freshness = calculateFreshness(place.createdAt);
  const popularity = calculatePopularity(place);
  const penalties = calculatePenalties(place);
  
  // Weighted combination
  const score = 
    WEIGHTS.textMatch * textMatch.score +
    WEIGHTS.geoProximity * geoProximity.score +
    WEIGHTS.freshness * freshness +
    WEIGHTS.popularity * popularity -
    penalties;
  
  // Ensure score is in valid range
  const finalScore = Math.max(0, Math.min(score, 1));
  
  return {
    ...place,
    score: finalScore,
    distance: geoProximity.distance,
    scoreBreakdown: {
      textMatch: textMatch.score,
      geoProximity: geoProximity.score,
      freshness,
      popularity,
      penalties,
    },
    matchedFields: textMatch.matchedFields,
  };
}

/**
 * Score multiple place candidates and sort by score (descending)
 * 
 * @param query Search query
 * @param places Place candidates
 * @param userLat User latitude
 * @param userLon User longitude
 * @param limit Maximum results to return (default: 20)
 * @returns Sorted scored places
 */
export function scorePlaces(
  query: string,
  places: PlaceCandidate[],
  userLat: number,
  userLon: number,
  limit: number = 20
): ScoredPlace[] {
  const scored = places.map(place => scorePlace(query, place, userLat, userLon));
  
  // Sort by score (descending), then by distance (ascending) for tiebreaker
  scored.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 0.001) {
      return a.distance - b.distance;
    }
    return b.score - a.score;
  });
  
  return scored.slice(0, limit);
}

/**
 * Filter candidates by minimum score threshold
 * 
 * @param scored Scored places
 * @param threshold Minimum score (default: 0.1)
 * @returns Filtered places
 */
export function filterByThreshold(scored: ScoredPlace[], threshold: number = 0.1): ScoredPlace[] {
  return scored.filter(place => place.score >= threshold);
}

/**
 * Calculate score cutoff using Jenks natural breaks
 * Helps identify significant drops in score distribution
 * 
 * @param scores Array of scores
 * @returns Cutoff score
 */
export function calculateScoreCutoff(scores: number[]): number {
  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0] * 0.5;
  
  // Simple heuristic: Find largest gap in sorted scores
  const sorted = [...scores].sort((a, b) => b - a);
  let maxGap = 0;
  let cutoffIdx = sorted.length;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i] - sorted[i + 1];
    if (gap > maxGap) {
      maxGap = gap;
      cutoffIdx = i + 1;
    }
  }
  
  // Return average of scores above the gap
  if (cutoffIdx > 0) {
    return sorted.slice(0, cutoffIdx).reduce((sum, s) => sum + s, 0) / cutoffIdx * 0.7;
  }
  
  return sorted[0] * 0.5;
}
