# Phase 6: Place Search 1.0 - 진행 현황

**브랜치**: search/phase6-core  
**시작일**: 2025-11-13 09:20 UTC  
**현재 상태**: 🔄 Core Implementation (40% 완료)

---

## ✅ 완료된 작업 (4/10)

### 1. ✅ 브랜치 및 디렉터리 구조 생성
```
lib/search/           # 검색 핵심 로직
app/api/search/       # API 엔드포인트
__tests__/search/     # 테스트 스위트
```

### 2. ✅ 토크나이저 구현 (`lib/search/tokenize.ts`, 8.1KB)

**기능**:
- 한글 자모 분해 (ㄱㅏㄱㅔ → 가게)
- 영문 2-gram (cafe → ca, af, fe)
- 언어 감지 (ko/en/mixed/number)
- 오타 허용 (Levenshtein distance ≤2)
- 유사도 계산

**주요 함수**:
- `decomposeKorean()` - 한글 자모 분해
- `generateBigrams()` - 2-gram 생성
- `tokenize()` - 통합 토큰화
- `tokenizeQuery()` - 쿼리 다중 전략 토큰화
- `matchesWithTypo()` - 오타 매칭 (≤2자)

**테스트 케이스**:
```typescript
decomposeKorean('가') // ['ㄱ', 'ㅏ']
generateBigrams('cafe') // ['ca', 'af', 'fe']
tokenize('커피바K') // word + jamo + bigrams
```

---

### 3. ✅ Geohash 인코더 구현 (`lib/search/geohash.ts`, 7.8KB)

**기능**:
- 6자 정밀도 인코딩 (~600m)
- 디코딩 (바운딩 박스)
- 인접 셀 계산 (8방향 + 중심 = 9셀)
- Haversine 거리 계산
- 익명화 (5자로 축소, ~2.4km)

**주요 함수**:
- `encode(lat, lng, precision=6)` - 좌표 → 지오해시
- `decode(geohash)` - 지오해시 → 바운딩 박스
- `getNeighbors(geohash)` - 9셀 확장
- `haversineDistance()` - 실제 거리 계산
- `anonymize()` - 프라이버시 보호용 5자 변환

**예시**:
```typescript
encode(37.5665, 126.9780, 6) // 'wydm6v' (서울시청)
getNeighbors('wydm6v') // 중심 + 8방향 셀
anonymize('wydm6v') // 'wydm6' (분석용)
```

---

### 4. ✅ 스코어링 함수 구현 (`lib/search/score.ts`, 10.5KB)

**가중치** (블루프린트 사양 준수):
```typescript
Score = 0.40 * TextMatch      // BM25 + prefix bonus
      + 0.25 * GeoProximity   // exp(-dist/1200)
      + 0.20 * Freshness      // 7-day half-life
      + 0.15 * Popularity     // log10(saves/visits/posts)
      - Penalties;            // 중복/노이즈 감점
```

**구성 요소**:

#### 4.1 TextMatch (BM25 유사)
- Term Frequency (TF)
- Document length normalization
- Prefix matching bonus (+0.3)
- Exact matching bonus (+0.5)
- Field weighting:
  - name: 3.0x
  - nameEn: 2.0x
  - tags: 1.5x
  - description: 1.0x

#### 4.2 GeoProximity (지수 감쇠)
```typescript
score = exp(-distance / 1200)
// 0m: 1.0
// 600m: 0.61
// 1200m: 0.37
// 2400m: 0.14
```

#### 4.3 Freshness (7일 반감기)
```typescript
score = exp(-ln(2)/7 * days_since_creation)
// 0 days: 1.0
// 7 days: 0.5
// 14 days: 0.25
// 30 days: 0.06
```

#### 4.4 Popularity (로그 스케일)
```typescript
saveScore = log10(saveCount + 1) / log10(1001) * 3.0
visitScore = log10(visitCount + 1) / log10(10001) * 2.0
postScore = log10(postCount + 1) / log10(101) * 1.0
```

#### 4.5 Penalties
- 짧은 이름 (<2자): -0.5
- 포스트 없음: -0.1
- 테스트 데이터 패턴: -0.3

**주요 함수**:
- `calculateTextMatch()` - BM25 + prefix + exact
- `calculateGeoProximity()` - 거리 기반 지수 감쇠
- `calculateFreshness()` - 시간 기반 반감기
- `calculatePopularity()` - 로그 스케일 정규화
- `scorePlace()` - 통합 스코어링
- `scorePlaces()` - 다중 후보 정렬
- `calculateScoreCutoff()` - Jenks natural breaks

---

## ✅ 완료된 작업 (추가)

### 5. ✅ 검색 API 엔드포인트 구현
**파일**: `app/api/search/route.ts` (9.2KB, 350 lines)  
**상태**: ✅ 완료

**요구사항**:
- `GET /api/search?q=&lat=&lng=&radius=&limit=`
- 쿼리 정규화 → 토큰화 → 지오해시 필터 → 텍스트 매칭 → 스코어링 → 정렬
- Redis 캐싱 (인기 쿼리 5분 TTL)
- p95 레이턴시 ≤80ms 목표

**응답 형식**:
```json
{
  "took_ms": 27,
  "results": [
    {
      "place_id": "plc_x",
      "name": "커피바K",
      "distance_m": 420,
      "score": 0.84,
      "tags": ["카페", "디저트"],
      "last_post_at": "2025-11-10T12:30:00Z"
    }
  ],
  "total": 5,
  "query_normalized": "커피바k"
}
```

---

## ⏳ 대기 중 작업 (5/10)

### 6. 단위 테스트 작성
**대상**:
- `tokenize.test.ts` - 20 cases
  - 한글 자모 분해 (10)
  - 영문 2-gram (5)
  - 혼합 쿼리 (3)
  - 오타 매칭 (2)
- `score.test.ts` - 10 scenarios
  - BM25 계산
  - 거리 감쇠
  - 시간 반감기
  - 인기도 정규화
  - 통합 스코어링

### 7. 서울 쿼리 100문항 벤치마크
**유형**:
- 순한글 (30): 강남역, 홍대입구, 종로3가
- 영문 (20): Gangnam, Hongdae, Itaewon
- 혼합 (20): 강남 cafe, 홍대 맛집
- 오타 (20): 까페 → 카페, Gangnma → Gangnam
- 지명+카테고리 (10): 이태원 술집, 명동 디저트

**평가 기준**:
- Top-5 정확도 ≥80%
- 오타 매칭률 ≥90%

### 8. 부하 테스트
**시나리오**:
- 100 QPS sustained for 60s
- p95 레이턴시 ≤80ms
- 에러율 ≤0.5%
- CPU/메모리 모니터링

### 9. 분석 이벤트 추가
**이벤트**:
```typescript
// 검색 쿼리 (좌표 익명화)
{
  name: 'search_query',
  props: {
    q_len: 5,
    lang_guess: 'ko',
    geohash5: 'wydm6', // 익명화 (≈2.4km)
    result_count: 12
  }
}

// 결과 클릭
{
  name: 'search_result_click',
  props: {
    place_id: 'plc_x',
    rank: 2, // 2번째 결과
    score: 0.84
  }
}
```

### 10. 알림 규칙 설정
**메트릭**:
- 에러율 ≥1% (10분 윈도우) → 즉시 경보
- 캐시 미스율 ≥80% → 경고
- p95 레이턴시 ≥120ms → 경고

---

## 📊 진행률

```
Core Implementation:   ████████░░░░░░░░░░ 40% (4/10 완료)
  ✅ Tokenizer
  ✅ Geohash
  ✅ Scoring
  🔄 API Endpoint
  ⏳ Tests
  ⏳ Benchmark
  ⏳ Load Test
  ⏳ Analytics
  ⏳ Alerts
  ⏳ Documentation
```

---

## 🎯 다음 단계 (우선순위)

1. **API 엔드포인트 완성** - 캐싱 포함
2. **단위 테스트 20+10 cases** - 회귀 방지
3. **서울 쿼리 100문항 벤치** - 정확도 검증
4. **부하 테스트 100 QPS** - p95 ≤80ms 달성
5. **분석 이벤트 통합** - 익명화된 좌표

---

## 📁 파일 구조 (현재)

```
lib/search/
├── tokenize.ts       ✅ 8.1KB   (한글 자모 + 영문 2-gram)
├── geohash.ts        ✅ 7.8KB   (6자 인코딩 + 인접 셀)
├── score.ts          ✅ 10.5KB  (BM25 + 가중치)
├── normalize.ts      ⏳ TODO   (대소문자/특수문자) - Optional
├── indexer.ts        ⏳ TODO   (역색인 구축) - Optional
├── rank.ts           ⏳ TODO   (정렬/컷오프) - Optional
└── synonyms.ts       ⏳ TODO   (동의어/오탈자) - Optional

app/api/search/
└── route.ts          ✅ 9.2KB   (GET endpoint + LRU 캐싱)

perf/
├── search_load.js    ✅ 4.8KB   (k6 load test)
└── search_load.sh    ✅ 3.3KB   (bash load test)

__tests__/search/
├── tokenize.test.ts  ⏳ TODO   (20 cases)
├── geohash.test.ts   ⏳ TODO   (10 cases) - Optional
├── score.test.ts     ⏳ TODO   (10 scenarios)
└── route.spec.ts     ✅ 4.0KB   (10 integration tests)
```

---

## ✅ 합격 기준 (Phase 6)

| 지표 | 목표 | 현재 상태 |
|------|------|----------|
| p95 레이턴시 | ≤80ms (100 QPS) | ⏳ 미측정 |
| Top-5 정확도 | ≥80% (100문항) | ⏳ 미측정 |
| 오타 매칭률 | ≥90% (까페→카페) | ✅ 알고리즘 구현 |
| 에러율 | ≤0.5% | ⏳ 미측정 |
| 코드 커버리지 | ≥80% | ⏳ 0% |

---

## 🔗 참고 정보

- **Base Branch**: ux/phase2-3-major-minor-issues (c307673)
- **Current Branch**: search/phase6-core
- **Lines of Code**: ~26.4KB (3 files)
- **Functions Implemented**: 30+
- **Test Coverage**: 0% (pending)

---

**✨ 진행 상황**: 핵심 알고리즘 구현 완료 (토크나이저, 지오해시, 스코어링). API 엔드포인트 및 테스트 작성 대기 중.
