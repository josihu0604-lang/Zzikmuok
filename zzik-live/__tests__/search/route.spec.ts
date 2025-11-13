/**
 * Integration tests for /api/search endpoint
 * 
 * Tests basic functionality with stub data
 */

import { GET } from '@/app/api/search/route';
import { NextRequest } from 'next/server';

describe('GET /api/search', () => {
  test('should return 400 for missing query', async () => {
    const req = new NextRequest('http://localhost:3000/api/search');
    const res = await GET(req);
    
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('invalid_query');
  });
  
  test('should return results for text-only query', async () => {
    const req = new NextRequest('http://localhost:3000/api/search?q=강남');
    const res = await GET(req);
    
    expect(res.status).toBe(200);
    const json = await res.json();
    
    expect(json).toHaveProperty('took_ms');
    expect(json).toHaveProperty('results');
    expect(json).toHaveProperty('total');
    expect(json.query_normalized).toBe('강남');
    expect(Array.isArray(json.results)).toBe(true);
  });
  
  test('should apply geo filtering with coordinates', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/search?q=카페&lat=37.5665&lng=126.9780&radius=3000&limit=5'
    );
    const res = await GET(req);
    
    expect(res.status).toBe(200);
    const json = await res.json();
    
    expect(json.results.length).toBeLessThanOrEqual(5);
    expect(json.geohash_cells.length).toBeGreaterThan(0);
    
    // Check that results have required fields
    if (json.results.length > 0) {
      const result = json.results[0];
      expect(result).toHaveProperty('place_id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('score_breakdown');
      expect(result.score_breakdown).toHaveProperty('text_match');
      expect(result.score_breakdown).toHaveProperty('geo_proximity');
      expect(result.score_breakdown).toHaveProperty('freshness');
      expect(result.score_breakdown).toHaveProperty('popularity');
    }
  });
  
  test('should respect limit parameter', async () => {
    const req = new NextRequest('http://localhost:3000/api/search?q=서울&limit=2');
    const res = await GET(req);
    
    expect(res.status).toBe(200);
    const json = await res.json();
    
    expect(json.results.length).toBeLessThanOrEqual(2);
  });
  
  test('should return cache headers', async () => {
    // First request (miss)
    const req1 = new NextRequest('http://localhost:3000/api/search?q=테스트');
    const res1 = await GET(req1);
    const cacheHeader1 = res1.headers.get('X-Cache');
    expect(cacheHeader1).toBe('MISS');
    
    // Second request (should hit cache)
    const req2 = new NextRequest('http://localhost:3000/api/search?q=테스트');
    const res2 = await GET(req2);
    const cacheHeader2 = res2.headers.get('X-Cache');
    expect(cacheHeader2).toBe('HIT');
  });
  
  test('should validate coordinate ranges', async () => {
    const req = new NextRequest(
      'http://localhost:3000/api/search?q=test&lat=999&lng=180'
    );
    const res = await GET(req);
    
    expect(res.status).toBe(400);
  });
  
  test('should enforce limit bounds', async () => {
    const req = new NextRequest('http://localhost:3000/api/search?q=test&limit=100');
    const res = await GET(req);
    
    expect(res.status).toBe(400);
  });
  
  test('should handle English queries', async () => {
    const req = new NextRequest('http://localhost:3000/api/search?q=Gangnam');
    const res = await GET(req);
    
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.query_normalized).toBe('Gangnam');
  });
  
  test('should handle mixed Korean/English queries', async () => {
    const req = new NextRequest('http://localhost:3000/api/search?q=강남+cafe');
    const res = await GET(req);
    
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.query_normalized).toContain('강남');
  });
});
