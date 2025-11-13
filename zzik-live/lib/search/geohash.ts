/**
 * Geohash Encoding and Neighbor Calculation
 * 
 * Used for spatial indexing of places with ~600m precision (6-character geohash).
 * Supports neighbor cell expansion for boundary queries.
 * 
 * Phase 6: Place Search 1.0
 */

/**
 * Base32 alphabet for geohash encoding
 */
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Neighbor lookup tables for adjacent geohash cells
 * Source: https://en.wikipedia.org/wiki/Geohash
 */
const NEIGHBORS: Record<string, Record<string, string>> = {
  right: {
    even: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy',
    odd: 'bc01fg45238967deuvhjyznpkmstqrwx',
  },
  left: {
    even: '14365h7k9dcfesgujnmqp0r2twvyx8zb',
    odd: '238967debc01fg45kmstqrwxuvhjyznp',
  },
  top: {
    even: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy',
    odd: 'bc01fg45238967deuvhjyznpkmstqrwx',
  },
  bottom: {
    even: '14365h7k9dcfesgujnmqp0r2twvyx8zb',
    odd: '238967debc01fg45kmstqrwxuvhjyznp',
  },
};

const BORDERS: Record<string, Record<string, string>> = {
  right: { even: 'bcfguvyz', odd: 'prxz' },
  left: { even: '0145hjnp', odd: '028b' },
  top: { even: 'prxz', odd: 'bcfguvyz' },
  bottom: { even: '028b', odd: '0145hjnp' },
};

/**
 * Encode latitude and longitude into a geohash string
 * 
 * @param latitude Latitude (-90 to 90)
 * @param longitude Longitude (-180 to 180)
 * @param precision Number of characters in geohash (default: 6, ~600m)
 * @returns Geohash string
 * 
 * @example
 * encode(37.5665, 126.9780, 6) // Seoul City Hall: 'wydm6v'
 * encode(37.5510, 126.9882, 6) // Gangnam: 'wydm8h'
 */
export function encode(latitude: number, longitude: number, precision: number = 6): string {
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = '';
  
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;
  
  while (geohash.length < precision) {
    if (evenBit) {
      // Longitude
      const lonMid = (lonMin + lonMax) / 2;
      if (longitude > lonMid) {
        idx |= (1 << (4 - bit));
        lonMin = lonMid;
      } else {
        lonMax = lonMid;
      }
    } else {
      // Latitude
      const latMid = (latMin + latMax) / 2;
      if (latitude > latMid) {
        idx |= (1 << (4 - bit));
        latMin = latMid;
      } else {
        latMax = latMid;
      }
    }
    
    evenBit = !evenBit;
    
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[idx];
      bit = 0;
      idx = 0;
    }
  }
  
  return geohash;
}

/**
 * Decode geohash into latitude/longitude bounds
 * 
 * @param geohash Geohash string
 * @returns Bounding box { minLat, minLon, maxLat, maxLon, centerLat, centerLon }
 * 
 * @example
 * decode('wydm6v')
 * // { minLat: 37.566, minLon: 126.977, maxLat: 37.567, maxLon: 126.979, ... }
 */
export function decode(geohash: string): {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
  centerLat: number;
  centerLon: number;
} {
  let evenBit = true;
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;
  
  for (const char of geohash) {
    const idx = BASE32.indexOf(char);
    if (idx === -1) {
      throw new Error(`Invalid geohash character: ${char}`);
    }
    
    for (let n = 4; n >= 0; n--) {
      const bitN = (idx >> n) & 1;
      if (evenBit) {
        // Longitude
        const lonMid = (lonMin + lonMax) / 2;
        if (bitN === 1) {
          lonMin = lonMid;
        } else {
          lonMax = lonMid;
        }
      } else {
        // Latitude
        const latMid = (latMin + latMax) / 2;
        if (bitN === 1) {
          latMin = latMid;
        } else {
          latMax = latMid;
        }
      }
      evenBit = !evenBit;
    }
  }
  
  return {
    minLat: latMin,
    minLon: lonMin,
    maxLat: latMax,
    maxLon: lonMax,
    centerLat: (latMin + latMax) / 2,
    centerLon: (lonMin + lonMax) / 2,
  };
}

/**
 * Get neighboring geohash in specified direction
 * 
 * @param geohash Base geohash
 * @param direction Direction: 'right' | 'left' | 'top' | 'bottom'
 * @returns Neighboring geohash
 * 
 * @example
 * getNeighbor('wydm6v', 'right') // 'wydm6y'
 */
export function getNeighbor(geohash: string, direction: 'right' | 'left' | 'top' | 'bottom'): string {
  if (!geohash || geohash.length === 0) {
    return '';
  }
  
  const lastChar = geohash[geohash.length - 1];
  const parent = geohash.slice(0, -1);
  const type = geohash.length % 2 === 0 ? 'even' : 'odd';
  
  // Check if we're at a border
  if (BORDERS[direction][type].indexOf(lastChar) !== -1 && parent) {
    // Recursively get neighbor of parent
    return getNeighbor(parent, direction) + BASE32[NEIGHBORS[direction][type].indexOf(lastChar)];
  }
  
  return parent + BASE32[NEIGHBORS[direction][type].indexOf(lastChar)];
}

/**
 * Get all 8 neighboring geohashes (N, NE, E, SE, S, SW, W, NW)
 * Plus the center cell = 9 cells total
 * 
 * @param geohash Center geohash
 * @returns Array of 9 geohashes (center + 8 neighbors)
 * 
 * @example
 * getNeighbors('wydm6v')
 * // ['wydm6v', 'wydm6y', 'wydm6x', 'wydm6t', 'wydm6s', 'wydm6q', 'wydm6r', 'wydm6w', 'wydm6u']
 */
export function getNeighbors(geohash: string): string[] {
  const center = geohash;
  const top = getNeighbor(center, 'top');
  const bottom = getNeighbor(center, 'bottom');
  const right = getNeighbor(center, 'right');
  const left = getNeighbor(center, 'left');
  
  const topRight = getNeighbor(top, 'right');
  const topLeft = getNeighbor(top, 'left');
  const bottomRight = getNeighbor(bottom, 'right');
  const bottomLeft = getNeighbor(bottom, 'left');
  
  return [
    center,      // Center
    top,         // N
    topRight,    // NE
    right,       // E
    bottomRight, // SE
    bottom,      // S
    bottomLeft,  // SW
    left,        // W
    topLeft,     // NW
  ];
}

/**
 * Calculate approximate distance in meters between two geohashes
 * Uses Haversine formula
 * 
 * @param geohash1 First geohash
 * @param geohash2 Second geohash
 * @returns Distance in meters
 */
export function distance(geohash1: string, geohash2: string): number {
  const box1 = decode(geohash1);
  const box2 = decode(geohash2);
  
  return haversineDistance(
    box1.centerLat,
    box1.centerLon,
    box2.centerLat,
    box2.centerLon
  );
}

/**
 * Haversine distance between two lat/lon coordinates
 * 
 * @param lat1 Latitude 1
 * @param lon1 Longitude 1
 * @param lat2 Latitude 2
 * @param lon2 Longitude 2
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Get geohash precision (number of characters) for desired accuracy
 * 
 * @param meters Desired accuracy in meters
 * @returns Recommended geohash precision
 * 
 * @example
 * getPrecisionForRadius(600) // 6 (±600m)
 * getPrecisionForRadius(150) // 7 (±76m)
 */
export function getPrecisionForRadius(meters: number): number {
  if (meters >= 5000) return 4;  // ±2.4km
  if (meters >= 1200) return 5;  // ±610m
  if (meters >= 600) return 6;   // ±76m (default for Phase 6)
  if (meters >= 150) return 7;   // ±19m
  if (meters >= 40) return 8;    // ±2.4m
  return 9; // ±0.6m
}

/**
 * Anonymize geohash to 5 characters for privacy (~2.4km)
 * Used for analytics events
 * 
 * @example
 * anonymize('wydm6v') // 'wydm6'
 */
export function anonymize(geohash: string): string {
  return geohash.substring(0, 5);
}
