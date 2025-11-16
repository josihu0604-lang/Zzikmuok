# ZZIK LIVE - 진단 아티팩트 제출 가이드

## 📦 생성 완료

**패키지**: `zzik_audit.zip` (160KB, 81 파일)  
**생성일시**: 2025-11-13 09:01 UTC  
**브랜치**: ux/phase2-3-major-minor-issues  
**커밋**: 13bef66  
**Phase 상태**: Phase 5 완료 ✅, Phase 6 준비 중 🔴

---

## 🎯 즉시 사용 가능한 요청 문구

### ✅ 추천: 전체 진단 (코드+UX+성능+분석+보안)

```
첨부한 zzik_audit.zip을 기준으로 ZZIK 전체를 심층 진단해라.
목표: 탐색/소비 분리 품질, 접근성·성능, 분석·실험 운용성, 보안/프라이버시 하드닝 점검.
산출: 이슈 요약(블로커/메이저/마이너), 수정 코드(파일/라인 지정), 수용 기준(AC), QA/모니터링 체크리스트, 즉시 가능한 PR 단위 제안 5개.
제약: .env/키/원본 좌표/PII 불포함.
```

**기대 산출물**:
- ✅ 블로커/메이저/마이너 이슈 분류표
- ✅ 파일/라인 단위 수정 코드 스니펫
- ✅ 수용 기준 (Acceptance Criteria)
- ✅ QA/모니터링 체크리스트
- ✅ 즉시 적용 가능한 PR 제안 5개

---

### 옵션 A: Analytics/실험 전용 진단

```
첨부 코드/SQL/이벤트 샘플로 Analytics/실험만 검증해라.
목표: 누락/중복/드리프트/가드레일 검증.
산출: 인제스트 하드닝 코드, 대시보드 쿼리, 알림 임계치 설정.
```

**포함 항목**:
- `analytics/` - SDK, 스키마, 앨리어싱 (6파일)
- `experiments/` - 레지스트리 v1/v2, 엔진, 훅 (4파일)
- `supabase/` - DQ 모니터링 15개 뷰, 고급 쿼리 10개 함수 (3 SQL 파일)
- `api/analytics_route.ts` - 인제스트 엔드포인트
- `events_sample.jsonl` - 10개 샘플 이벤트 (PII/GPS 제거)

---

### 옵션 B: UX/UI 전용 진단

```
Explore(지도)·Feed(풀스크린)·Place Sheet의 UX/UI만 평가해라.
목표: 맥락 분리, 가독성/AA 대비, 터치 48×48, 상태(로딩/빈/오류) 준수.
산출: 화면별 문제→원인→UI 스펙, 토큰/컴포넌트 규격표, 접근성 점검표.
```

**포함 항목**:
- `app_tabs/(tabs)/explore/page.tsx` - 지도 탐색 화면
- `app_tabs/(tabs)/feed/page.tsx` - 풀스크린 피드
- `components/navigation/BottomTabBar.tsx` - 하단 탭바
- `components/feed/FeedItem.tsx` - 피드 아이템 (완전 계측)
- `components/map/Pin.tsx` + `ClusterMarker.tsx` - 지도 마커
- `globals.css` - 디자인 토큰 및 전역 스타일

---

### 옵션 C: 성능/접근성 전용 진단

```
/feed·/explore 성능·접근성만 분석해ra.
목표: LCP/INP/CLS p75 개선, 번들·이미지·비디오 최적화, axe AA 통과.
산출: 병목→패치 코드→예상 개선폭(정량), 회귀 테스트 항목, 성능 예산.
```

**필요 시 추가 수집**:
```bash
# Lighthouse 리포트 생성 (로컬 실행)
npx lighthouse http://localhost:3005/home --quiet --chrome-flags="--headless" \
  --output=json --output-path=lh_feed.json
npx lighthouse http://localhost:3005/map --quiet --chrome-flags="--headless" \
  --output=json --output-path=lh_explore.json
```

---

## 📋 패키지 내용물 (160KB, 81파일)

```
zzik_audit/
├── README.md                        # 패키지 개요 및 사용 가이드
├── _meta/                           # 메타데이터 (6파일)
│   ├── runtime.txt                  # Node v20.19.5, NPM 10.8.2
│   ├── branch.txt                   # ux/phase2-3-major-minor-issues
│   ├── commit.txt                   # 13bef66
│   ├── repo_tree.txt                # 리포지토리 구조
│   ├── flags_snapshot.txt           # 피처 플래그 현재 상태
│   └── phase_status.md              # Phase 1-11 진행 상황 상세
├── package.json                     # 의존성 목록
├── next.config.ts                   # Next.js 설정
├── tsconfig.json                    # TypeScript 설정
├── globals.css                      # 디자인 토큰 + 전역 스타일
├── app_tabs/                        # 앱 페이지 (7파일)
│   ├── (tabs)/explore/page.tsx      # 지도 탐색
│   ├── (tabs)/feed/page.tsx         # 풀스크린 피드
│   └── layout.tsx                   # 레이아웃
├── components/                      # UI 컴포넌트 (50+파일)
│   ├── navigation/BottomTabBar.tsx  # 하단 탭바
│   ├── feed/FeedItem.tsx            # 피드 아이템 (완전 계측)
│   ├── feed/VerticalFeed.tsx        # 무한 스크롤
│   ├── map/Pin.tsx                  # 지도 핀
│   ├── map/ClusterMarker.tsx        # 클러스터 마커
│   └── ...                          # design-system, states 등
├── analytics/                       # Analytics 라이브러리 (6파일)
│   ├── schema.ts                    # 10개 이벤트 타입
│   ├── client.ts                    # SDK (배칭: 50/10s/100KB)
│   ├── aliasing.ts                  # 이벤트명 앨리어싱
│   ├── flushOnHide.ts               # 페이지 숨김 시 플러시
│   ├── ids.ts                       # 디바이스/세션 ID
│   └── README.md                    # 통합 문서
├── experiments/                     # Experiments 라이브러리 (4파일)
│   ├── registry.ts                  # 기본 레지스트리
│   ├── registry.v2.ts               # 가드레일 포함 강화판
│   ├── engine.ts                    # MurmurHash3 버켓팅
│   └── useExperiment.ts             # React 훅
├── api/                             # API 라우트
│   └── analytics_route.ts           # 이벤트 수집 엔드포인트
├── supabase/                        # SQL 쿼리 (5파일)
│   ├── analytics_data_quality.sql   # 15개 DQ 모니터링 뷰
│   ├── analytics_queries.sql        # 14개 핵심 대시보드 쿼리
│   └── analytics_advanced_queries.sql # 10개 고급 분석 함수
└── events_sample.jsonl              # 10개 샘플 이벤트 (PII/GPS 제거)
```

---

## 🔒 보안 점검 완료 ✅

### ❌ 제외된 항목 (절대 포함 안 됨)
- `.env*` 파일
- API 키/토큰/시크릿
- 쿠키/세션 값
- 이메일/전화번호/실명
- **원본 GPS 좌표 (lat/lng)**

### ✅ 정제 완료
- 샘플 이벤트의 PII 필드 완전 제거
- 좌표 정보 삭제 (`lat`, `lng`, `latitude`, `longitude`)
- 디바이스 ID는 샘플 값으로 대체 (`dev_sample_001`)

---

## 📊 현재 상태 스냅샷

### Phase 5 완료 항목 ✅
1. **Data Quality Monitoring** (15 SQL 뷰)
   - Completeness: session_id 누락률 ≤0.5%
   - Uniqueness: event_id 중복률 0%
   - Validity: dwell_ms (0-600s), lcp_ms (0-30s)
   - Timeliness: 인제스트 지연 p95 ≤60s
   - Consistency: 라이프사이클 쌍 오펀율 ≤10%

2. **Event Name Aliasing** (4단계 폐기 정책)
   - `post_view` → `post_view_start` 예시
   - 마이그레이션 추적 (`original_name` 보존)

3. **Enhanced Experiment Registry** (3개 실험)
   - `feed_caption_lines`: 1줄 vs 2줄 (10% 리프트 목표)
   - `place_sheet_default_sort`: 거리순 vs 인기순
   - `map_pin_size`: 32px vs 40px
   - **가드레일**: LCP ≤2500ms, 에러율 ≤0.3%, 인제스트 ≥97%

4. **Advanced Dashboard Queries** (10개 함수)
   - 체류시간 백분위수 (p50/p75/p90/p95/p99)
   - 실험 리프트 분석 (dwell, action)
   - 사용자 여정 퍼널 (6단계)
   - 코호트 리텐션 (D1/D3/D7/D14/D30)
   - 파워유저 세그멘테이션 (4단계)

### Phase 6 준비 완료 🔴
**다음 작업**: Place Search 1.0 구현
- 한글 자모 분해 + 영문 2-gram 토크나이저
- Geohash 기반 색인 (6자리 ~600m)
- BM25 + GeoProximity + Freshness + Popularity 스코어링
- `/api/search` 엔드포인트 (캐싱)
- **목표**: p95 ≤80ms, Top-5 정확도 ≥80%, 오타 매칭 ≥90%

---

## 🎯 주요 메트릭 임계값

| 카테고리 | 지표 | 임계값 | Phase |
|---------|------|--------|-------|
| **DQ** | Missing rate | ≤0.5% | 5 |
| **DQ** | Duplicate rate | 0% | 5 |
| **DQ** | Ingestion lag p95 | ≤60s | 5 |
| **DQ** | Orphan rate | ≤10% | 5 |
| **성능** | LCP p75 | ≤2500ms | 5 (가드레일) |
| **품질** | Error rate | ≤0.3% | 5 (가드레일) |
| **비즈니스** | Ingestion success | ≥97% | 5 (가드레일) |
| **신뢰성** | Crash-free sessions | ≥99.8% | 10 (목표) |
| **참여** | Feed dwell p50 | 기본 + 10% | 실험 목표 |
| **검색** | p95 latency | ≤80ms | 6 (목표) |
| **검색** | Top-5 accuracy | ≥80% | 6 (목표) |
| **검색** | Typo match rate | ≥90% | 6 (목표) |

---

## 🚀 제출 절차

### 1단계: 패키지 다운로드
```bash
# 패키지 위치 확인
ls -lh /home/user/webapp/zzik-live/zzik_audit.zip
# 160K 파일 확인됨
```

### 2단계: 요청 문구 선택
위의 **3가지 옵션** 중 하나를 선택하거나, **전체 진단 (추천)**을 사용

### 3단계: 첨부 + 제출
1. `zzik_audit.zip` 파일 첨부
2. 선택한 요청 문구 복사-붙여넣기
3. 제출

### 4단계: 추가 정보 제공 (필요 시)
진단 중 추가 정보가 필요한 경우:
- Lighthouse JSON 리포트
- 스크린샷 (Explore/Feed/Place Sheet/상태 화면)
- 에러 로그 또는 콘솔 출력
- HAR 파일 (네트워크 트래픽)

---

## 📈 기대 결과물

### 전체 진단 선택 시
1. **이슈 요약표** (블로커/메이저/마이너 분류)
2. **수정 코드 스니펫** (파일명/라인 번호 지정)
3. **수용 기준 (AC)** (각 수정사항별)
4. **QA 체크리스트** (회귀 테스트 항목)
5. **모니터링 설정** (알림 임계값, 대시보드 쿼리)
6. **즉시 적용 가능한 PR 제안 5개**

### Analytics 전용 선택 시
1. **인제스트 하드닝 코드** (중복 방지, 검증 강화)
2. **대시보드 쿼리** (추가 분석 뷰)
3. **알림 규칙** (Slack/PagerDuty 통합)
4. **실험 가드레일 검증 로직**

### UX/UI 전용 선택 시
1. **화면별 문제점 → 원인 → 개선안**
2. **디자인 토큰 규격표** (색상/타이포/간격)
3. **컴포넌트 접근성 점검표** (WCAG AA 준수)
4. **터치 타겟 크기 검증**

### 성능 전용 선택 시
1. **병목 지점 식별** (LCP/INP/CLS 개선)
2. **패치 코드** (즉시 적용 가능)
3. **예상 개선폭** (정량 지표)
4. **성능 예산** (각 페이지별)
5. **회귀 테스트 항목**

---

## ✅ 최종 체크리스트

- [x] `zzik_audit.zip` 생성 완료 (160KB)
- [x] 81개 파일 포함 (TypeScript 63, SQL 5, JSON 2, Markdown 3)
- [x] PII/GPS 정제 완료 (샘플 이벤트 10개)
- [x] 보안 검증 완료 (.env/키/토큰 제외)
- [x] README.md 작성 완료
- [x] Phase 상태 리포트 작성 완료
- [x] 요청 문구 3종 준비 완료
- [x] 메타데이터 수집 완료 (runtime, git, flags)

---

## 🔗 참고 링크

- **브랜치**: ux/phase2-3-major-minor-issues
- **최신 커밋**: 13bef66
- **Dev Server**: Port 3005 (running)
- **Node**: v20.19.5
- **NPM**: 10.8.2

---

**준비 완료**: 위의 요청 문구 중 하나를 선택하여 `zzik_audit.zip`과 함께 제출하면 즉시 진단을 시작할 수 있습니다.
