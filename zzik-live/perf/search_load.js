/**
 * k6 Load Test for /api/search
 * 
 * Simulates 100 QPS for 60 seconds with realistic query distribution
 * 
 * Usage:
 *   k6 run perf/search_load.js
 * 
 * Thresholds:
 *   - p95 ≤ 80ms
 *   - p99 ≤ 120ms
 *   - Error rate ≤ 0.5%
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const searchErrors = new Rate('search_errors');
const searchDuration = new Trend('search_duration_ms');

// Test configuration
export const options = {
  // 100 VUs for 60 seconds
  vus: 100,
  duration: '60s',
  
  // Performance thresholds
  thresholds: {
    http_req_failed: ['rate<=0.005'],          // <0.5% errors
    http_req_duration: ['p(95)<=80', 'p(99)<=120'], // p95 ≤80ms, p99 ≤120ms
    search_errors: ['rate<=0.005'],             // <0.5% search errors
    search_duration_ms: ['p(95)<=80', 'p(99)<=120'], // API-level timing
  },
  
  // Graceful ramp
  stages: [
    { duration: '10s', target: 50 },   // Ramp up to 50%
    { duration: '40s', target: 100 },  // Ramp to full load
    { duration: '10s', target: 0 },    // Ramp down
  ],
};

// Query distributions
const POPULAR_QUERIES = ['강남역', '홍대', '명동', 'Gangnam', 'Hongdae', 'Myeongdong'];
const TYPICAL_QUERIES = [
  '강남 카페', '홍대 맛집', '이태원 술집', '명동 디저트', '압구정 레스토랑',
  '삼청동 갤러리', '가로수길 브런치', '여의도 공원', '북촌 한옥', '성수동 카페'
];
const LONGTAIL_QUERIES = [
  '홍대입꾸', 'Gangnma', '삼청동 빈티지', '까페', '레스토랑',
  '서울 숨은 맛집', '핫플레이스', '데이트 코스', '야경 명소', '인생샷'
];

// Seoul area coordinates for geo queries
const SEOUL_COORDS = [
  { lat: 37.4979, lng: 127.0276 },  // Gangnam
  { lat: 37.5564, lng: 126.9237 },  // Hongdae
  { lat: 37.5631, lng: 126.9830 },  // Myeongdong
  { lat: 37.5665, lng: 126.9780 },  // City Hall
  { lat: 37.5219, lng: 127.0411 },  // Gangnam South
];

// Base URL (change to your deployment)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3007';

function selectQuery() {
  const rand = Math.random();
  
  if (rand < 0.4) {
    // 40% popular queries (high cache hit rate expected)
    return POPULAR_QUERIES[Math.floor(Math.random() * POPULAR_QUERIES.length)];
  } else if (rand < 0.8) {
    // 40% typical queries
    return TYPICAL_QUERIES[Math.floor(Math.random() * TYPICAL_QUERIES.length)];
  } else {
    // 20% long-tail queries
    return LONGTAIL_QUERIES[Math.floor(Math.random() * LONGTAIL_QUERIES.length)];
  }
}

function selectCoords() {
  if (Math.random() < 0.7) {
    // 70% of queries include geo coordinates
    return SEOUL_COORDS[Math.floor(Math.random() * SEOUL_COORDS.length)];
  }
  return null;
}

export default function () {
  const query = selectQuery();
  const coords = selectCoords();
  
  // Build URL
  let url = `${BASE_URL}/api/search?q=${encodeURIComponent(query)}`;
  if (coords) {
    url += `&lat=${coords.lat}&lng=${coords.lng}&radius=3000&limit=10`;
  } else {
    url += `&limit=10`;
  }
  
  const startTime = new Date().getTime();
  const response = http.get(url);
  const duration = new Date().getTime() - startTime;
  
  // Record metrics
  searchDuration.add(duration);
  
  // Validate response
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'has results field': (r) => {
      try {
        const json = JSON.parse(r.body);
        return json.hasOwnProperty('results');
      } catch (e) {
        return false;
      }
    },
    'took_ms exists': (r) => {
      try {
        const json = JSON.parse(r.body);
        return typeof json.took_ms === 'number';
      } catch (e) {
        return false;
      }
    },
    'response time <200ms': (r) => r.timings.duration < 200,
  });
  
  searchErrors.add(!success);
  
  // Random think time between requests (0-200ms)
  // This creates realistic traffic patterns with ~5-10 QPS per VU
  sleep(Math.random() * 0.2);
}

// Custom summary to show search-specific metrics
export function handleSummary(data) {
  const summary = {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
  
  // Add search-specific metrics
  if (data.metrics.search_duration_ms) {
    console.log('\n📊 Search API Metrics:');
    console.log(`   p50: ${data.metrics.search_duration_ms.values.p50.toFixed(2)}ms`);
    console.log(`   p95: ${data.metrics.search_duration_ms.values.p95.toFixed(2)}ms`);
    console.log(`   p99: ${data.metrics.search_duration_ms.values.p99.toFixed(2)}ms`);
    console.log(`   avg: ${data.metrics.search_duration_ms.values.avg.toFixed(2)}ms`);
  }
  
  if (data.metrics.http_reqs) {
    const totalReqs = data.metrics.http_reqs.values.count;
    const duration = data.state.testRunDurationMs / 1000;
    console.log(`\n🚀 Throughput: ${(totalReqs / duration).toFixed(2)} req/s`);
  }
  
  return summary;
}

function textSummary(data, opts) {
  // Basic k6 summary formatting
  return JSON.stringify(data, null, 2);
}
