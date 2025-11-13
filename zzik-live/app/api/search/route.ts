import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { encode as ghEncode, getNeighbors, haversineDistance } from '@/lib/search/geohash';
import { tokenize } from '@/lib/search/tokenize';
import { scorePlace, type PlaceCandidate } from '@/lib/search/score';

/**
 * Place Search API Endpoint
 * 
 * Pipeline: Query normalization → Tokenization → Geohash filtering → Scoring → Sorting
 * 
 * Features:
 * - Korean/English tokenization with typo tolerance
 * - Geohash-based spatial indexing (9-cell expansion)
 * - BM25-inspired weighted scoring
 * - LRU in-memory caching (5-minute TTL)
 * - Privacy: No raw coordinates in logs/events
 * 
 * Performance targets:
 * - p95 latency ≤80ms @ 100 QPS
 * - Top-5 accuracy ≥80%
 * - Typo matching ≥90%
 * 
 * Phase 6: Place Search 1.0
 */

export const runtime = 'nodejs'; // Required for DB/Redis access

// ---- Query schema ----
const QuerySchema = z.object({
  q: z.string().min(1).max(100),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(100).max(10000).default(3000), // meters
  limit: z.coerce.number().min(1).max(50).default(10),
});

type QueryParams = z.infer<typeof QuerySchema>;

// ---- Database types ----
interface PlaceRow {
  id: string;
  name: string;
  name_en?: string;
  tags?: string[];
  description?: string;
  latitude: number;
  longitude: number;
  geohash6: string;
  created_at: string; // ISO timestamp
  save_count: number;
  visit_count: number;
  post_count: number;
}

// ---- Response types ----
interface SearchResult {
  place_id: string;
  name: string;
  name_en?: string;
  distance_m?: number;
  score: number;
  score_breakdown: {
    text_match: number;
    geo_proximity: number;
    freshness: number;
    popularity: number;
  };
  tags: string[];
  last_post_at: string;
}

interface SearchResponse {
  took_ms: number;
  results: SearchResult[];
  total: number;
  query_normalized: string;
  geohash_cells: string[];
}

// ---- In-memory LRU cache ----
const globalCache = globalThis as unknown as { 
  __searchCache?: Map<string, { timestamp: number; value: any }> 
};

if (!globalCache.__searchCache) {
  globalCache.__searchCache = new Map();
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_SIZE = 1000;

function getCached(key: string): any | null {
  const cached = globalCache.__searchCache!.get(key);
  if (!cached) return null;
  
  // Check expiry
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    globalCache.__searchCache!.delete(key);
    return null;
  }
  
  return cached.value;
}

function setCached(key: string, value: any): void {
  // Evict oldest entry if cache full
  if (globalCache.__searchCache!.size >= CACHE_MAX_SIZE) {
    const firstKey = globalCache.__searchCache!.keys().next().value;
    if (firstKey) {
      globalCache.__searchCache!.delete(firstKey);
    }
  }
  
  globalCache.__searchCache!.set(key, {
    timestamp: Date.now(),
    value,
  });
}

// ---- Data layer stub ----
/**
 * Fetch place candidates by geohash cells
 * 
 * TODO: Replace with actual database query
 * 
 * Example PostgreSQL + PostGIS query:
 * 
 * SELECT 
 *   id, name, name_en, tags, description,
 *   latitude, longitude, geohash6, created_at,
 *   save_count, visit_count, post_count
 * FROM places
 * WHERE geohash6 = ANY($1)
 *   AND ST_DWithin(
 *     geom::geography, 
 *     ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography,
 *     $4
 *   )
 * LIMIT $5;
 */
async function fetchCandidates(
  geohashCells: string[],
  userLat?: number,
  userLng?: number,
  radiusMeters: number = 3000,
  maxResults: number = 100
): Promise<PlaceRow[]> {
  // STUB: Return mock data for testing
  // In production, this would:
  // 1. Query Supabase/PostgreSQL with geohash prefix filter
  // 2. Apply ST_DWithin for accurate radius filtering
  // 3. Return candidate places sorted by geohash
  
  const mockPlaces: PlaceRow[] = [
    {
      id: 'plc_gangnam_station',
      name: '강남역',
      name_en: 'Gangnam Station',
      tags: ['지하철', '교통', '핫플'],
      description: '서울 강남구의 중심 역',
      latitude: 37.4979,
      longitude: 127.0276,
      geohash6: 'wydm7q',
      created_at: '2024-01-15T00:00:00Z',
      save_count: 1500,
      visit_count: 50000,
      post_count: 2300,
    },
    {
      id: 'plc_hongdae',
      name: '홍대입구',
      name_en: 'Hongdae',
      tags: ['문화', '예술', '클럽'],
      description: '젊음의 거리',
      latitude: 37.5564,
      longitude: 126.9237,
      geohash6: 'wydm6z',
      created_at: '2024-02-10T00:00:00Z',
      save_count: 1200,
      visit_count: 40000,
      post_count: 1800,
    },
    {
      id: 'plc_myeongdong',
      name: '명동',
      name_en: 'Myeongdong',
      tags: ['쇼핑', '관광', '맛집'],
      description: '서울의 대표 쇼핑 거리',
      latitude: 37.5631,
      longitude: 126.9830,
      geohash6: 'wydm6v',
      created_at: '2024-01-20T00:00:00Z',
      save_count: 1800,
      visit_count: 60000,
      post_count: 2500,
    },
  ];
  
  // Filter by distance if coordinates provided
  if (userLat !== undefined && userLng !== undefined) {
    return mockPlaces.filter(place => {
      const distance = haversineDistance(userLat, userLng, place.latitude, place.longitude);
      return distance <= radiusMeters;
    }).slice(0, maxResults);
  }
  
  // Return all mock places for text-only queries
  return mockPlaces.slice(0, maxResults);
}

// ---- Main handler ----
export async function GET(req: NextRequest) {
  const startTime = performance.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams);
    const parsed = QuerySchema.safeParse(params);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          error: 'invalid_query', 
          details: parsed.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { q, lat, lng, radius, limit } = parsed.data;
    
    // Generate cache key (includes coordinates for geo-aware caching)
    const cacheKey = `v1:${q}:${lat ?? ''}:${lng ?? ''}:${radius}:${limit}`;
    
    // Check cache
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' },
      });
    }
    
    // Calculate geohash cells (9-cell expansion)
    let geohashCells: string[] = [];
    if (lat !== undefined && lng !== undefined) {
      const centerHash = ghEncode(lat, lng, 6);
      geohashCells = getNeighbors(centerHash);
    }
    
    // Tokenize query (Korean jamo + English 2-gram + typo tolerance)
    const queryTokens = tokenize(q);
    
    // Fetch candidates from database
    const candidates = await fetchCandidates(
      geohashCells,
      lat,
      lng,
      radius,
      Math.max(limit * 5, 60) // Fetch 5x limit to allow for filtering
    );
    
    // Score all candidates
    const scored = candidates.map(place => {
      const placeCandidate: PlaceCandidate = {
        placeId: place.id,
        name: place.name,
        nameEn: place.name_en,
        tags: place.tags,
        description: place.description,
        latitude: place.latitude,
        longitude: place.longitude,
        createdAt: place.created_at,
        postCount: place.post_count,
        saveCount: place.save_count,
        visitCount: place.visit_count,
      };
      
      const result = scorePlace(q, placeCandidate, lat ?? 0, lng ?? 0);
      
      return {
        place,
        score: result.score,
        breakdown: result.scoreBreakdown,
        distance: result.distance,
      };
    });
    
    // Sort by score (descending)
    scored.sort((a, b) => b.score - a.score);
    
    // Take top N results
    const topResults = scored.slice(0, limit);
    
    // Format response
    const results: SearchResult[] = topResults.map(item => ({
      place_id: item.place.id,
      name: item.place.name,
      name_en: item.place.name_en,
      distance_m: item.distance,
      score: Number(item.score.toFixed(4)),
      score_breakdown: {
        text_match: Number(item.breakdown.textMatch.toFixed(4)),
        geo_proximity: Number(item.breakdown.geoProximity.toFixed(4)),
        freshness: Number(item.breakdown.freshness.toFixed(4)),
        popularity: Number(item.breakdown.popularity.toFixed(4)),
      },
      tags: item.place.tags ?? [],
      last_post_at: item.place.created_at,
    }));
    
    const response: SearchResponse = {
      took_ms: Math.round(performance.now() - startTime),
      results,
      total: scored.length,
      query_normalized: q, // TODO: Apply normalization (lowercase, trim, etc.)
      geohash_cells: geohashCells,
    };
    
    // Cache response
    setCached(cacheKey, response);
    
    return NextResponse.json(response, {
      headers: { 'X-Cache': 'MISS' },
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'internal_error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
