# ZZIK LIVE - Audit Package

**생성일**: 2025-11-13 08:59 UTC  
**브랜치**: ux/phase2-3-major-minor-issues  
**커밋**: 13bef66

## 📦 패키지 개요

이 진단 패키지는 ZZIK LIVE의 **Phase 5 완료 상태**를 종합적으로 분석하기 위한 모든 필수 아티팩트를 포함합니다.

## 📋 포함 항목

### 메타데이터 (_meta/)
- `runtime.txt` - Node/NPM 버전, Git 정보
- `repo_tree.txt` - 리포지토리 구조
- `branch.txt` - 현재 브랜치명
- `commit.txt` - 최신 커밋 해시
- `flags_snapshot.txt` - 피처 플래그 스냅샷
- `phase_status.md` - 페이즈별 진행 상태 상세 리포트

### 설정 파일
- `package.json` - 의존성 및 스크립트
- `next.config.ts` - Next.js 설정
- `tsconfig.json` - TypeScript 설정
- `globals.css` - 전역 스타일 및 디자인 토큰

### 앱 페이지 (app_tabs/)
- `(tabs)/feed/page.tsx` - 풀스크린 세로 피드
- `(tabs)/explore/page.tsx` - 지도 탐색 화면
- `(tabs)/layout.tsx` - 탭 레이아웃
- `page.tsx` - 루트 페이지
- `layout.tsx` - 루트 레이아웃

### 컴포넌트 (components/)
- `navigation/BottomTabBar.tsx` - 하단 네비게이션
- `feed/FeedItem.tsx` - 피드 아이템 (완전한 분석 계측)
- `feed/VerticalFeed.tsx` - 무한 스크롤 피드
- `map/Pin.tsx` - 지도 핀 마커
- `map/ClusterMarker.tsx` - 클러스터 마커
- 기타 UI 컴포넌트들 (design-system, states 등)

### Analytics 라이브러리 (analytics/)
- `schema.ts` - 10개 핵심 이벤트 타입 정의
- `client.ts` - Analytics SDK (배칭: 50 events / 10s / 100KB)
- `aliasing.ts` - 이벤트명 앨리어싱 시스템
- `flushOnHide.ts` - 페이지 숨김 시 즉시 플러시
- `ids.ts` - 디바이스/세션 ID 관리
- `README.md` - 통합 문서

### Experiments 라이브러리 (experiments/)
- `registry.ts` - 실험 기본 레지스트리
- `registry.v2.ts` - 가드레일 포함 강화 레지스트리
- `engine.ts` - MurmurHash3 기반 버켓팅 엔진
- `useExperiment.ts` - React 훅

### API 라우트 (api/)
- `analytics_route.ts` - 이벤트 수집 엔드포인트 (앨리어싱 통합)

### SQL 쿼리 (supabase/)
- `analytics_data_quality.sql` - 15개 DQ 모니터링 뷰
- `analytics_queries.sql` - 14개 핵심 대시보드 쿼리
- `analytics_advanced_queries.sql` - 10개 고급 분석 함수

### 샘플 데이터
- `events_sample.jsonl` - 10개 샘플 이벤트 (PII/GPS 제거)

## 🔒 보안 체크리스트

### ✅ 포함되지 않음
- `.env` 파일
- API 키/토큰
- 쿠키/세션 값
- 이메일/전화번호/실명
- 원본 GPS 좌표 (lat/lng)

### ✅ 정제 완료
- 샘플 이벤트의 PII 필드 제거
- 좌표 정보 삭제
- 디바이스 ID는 샘플 값으로 대체

## 📊 Phase 5 완료 요약

### Data Quality Monitoring (5 dimensions)
- **Completeness**: session_id, post_id 필수 필드 누락률 ≤0.5%
- **Uniqueness**: event_id 중복률 0%
- **Validity**: dwell_ms (0-600s), lcp_ms (0-30s) 범위 검증
- **Timeliness**: 인제스트 지연 p95 ≤60s
- **Consistency**: 라이프사이클 쌍 오펀율 ≤10%

### Event Name Aliasing
- 4단계 폐기 정책 (주 1-2 → 주 3-4 → 주 5-8 → 월 3+)
- `post_view` → `post_view_start` 예시 구현
- 마이그레이션 추적용 `original_name` 보존

### Enhanced Experiments (3개)
1. **feed_caption_lines**: 1줄 vs 2줄 캡션 (기본 + 10% 리프트 목표)
2. **place_sheet_default_sort**: 거리순 vs 인기순 기본값
3. **map_pin_size**: 32px vs 40px 핀 크기

**가드레일**:
- LCP p75 ≤2500ms
- 에러율 ≤0.3%
- 인제스트 성공률 ≥97%

### Advanced Dashboard Queries (10개)
- 체류시간 백분위수 (p50/p75/p90/p95/p99)
- 실험 리프트 분석 (dwell, action)
- 사용자 여정 퍼널 (6단계)
- 코호트 리텐션 (D1/D3/D7/D14/D30)
- 파워유저 세그멘테이션 (4단계)
- 클럭 스큐/라이프사이클/세션 품질 검증

## 🎯 다음 단계: Phase 6 - 검색 1.0

### 목표
- p95 레이턴시 ≤80ms (100 QPS 부하)
- Top-5 정확도 ≥80% (수동 평가)
- 오타 매칭률 ≥90% (까페 → 카페)

### 산출물
1. `lib/search/tokenize.ts` - 한글 자모 분해 + 영문 2-gram
2. Geohash 기반 색인 (6자리 정밀도 ~600m)
3. BM25 + GeoProximity + Freshness + Popularity 스코어링
4. `/api/search` 엔드포인트 (캐싱 포함)
5. 유닛/통합/부하 테스트

## 📖 사용 방법

### 전체 진단 요청 (권장)

```
첨부한 zzik_audit.zip을 기준으로 ZZIK 전체를 심층 진단해라.
목표: 탐색/소비 분리 품질, 접근성·성능, 분석·실험 운용성, 보안/프라이버시 하드닝 점검.
산출: 이슈 요약(블로커/메이저/마이너), 수정 코드(파일/라인 지정), 수용 기준(AC), QA/모니터링 체크리스트, 즉시 가능한 PR 단위 제안 5개.
제약: .env/키/원본 좌표/PII 불포함.
```

### Analytics 전용 진단

```
첨부 코드/SQL/이벤트 샘플로 Analytics/실험만 검증해라.
목표: 누락/중복/드리프트/가드레일. 산출: 인제스트 하드닝·대시보드 쿼리·알림 임계치.
```

### 성능 전용 진단

```
Lighthouse/Web‑Vitals/코드 조각으로 /feed·/explore 병목을 찾아 즉시 패치를 제시해라.
산출: 코드 블록, 개선폭, 회귀 테스트.
```

## 🔍 주요 파일 찾기

- **이벤트 스키마**: `analytics/schema.ts`
- **SDK 구현**: `analytics/client.ts`
- **앨리어싱**: `analytics/aliasing.ts`
- **실험 설정**: `experiments/registry.v2.ts`
- **DQ 모니터링**: `supabase/analytics_data_quality.sql`
- **고급 쿼리**: `supabase/analytics_advanced_queries.sql`
- **인제스트 엔드포인트**: `api/analytics_route.ts`
- **피드 계측**: `components/feed/FeedItem.tsx`

## 📈 주요 메트릭 임계값

| 지표 | 임계값 | 비고 |
|-----|-------|------|
| Missing rate | ≤0.5% | Required fields |
| Duplicate rate | 0% | event_id uniqueness |
| Ingestion lag p95 | ≤60s | Server-client time diff |
| Orphan rate | ≤10% | Lifecycle pairs |
| LCP p75 | ≤2500ms | Performance guardrail |
| Error rate | ≤0.3% | Quality guardrail |
| Ingestion success | ≥97% | Business guardrail |
| Crash-free sessions | ≥99.8% | Reliability SLO |

## 🛠 개발 환경

- **Node**: v20.19.5
- **NPM**: 10.8.2
- **브랜치**: ux/phase2-3-major-minor-issues
- **커밋**: 13bef66
- **Dev Server**: Port 3005 (running)

---

**준비 완료**: 이 패키지는 ZZIK LIVE의 코드 품질, UX/UI, 성능, 분석, 실험, 보안을 종합적으로 진단하기 위한 모든 필수 아티팩트를 포함합니다.
