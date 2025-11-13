# 🎨 ZZIK LIVE UX/UI 기획설계서 v1.0
## Multi-Agent 교차검증 완료

**작성일**: 2025-11-12  
**버전**: 1.0 (최종)  
**상태**: Production Ready

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [UX Research & User Journey](#ux-research--user-journey)
3. [Information Architecture](#information-architecture)
4. [Visual Design System](#visual-design-system)
5. [Interaction Design](#interaction-design)
6. [Component Library](#component-library)
7. [Screen Specifications](#screen-specifications)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Mobile Optimization](#mobile-optimization)
10. [Business Alignment](#business-alignment)
11. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Executive Summary

### 1.1 프로젝트 개요
ZZIK LIVE는 GPS 기반 삼중 검증을 통해 나노 크리에이터와 로컬 비즈니스를 연결하는 모바일 우선 플랫폼입니다. 본 문서는 7개 전문 Agent의 교차검증을 통해 완성된 UX/UI 기획설계서이며, 비즈니스 목표와 사용자 경험을 완벽하게 정렬한 실행 가능한 설계를 제공합니다.

### 1.2 핵심 디자인 원칙
1. **모바일 우선 (Mobile-First)**: 390x844px 기준, 모든 인터랙션 터치 최적화
2. **5초 이해 (5-Second Rule)**: 어떤 화면이든 5초 내 목적 파악 가능
3. **3탭 도달 (3-Tap Rule)**: 모든 기능이 3번 탭 이내 접근 가능
4. **즉각 피드백 (Instant Feedback)**: 모든 액션에 0.3초 이내 시각적 피드백
5. **신뢰 구축 (Trust Building)**: 삼중 검증 프로세스를 시각화하여 신뢰도 강화

### 1.3 Target Metrics
- **크리에이터 온보딩**: 5분 이내 첫 미션 완료 80%
- **검증 성공률**: GPS+QR+영수증 삼중 검증 95% 이상
- **정산 만족도**: 24시간 내 입금 100%, NPS 70+ 목표
- **파트너 전환율**: 무료 체험 → 유료 전환 60%
- **재방문율**: 월 3회 이상 재방문 크리에이터 70%

---

## 2. UX Research & User Journey

### 2.1 사용자 페르소나

#### 페르소나 1: 나노 크리에이터 "민지" (25세, 대학생)

**기본 정보**
- 학력: 홍익대학교 시각디자인과 4학년
- SNS: 인스타그램 팔로워 3,200명 (평균 좋아요 150개)
- 월소득: 알바 80만원 + 부모님 용돈 30만원
- 거주지: 서울 마포구 상수동 (홍대 근처)

**일상 루틴**
- 오전: 학교 수업 (10시~12시)
- 점심: 친구들과 홍대/상수동 카페 투어
- 오후: 도서관 과제 or 아르바이트
- 저녁: SNS 체크, 인스타 스토리 업로드

**목표 & 니즈**
- **주 목표**: 학비와 생활비 벌기, 졸업 포트폴리오 제작
- **부 목표**: 인플루언서로 성장, 마케팅 경험 쌓기
- **Pain Points**:
  - 기존 알바는 시간 구속이 심함 (최소 3시간)
  - 프리랜서 의뢰는 경쟁이 치열하고 단가가 낮음
  - 대형 인플루언서는 팔로워가 부족해서 불가능
  - 허위 리뷰 요청 시 도덕적 갈등

**ZZIK 사용 동기**
- ✅ 평소 가던 카페에서 사진 찍고 돈 벌기
- ✅ 유연한 시간, 자유로운 콘텐츠 제작
- ✅ 실제 사용 후기이므로 진정성 있음
- ✅ 포트폴리오로 활용 가능 (마케팅 경험)

**기술 능숙도**
- 스마트폰: ⭐⭐⭐⭐⭐ (Expert)
- 인스타그램: ⭐⭐⭐⭐⭐ (Expert)
- 사진 편집: ⭐⭐⭐⭐ (Advanced)
- 새 앱 학습: ⭐⭐⭐⭐ (Advanced)

**선호 브랜드 & 앱**
- SNS: Instagram, TikTok, YouTube Shorts
- 금융: 토스, 네이버페이, 카카오페이
- 쇼핑: 무신사, 29CM, 지그재그
- 푸드: 배달의민족, 요기요, 카카오맵

---

#### 페르소나 2: 로컬 비즈니스 오너 "재훈" (35세, 카페 운영)

**기본 정보**
- 사업: 성수동 "카페 재훈" 운영 (오픈 3개월차)
- 학력: 경영학과 졸업
- 월매출: 3천만원 (목표 5천만원)
- 직원: 2명 (아르바이트)

**비즈니스 현황**
- 오픈 초기라 인지도 부족 (인스타 팔로워 500명)
- 주말 성수기는 손님이 많지만 평일이 한산함
- 신메뉴(시그니처 라떼) 출시했으나 반응 미미
- SNS 마케팅 노하우 부족, 셀프 사진은 퀄리티 낮음

**목표 & 니즈**
- **주 목표**: 인지도 확보, 단골 고객 확보, 월매출 5천만원
- **부 목표**: SNS 팔로워 5천명, 인스타 핫플 등극
- **Pain Points**:
  - 인플루언서 섭외 비용 수백만원 (예산 초과)
  - 광고 효과 측정 어려움 (ROI 불명확)
  - 허위 리뷰 걱정 (실제 방문 안 한 사람)
  - 콘텐츠 제작 시간 부족 (운영에 집중)

**ZZIK 사용 동기**
- ✅ 진짜 방문한 사람만 리뷰 작성 (GPS 검증)
- ✅ 월 150만원으로 무제한 콘텐츠 제작
- ✅ 실시간 콘텐츠 확인 및 SNS 자동 공유
- ✅ 방문자 데이터 분석 (시간대, 재방문율)

**기술 능숙도**
- 스마트폰: ⭐⭐⭐ (Intermediate)
- PC 대시보드: ⭐⭐⭐⭐ (Advanced)
- SNS 운영: ⭐⭐⭐ (Intermediate)
- 데이터 분석: ⭐⭐ (Beginner)

**경쟁사 경험**
- 네이버플레이스: 광고 비용 월 100만원, 효과 미미
- 인스타그램 광고: 월 50만원, 클릭은 많지만 방문 전환 낮음
- 쿠팡이츠: 배달 수수료 15%, 마진 감소

---

### 2.2 사용자 여정 맵 (Customer Journey Map)

#### 크리에이터 여정: "첫 미션 완료까지"

| 단계 | 시간 | 액션 | 터치포인트 | 감정 | Pain Point | 해결 방안 |
|------|------|------|-----------|------|------------|----------|
| **1. 발견** | Day 0 | 인스타 광고 발견 | 광고 크리에이티브 | 🤔 궁금함 | "또 사기 아냐?" | 실제 후기 3개, 투명한 정산 내역 스크린샷 |
| **2. 클릭** | +10초 | 앱스토어 이동 | App Store / Play Store | 😊 기대감 | 평점이 낮으면 이탈 | 초기 시드 유저 5점 리뷰 50개 확보 |
| **3. 다운로드** | +30초 | 앱 설치 | 앱스토어 | 😐 대기 | 설치 시간 길면 이탈 | 앱 크기 최소화 (50MB 이하) |
| **4. 회원가입** | +1분 | 네이버 간편 로그인 | 온보딩 화면 | 😊 편리함 | 입력 항목 많으면 이탈 | 네이버/카카오 간편 로그인, 닉네임만 입력 |
| **5. 온보딩** | +2분 | 튜토리얼 시청 | 스와이프 튜토리얼 | 😐 지루함 | 튜토리얼 길면 스킵 | 좋은 사진 예시 10개, 스킵 가능, 3단계 이내 |
| **6. 권한 허용** | +3분 | GPS + 카메라 권한 | 시스템 팝업 | 😰 불안 | "왜 위치 정보가 필요하지?" | 권한 필요 이유 명확히 설명 (미션 매칭용) |
| **7. 미션 발견** | +4분 | 근처 미션 3개 표시 | 지도 화면 | 😃 놀라움 | 미션이 없으면 실망 | 서울 전역 20개 파트너 최소 확보 |
| **8. 미션 선택** | +4분 30초 | "성수 카페" 선택 | 미션 상세 | 😊 관심 | 보상이 적으면 동기 하락 | 최소 1만 5천원, 거리별 차등 보상 |
| **9. 이동** | +5분~20분 | 카페로 이동 | 오프라인 | 😐 평소대로 | 멀면 포기 | 반경 500m 이내 미션 우선 추천 |
| **10. 도착** | +20분 | GPS 자동 인식 | 앱 푸시 알림 | 😊 편리함 | GPS 안 잡히면 당황 | Wi-Fi + iBeacon 백업 |
| **11. 주문** | +25분 | 메뉴 주문 및 결제 | 매장 POS | 😊 만족 | 최소 주문 금액 부담 | 파트너에게 최소 주문 권장하지 않도록 |
| **12. 사진 촬영** | +30분 | 음식/인테리어 촬영 | 앱 카메라 | 😃 즐거움 | 어떤 사진이 좋은지 모름 | AI 실시간 피드백, 구도 가이드 |
| **13. QR 스캔** | +32분 | 테이블 QR 스캔 | 앱 QR 스캐너 | 😊 신기함 | QR이 없으면? | 파트너에게 QR 스티커 무료 제공 |
| **14. 영수증 업로드** | +35분 | 영수증 사진 업로드 | 앱 OCR | 😅 긴장 | OCR 인식 실패 시 | 수동 입력 옵션 제공 |
| **15. 검증 대기** | +35분 | 서버 검증 중 | 로딩 화면 | 😰 불안 | 검증 시간 길면 불안 | 3초 이내 검증, 진행률 표시 |
| **16. 완료** | +36분 | "검증 완료!" 알림 | 성공 화면 | 🎉 기쁨 | 정산 지연 시 불만 | 24시간 내 입금 보장, 예정 시각 표시 |
| **17. 공유** | +40분 | 인스타 스토리 공유 | 공유 버튼 | 😎 자랑 | 공유 귀찮으면 안 함 | 1탭 공유, 스토리 템플릿 자동 생성 |

**핵심 인사이트**
- ⚠️ **Critical Path**: 발견 → 가입 → 첫 미션 완료까지 36분
- 🎯 **Drop-off Points**: 회원가입 (30%), 온보딩 (20%), 첫 미션 선택 (15%)
- 💡 **Quick Win**: 첫 미션 보너스 2만원으로 이탈 방지
- 📊 **Success Metric**: 5분 이내 첫 미션 매칭 80%, 1시간 내 완료 60%

---

#### 파트너 여정: "계약 후 첫 미션 등록까지"

| 단계 | 시간 | 액션 | 터치포인트 | 감정 | Pain Point | 해결 방안 |
|------|------|------|-----------|------|------------|----------|
| **1. 인지** | Week 0 | 영업 미팅 or 웹사이트 | 영업 자료 | 🤔 회의적 | "효과 있을까?" | 실제 성공 사례 3개, ROI 계산기 |
| **2. 제안** | +1일 | 무료 1개월 체험 제안 | 계약서 | 😊 호기심 | 계약서가 복잡함 | 1페이지 요약본, 주요 조항 하이라이트 |
| **3. 계약** | +3일 | 월 150만원 결제 | 전자계약 | 😰 부담 | 돈이 아까움 | 6개월 약정 시 20% 할인 |
| **4. 온보딩** | +3일 | 대시보드 접속 | PC 웹 | 😐 익숙함 | 설정이 복잡하면 포기 | 영업 담당자가 화면 공유로 직접 설정 |
| **5. 미션 생성** | +3일 1시간 | 첫 미션 등록 | 대시보드 | 😊 기대감 | UI가 어려움 | 템플릿 5개 제공 (신메뉴, 오픈, 이벤트 등) |
| **6. QR 설치** | +4일 | QR 스티커 받기 | 오프라인 | 😊 만족 | QR 위치 모름 | 설치 가이드 동영상, 추천 위치 안내 |
| **7. 크리에이터 대기** | +5일 | 첫 크리에이터 방문 | 대시보드 알림 | 😰 초조함 | 크리에이터가 안 오면? | 초기 3일간 플랫폼에서 직접 크리에이터 매칭 |
| **8. 콘텐츠 확인** | +5일 | 크리에이터 콘텐츠 검토 | 대시보드 | 😃 만족 | 퀄리티 낮은 콘텐츠 | AI 필터링, 재촬영 요청 옵션 |
| **9. SNS 공유** | +5일 | 인스타 자동 공유 | 인스타 연동 | 😊 편리함 | 공유 권한 설정 복잡 | 1클릭 연동, 사전 승인 |
| **10. 데이터 확인** | +7일 | 주간 리포트 확인 | 이메일 + 대시보드 | 😊 만족 or 😞 불만 | ROI가 안 보임 | 방문자 증가율, 인스타 도달률 표시 |

**핵심 인사이트**
- ⚠️ **Critical Path**: 계약 → 첫 미션 등록 → 첫 크리에이터 매칭까지 5일
- 🎯 **Drop-off Points**: 계약 (40%), 미션 생성 (20%), 갱신 결정 (30%)
- 💡 **Quick Win**: 무료 1개월 체험으로 효과 검증
- 📊 **Success Metric**: 10분 내 첫 미션 등록 90%, 갱신율 80%

---

### 2.3 핵심 UX 목표

#### 크리에이터 UX 목표 (SMART Goals)

1. **가입 전환율**
   - Metric: 앱 다운로드 → 회원가입 완료
   - Target: 60% (업계 평균 40%)
   - Timeline: 출시 후 3개월 내 달성

2. **첫 미션 완료율**
   - Metric: 가입 → 첫 미션 완료
   - Target: 50% (1시간 내), 80% (24시간 내)
   - Timeline: 출시 후 6개월 내 달성

3. **검증 성공률**
   - Metric: 미션 제출 → 검증 완료
   - Target: 95% 이상 (GPS+QR+영수증 삼중 검증)
   - Timeline: MVP 단계부터 유지

4. **정산 만족도**
   - Metric: NPS (Net Promoter Score)
   - Target: 70+ (24시간 내 입금 100% 달성 시)
   - Timeline: 출시 후 1년 내 달성

5. **재방문율 (Retention)**
   - Metric: 월 3회 이상 미션 참여
   - Target: 70% (MAU 기준)
   - Timeline: 출시 후 1년 내 달성

#### 파트너 UX 목표 (SMART Goals)

1. **온보딩 완료율**
   - Metric: 계약 → 첫 미션 등록
   - Target: 90% (10분 이내)
   - Timeline: 출시 후 3개월 내 달성

2. **크리에이터 매칭 속도**
   - Metric: 미션 등록 → 첫 크리에이터 방문
   - Target: 평균 48시간 이내
   - Timeline: 파트너 20개 확보 후

3. **콘텐츠 만족도**
   - Metric: 파트너 평가 (5점 척도)
   - Target: 평균 4.5점 이상
   - Timeline: 출시 후 6개월 내 달성

4. **ROI 명확성**
   - Metric: "ROI를 이해합니다" 응답률
   - Target: 90% (대시보드 데이터 기반)
   - Timeline: 출시 후 6개월 내 달성

5. **계약 갱신율**
   - Metric: 6개월 계약 만료 → 갱신
   - Target: 80% (Lock-in 메커니즘 포함)
   - Timeline: 출시 후 1년 내 달성

---

## 3. Information Architecture

### 3.1 사이트맵 (Sitemap)

```
ZZIK LIVE 앱 구조
│
├── 🏠 홈 (Home)
│   ├── 근처 미션 리스트 (Nearby Missions)
│   ├── 인기 미션 (Trending)
│   ├── 카테고리 필터 (Category Filter)
│   └── 검색 (Search)
│
├── 🗺️ 지도 (Map)
│   ├── 인터랙티브 지도 (Interactive Map)
│   ├── 위치 핀 (Location Pins)
│   ├── 하단 드로어 (Bottom Drawer)
│   │   ├── 선택된 위치 정보
│   │   ├── 미션 상세
│   │   └── 사진 갤러리
│   └── 필터 (Filters)
│       ├── 거리 (Distance)
│       ├── 보상 (Reward)
│       └── 카테고리 (Category)
│
├── 📸 미션 (Mission)
│   ├── 미션 상세 (Mission Detail)
│   ├── 진행 중인 미션 (Ongoing)
│   ├── 완료된 미션 (Completed)
│   └── 미션 수행 (Mission Execution)
│       ├── 1. GPS 검증
│       ├── 2. 사진 촬영
│       ├── 3. QR 스캔
│       └── 4. 영수증 업로드
│
├── 💰 보상 (Rewards)
│   ├── 누적 보상 (Total Earnings)
│   ├── 정산 예정 (Pending)
│   ├── 정산 완료 (Completed)
│   └── 출금 (Withdrawal)
│
└── 👤 프로필 (Profile)
    ├── 내 정보 (My Info)
    ├── 미션 히스토리 (Mission History)
    ├── 포트폴리오 (Portfolio)
    ├── 설정 (Settings)
    │   ├── 알림 설정
    │   ├── 위치 권한
    │   ├── 결제 정보
    │   └── 로그아웃
    └── 고객 지원 (Support)
        ├── FAQ
        ├── 1:1 문의
        └── 공지사항
```

### 3.2 네비게이션 구조

#### Bottom Navigation (크리에이터 앱)
```
┌─────────────────────────────────────┐
│  🏠 홈    🗺️ 지도    ➕ 미션    💰 보상    👤 프로필  │
└─────────────────────────────────────┘
```

**네비게이션 아이콘 설명**
- **🏠 홈 (Home)**: 근처 미션 리스트, 인기 미션, 검색
- **🗺️ 지도 (Map)**: 지도 기반 미션 탐색, 위치 핀 선택
- **➕ 미션 (Mission)**: 진행 중/완료 미션, 미션 수행
- **💰 보상 (Rewards)**: 누적 보상, 정산 내역, 출금
- **👤 프로필 (Profile)**: 내 정보, 설정, 고객 지원

#### 탭 활성화 규칙
```typescript
// 활성 탭 시각적 피드백
const activeTab = {
  color: '#7B6FDB',        // Primary Purple
  iconWeight: 'bold',      // 600 or 700
  fontSize: '12px',
  animation: 'scale(1.1)'  // Slight scale up
};

const inactiveTab = {
  color: '#9CA3AF',        // Gray-400
  iconWeight: 'regular',   // 400
  fontSize: '12px',
  animation: 'none'
};
```

### 3.3 화면 간 전환 플로우

#### 미션 수행 플로우
```
[홈 화면]
    ↓ 탭
[미션 상세]
    ↓ "시작하기" 버튼
[위치 검증 중...]
    ↓ GPS 성공
[사진 촬영 안내]
    ↓ 카메라 열기
[사진 촬영 화면]
    ↓ 촬영 완료
[사진 프리뷰]
    ↓ "다음" 버튼
[QR 스캔 안내]
    ↓ QR 스캐너 열기
[QR 스캔 중...]
    ↓ 스캔 성공
[영수증 업로드 안내]
    ↓ 갤러리 열기
[영수증 선택]
    ↓ OCR 처리
[검증 중... (3초)]
    ↓ 검증 완료
[성공 화면]
    ↓ "공유하기" or "닫기"
[홈 화면]
```

#### 파트너 대시보드 플로우
```
[로그인]
    ↓
[대시보드 홈]
    ├── [미션 관리]
    │       ├── [미션 생성]
    │       ├── [미션 수정]
    │       └── [미션 삭제]
    ├── [콘텐츠 확인]
    │       ├── [콘텐츠 승인]
    │       ├── [콘텐츠 거부]
    │       └── [SNS 공유]
    ├── [데이터 분석]
    │       ├── [방문자 통계]
    │       ├── [콘텐츠 성과]
    │       └── [ROI 리포트]
    └── [설정]
            ├── [매장 정보]
            ├── [결제 정보]
            └── [QR 코드 다운로드]
```

---

## 4. Visual Design System

### 4.1 색상 시스템 (Color System)

#### Primary Colors - 브랜드 아이덴티티
```css
/* Violet-Purple Gradient - 신뢰와 혁신 */
--primary-50:  #F5F3FF;  /* Lightest tint */
--primary-100: #EDE9FE;
--primary-200: #DDD6FE;
--primary-300: #C4B5FD;
--primary-400: #A78BFA;  /* Light Purple */
--primary-500: #8B5CF6;  /* Main Brand Color */
--primary-600: #7C3AED;  /* Dark Purple */
--primary-700: #6D28D9;
--primary-800: #5B21B6;
--primary-900: #4C1D95;  /* Darkest shade */

/* Blue Accent - 위치 기반 서비스 연상 */
--blue-400: #60A5FA;
--blue-500: #3B82F6;
--blue-600: #2563EB;
```

#### Semantic Colors - 의미 기반 색상
```css
/* Success - 검증 완료, 정산 완료 */
--success-50:  #ECFDF5;
--success-500: #10B981;  /* Main Green */
--success-600: #059669;

/* Warning - 검증 대기, 주의 필요 */
--warning-50:  #FFFBEB;
--warning-500: #F59E0B;  /* Main Amber */
--warning-600: #D97706;

/* Error - 검증 실패, 오류 */
--error-50:  #FEF2F2;
--error-500: #EF4444;  /* Main Red */
--error-600: #DC2626;

/* Info - 정보 안내 */
--info-50:  #EFF6FF;
--info-500: #3B82F6;  /* Blue */
--info-600: #2563EB;
```

#### Neutral Colors - UI 기본 색상
```css
/* Gray Scale - 텍스트, 배경, 테두리 */
--gray-50:  #F9FAFB;  /* Lightest background */
--gray-100: #F3F4F6;  /* Light background */
--gray-200: #E5E7EB;  /* Border light */
--gray-300: #D1D5DB;  /* Border */
--gray-400: #9CA3AF;  /* Placeholder */
--gray-500: #6B7280;  /* Disabled text */
--gray-600: #4B5563;  /* Secondary text */
--gray-700: #374151;  /* Body text */
--gray-800: #1F2937;  /* Heading */
--gray-900: #111827;  /* Primary text */
```

#### Gradient Presets - 자주 사용하는 그라디언트
```css
/* Primary Gradient - 버튼, 카드 강조 */
--gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);

/* Map Gradient - 지도 배경 */
--gradient-map: linear-gradient(135deg, #3B4C85 0%, #7B4FA8 50%, #A855C2 100%);

/* Success Gradient - 성공 화면 */
--gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Card Gradient - 프리미엄 카드 */
--gradient-card: linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%);
```

### 4.2 타이포그래피 시스템 (Typography)

#### Font Family
```css
/* Primary Font - Pretendard (한글 최적화) */
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

/* Monospace Font - 숫자, 코드 */
font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
```

#### Type Scale - 8pt Grid 기반
```css
/* Display - 히어로 섹션, 랜딩 */
--text-display-lg: 48px;  /* line-height: 56px, weight: 700 */
--text-display-md: 36px;  /* line-height: 44px, weight: 700 */
--text-display-sm: 30px;  /* line-height: 38px, weight: 700 */

/* Heading - 섹션 제목 */
--text-heading-xl: 24px;  /* line-height: 32px, weight: 700 */
--text-heading-lg: 20px;  /* line-height: 28px, weight: 600 */
--text-heading-md: 18px;  /* line-height: 26px, weight: 600 */
--text-heading-sm: 16px;  /* line-height: 24px, weight: 600 */

/* Body - 본문 텍스트 */
--text-body-lg: 18px;    /* line-height: 28px, weight: 400 */
--text-body-md: 16px;    /* line-height: 24px, weight: 400 */
--text-body-sm: 14px;    /* line-height: 20px, weight: 400 */

/* Label - 버튼, 입력 라벨 */
--text-label-lg: 16px;   /* line-height: 24px, weight: 500 */
--text-label-md: 14px;   /* line-height: 20px, weight: 500 */
--text-label-sm: 12px;   /* line-height: 16px, weight: 500 */

/* Caption - 보조 텍스트 */
--text-caption-lg: 14px; /* line-height: 20px, weight: 400 */
--text-caption-md: 12px; /* line-height: 16px, weight: 400 */
--text-caption-sm: 10px; /* line-height: 14px, weight: 400 */
```

#### Font Weight
```css
--weight-regular:   400;  /* Body text */
--weight-medium:    500;  /* Labels, secondary emphasis */
--weight-semibold:  600;  /* Headings, buttons */
--weight-bold:      700;  /* Display, strong emphasis */
--weight-extrabold: 800;  /* Hero text, rare use */
```

#### Letter Spacing
```css
/* Tighter for large text */
--tracking-tight:   -0.02em;  /* Display, headings */
--tracking-normal:   0em;     /* Body text */
--tracking-wide:    0.01em;   /* All caps, labels */
```

### 4.3 간격 시스템 (Spacing System)

#### 8pt Grid 기반
```css
/* Base unit: 8px */
--spacing-0: 0px;      /* No space */
--spacing-1: 4px;      /* 0.5 unit - Tight spacing */
--spacing-2: 8px;      /* 1 unit - Base */
--spacing-3: 12px;     /* 1.5 units */
--spacing-4: 16px;     /* 2 units - Default gap */
--spacing-5: 20px;     /* 2.5 units */
--spacing-6: 24px;     /* 3 units - Section spacing */
--spacing-8: 32px;     /* 4 units - Large gap */
--spacing-10: 40px;    /* 5 units */
--spacing-12: 48px;    /* 6 units - Extra large */
--spacing-16: 64px;    /* 8 units - Hero spacing */
--spacing-20: 80px;    /* 10 units */
--spacing-24: 96px;    /* 12 units - Section margin */
```

#### 컴포넌트별 간격 가이드
```css
/* Button Padding */
.btn-sm  { padding: 8px 16px; }   /* spacing-2 spacing-4 */
.btn-md  { padding: 12px 24px; }  /* spacing-3 spacing-6 */
.btn-lg  { padding: 16px 32px; }  /* spacing-4 spacing-8 */

/* Card Padding */
.card-sm { padding: 16px; }       /* spacing-4 */
.card-md { padding: 24px; }       /* spacing-6 */
.card-lg { padding: 32px; }       /* spacing-8 */

/* Section Spacing */
.section-gap { margin-bottom: 48px; }  /* spacing-12 */
.page-padding { padding: 24px; }       /* spacing-6 */
```

### 4.4 Border Radius (모서리 둥글기)

```css
/* Border Radius Scale */
--radius-none: 0px;      /* Sharp corners */
--radius-sm:   4px;      /* Subtle rounding */
--radius-md:   8px;      /* Default */
--radius-lg:   12px;     /* Cards */
--radius-xl:   16px;     /* Large cards */
--radius-2xl:  20px;     /* Premium cards */
--radius-3xl:  24px;     /* Hero cards */
--radius-full: 9999px;   /* Pills, circles */
```

### 4.5 Shadow System (그림자)

```css
/* Elevation Levels */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.10);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.12);
--shadow-2xl: 0 16px 32px rgba(0, 0, 0, 0.15);

/* Colored Shadows for emphasis */
--shadow-primary: 0 8px 24px rgba(139, 92, 246, 0.3);
--shadow-success: 0 8px 24px rgba(16, 185, 129, 0.3);
--shadow-error: 0 8px 24px rgba(239, 68, 68, 0.3);
```

---

## 5. Interaction Design

### 5.1 제스처 인터랙션

#### 드로어 제스처 (Bottom Drawer)
```typescript
// 드로어 높이 상태
const DRAWER_HEIGHTS = {
  COLLAPSED: 20,  // 20% - 최소화
  DEFAULT:   45,  // 45% - 기본
  EXPANDED:  80   // 80% - 확장
};

// 드래그 핸들러
const handleDrawerDrag = (event: any, info: PanInfo) => {
  const deltaY = info.offset.y;
  const newHeight = Math.max(20, Math.min(80, currentHeight - (deltaY / window.innerHeight) * 100));
  setDrawerHeight(newHeight);
};

// 스냅 로직
const snapToNearest = (height: number, velocity: number) => {
  // 빠른 스와이프 감지
  if (velocity > 500) return DRAWER_HEIGHTS.COLLAPSED;
  if (velocity < -500) return DRAWER_HEIGHTS.EXPANDED;
  
  // 가장 가까운 스냅 포인트로
  const snapPoints = Object.values(DRAWER_HEIGHTS);
  const nearest = snapPoints.reduce((prev, curr) => 
    Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
  );
  return nearest;
};
```

#### 카드 스와이프 (Swipe to Action)
```typescript
// 좌우 스와이프로 액션 트리거
const handleCardSwipe = (event: any, info: PanInfo) => {
  const THRESHOLD = 100; // 100px 이상 스와이프 시 액션
  
  if (info.offset.x > THRESHOLD) {
    // 오른쪽 스와이프 = 좋아요
    handleLike();
    playHapticFeedback('success');
  } else if (info.offset.x < -THRESHOLD) {
    // 왼쪽 스와이프 = 건너뛰기
    handleSkip();
    playHapticFeedback('light');
  }
};
```

#### Pull to Refresh
```typescript
const PullToRefresh = ({ onRefresh }: Props) => {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 100 }}
      onDrag={(e, info) => {
        if (info.offset.y > 0) {
          setPullDistance(Math.min(info.offset.y, 100));
          if (info.offset.y > 80) setPulling(true);
        }
      }}
      onDragEnd={() => {
        if (pulling) {
          onRefresh();
          playHapticFeedback('medium');
        }
        setPullDistance(0);
        setPulling(false);
      }}
    >
      <RefreshIndicator 
        visible={pullDistance > 0}
        progress={pullDistance / 80}
      />
      <ContentList />
    </motion.div>
  );
};
```

### 5.2 애니메이션 라이브러리

#### 페이지 전환 (Page Transition)
```typescript
// Fade + Slide Up
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] // Custom easing
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2
    }
  }
};

// 사용 예시
<AnimatePresence mode="wait">
  <motion.div
    key={currentPage}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <PageContent />
  </motion.div>
</AnimatePresence>
```

#### 리스트 애니메이션 (List Stagger)
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1초 간격
      delayChildren: 0.2    // 0.2초 후 시작
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

<motion.ul variants={containerVariants} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      <ItemCard item={item} />
    </motion.li>
  ))}
</motion.ul>
```

#### 버튼 피드백 (Button Feedback)
```typescript
// 탭 스케일 + 햅틱 피드백
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.02 }}
  onTapStart={() => playHapticFeedback('light')}
  transition={{ 
    type: 'spring', 
    stiffness: 400, 
    damping: 17 
  }}
>
  클릭
</motion.button>

// 로딩 애니메이션
<motion.div
  animate={{ rotate: 360 }}
  transition={{ 
    duration: 1, 
    repeat: Infinity, 
    ease: 'linear' 
  }}
>
  <Loader />
</motion.div>
```

### 5.3 마이크로인터랙션

#### 좋아요 버튼 (Like Animation)
```typescript
const LikeButton = ({ initialLiked = false }: Props) => {
  const [liked, setLiked] = useState(initialLiked);
  
  return (
    <motion.button
      onClick={() => {
        setLiked(!liked);
        playHapticFeedback('success');
      }}
      whileTap={{ scale: 0.85 }}
    >
      <motion.div
        animate={{
          scale: liked ? [1, 1.3, 1] : 1,
          rotate: liked ? [0, -10, 10, 0] : 0
        }}
        transition={{ duration: 0.4 }}
      >
        <Heart 
          className={cn(
            'w-6 h-6 transition-colors',
            liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
          )}
        />
      </motion.div>
    </motion.button>
  );
};
```

#### 검증 프로그레스 (Verification Progress)
```typescript
const VerificationProgress = ({ step }: { step: number }) => {
  const steps = [
    { icon: <MapPin />, label: 'GPS 검증' },
    { icon: <QrCode />, label: 'QR 스캔' },
    { icon: <Receipt />, label: '영수증 업로드' }
  ];
  
  return (
    <div className="flex items-center justify-between">
      {steps.map((s, index) => (
        <React.Fragment key={index}>
          <StepIndicator
            icon={s.icon}
            label={s.label}
            active={step >= index + 1}
            complete={step > index + 1}
          />
          {index < steps.length - 1 && (
            <ProgressLine active={step > index + 1} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const StepIndicator = ({ icon, label, active, complete }: Props) => (
  <motion.div
    className={cn(
      'flex flex-col items-center',
      active && 'text-primary-600',
      !active && 'text-gray-400'
    )}
    animate={{ 
      scale: active ? 1.1 : 1,
      opacity: active ? 1 : 0.5
    }}
  >
    <motion.div
      className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center',
        complete && 'bg-success-500',
        active && !complete && 'bg-primary-500',
        !active && 'bg-gray-200'
      )}
      animate={{ 
        rotate: complete ? [0, 360] : 0 
      }}
      transition={{ duration: 0.5 }}
    >
      {complete ? <Check className="w-6 h-6 text-white" /> : icon}
    </motion.div>
    <span className="text-xs mt-2">{label}</span>
  </motion.div>
);
```

#### 토스트 알림 (Toast Notification)
```typescript
const Toast = ({ message, type, onClose }: ToastProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9 }}
    className={cn(
      'fixed bottom-20 left-4 right-4 z-50',
      'p-4 rounded-2xl shadow-2xl flex items-center gap-3',
      type === 'success' && 'bg-success-500',
      type === 'error' && 'bg-error-500',
      type === 'info' && 'bg-info-500'
    )}
  >
    {type === 'success' && <CheckCircle className="w-5 h-5 text-white" />}
    {type === 'error' && <XCircle className="w-5 h-5 text-white" />}
    {type === 'info' && <Info className="w-5 h-5 text-white" />}
    <span className="text-white font-medium flex-1">{message}</span>
    <button onClick={onClose}>
      <X className="w-5 h-5 text-white" />
    </button>
  </motion.div>
);

// 사용 예시
showToast({ 
  message: '미션 완료! 1만 5천원이 입금 예정입니다', 
  type: 'success' 
});
```

---

## 6. Component Library

### 6.1 Button 컴포넌트

#### 버튼 변형 (Variants)
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  onClick
}: ButtonProps) => {
  const baseStyles = cn(
    'font-semibold rounded-xl transition-all duration-200',
    'flex items-center justify-center gap-2',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    fullWidth && 'w-full'
  );
  
  const variantStyles = {
    primary: cn(
      'bg-gradient-to-r from-primary-600 to-primary-500',
      'text-white shadow-lg hover:shadow-primary',
      'hover:scale-[1.02] active:scale-[0.98]',
      'focus:ring-primary-400'
    ),
    secondary: cn(
      'bg-gray-100 text-gray-900',
      'hover:bg-gray-200 active:bg-gray-300',
      'focus:ring-gray-400'
    ),
    outline: cn(
      'border-2 border-primary-500 text-primary-600',
      'hover:bg-primary-50 active:bg-primary-100',
      'focus:ring-primary-400'
    ),
    ghost: cn(
      'text-gray-700 hover:bg-gray-100',
      'active:bg-gray-200 focus:ring-gray-400'
    ),
    danger: cn(
      'bg-error-500 text-white shadow-lg',
      'hover:bg-error-600 active:bg-error-700',
      'focus:ring-error-400'
    )
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm h-9',
    md: 'px-6 py-3 text-base h-11',
    lg: 'px-8 py-4 text-lg h-14'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  return (
    <motion.button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && disabledStyles
      )}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && icon}
    </motion.button>
  );
};

// 사용 예시
<Button variant="primary" size="lg" fullWidth icon={<MapPin />}>
  미션 시작하기
</Button>

<Button variant="outline" size="md" loading>
  검증 중...
</Button>
```

### 6.2 Card 컴포넌트

#### Mission Card
```typescript
interface MissionCardProps {
  mission: {
    id: string;
    name: string;
    category: string;
    reward: number;
    distance: string;
    imageUrl: string;
    difficulty: 'easy' | 'medium' | 'hard';
    expiresAt: Date;
  };
  onTap?: () => void;
}

const MissionCard = ({ mission, onTap }: MissionCardProps) => {
  const difficultyColors = {
    easy: 'bg-success-100 text-success-700',
    medium: 'bg-warning-100 text-warning-700',
    hard: 'bg-error-100 text-error-700'
  };
  
  return (
    <motion.div
      className={cn(
        'bg-white rounded-2xl shadow-lg overflow-hidden',
        'border border-gray-100 cursor-pointer'
      )}
      onClick={onTap}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* 이미지 섹션 */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={mission.imageUrl} 
          alt={mission.name}
          className="w-full h-full object-cover"
        />
        {/* 난이도 뱃지 */}
        <div className={cn(
          'absolute top-3 right-3 px-3 py-1 rounded-full',
          'text-xs font-semibold backdrop-blur-sm',
          difficultyColors[mission.difficulty]
        )}>
          {mission.difficulty === 'easy' && '쉬움'}
          {mission.difficulty === 'medium' && '보통'}
          {mission.difficulty === 'hard' && '어려움'}
        </div>
        {/* 카테고리 */}
        <div className="absolute bottom-3 left-3">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            'bg-white/90 backdrop-blur-sm text-gray-900'
          )}>
            {mission.category}
          </span>
        </div>
      </div>
      
      {/* 정보 섹션 */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {mission.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{mission.distance}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {formatDistanceToNow(mission.expiresAt, { locale: ko })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Coins className="w-5 h-5 text-warning-500" />
            <span className="text-lg font-bold text-gray-900">
              {mission.reward.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```

#### Photo Card (지도 하단 드로어)
```typescript
interface PhotoCardProps {
  photo: {
    id: string;
    imageUrl: string;
    views: string;
    likes: number;
    creator: {
      name: string;
      avatarUrl: string;
    };
    createdAt: Date;
  };
  onLike?: () => void;
}

const PhotoCard = ({ photo, onLike }: PhotoCardProps) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <img 
        src={photo.imageUrl} 
        alt="Photo"
        className="w-full h-48 object-cover"
      />
      
      {/* 오버레이 */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-t',
        'from-black/60 via-black/20 to-transparent',
        'flex flex-col justify-end p-4'
      )}>
        {/* 크리에이터 정보 */}
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={photo.creator.avatarUrl}
            alt={photo.creator.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <span className="text-white text-sm font-medium">
            {photo.creator.name}
          </span>
        </div>
        
        {/* 통계 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-white text-sm">{photo.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart 
                className={cn(
                  'w-4 h-4 transition-colors',
                  liked ? 'fill-red-500 text-red-500' : 'text-white'
                )}
              />
              <span className="text-white text-sm">{photo.likes}</span>
            </div>
          </div>
          
          <span className="text-white/80 text-xs">
            {formatDistanceToNow(photo.createdAt, { locale: ko, addSuffix: true })}
          </span>
        </div>
      </div>
      
      {/* 좋아요 버튼 */}
      <motion.button
        className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
          onLike?.();
        }}
        whileTap={{ scale: 0.85 }}
      >
        <Heart 
          className={cn(
            'w-5 h-5 transition-colors',
            liked ? 'fill-red-500 text-red-500' : 'text-white'
          )}
        />
      </motion.button>
    </motion.div>
  );
};
```

### 6.3 Input 컴포넌트

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  helperText?: string;
  required?: boolean;
}

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  icon,
  helperText,
  required = false
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      {/* 입력 필드 */}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'w-full px-4 py-3 rounded-xl',
            'border-2 transition-all duration-200',
            'text-gray-900 placeholder:text-gray-400',
            icon && 'pl-12',
            focused && 'border-primary-500 ring-4 ring-primary-100',
            !focused && !error && 'border-gray-200',
            error && 'border-error-500 ring-4 ring-error-100',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-60'
          )}
          animate={{
            scale: focused ? 1.01 : 1
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {/* 헬퍼 텍스트 or 에러 */}
      {(helperText || error) && (
        <p className={cn(
          'text-sm',
          error ? 'text-error-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// 사용 예시
<Input
  label="닉네임"
  placeholder="사용할 닉네임을 입력하세요"
  value={nickname}
  onChange={setNickname}
  icon={<User className="w-5 h-5" />}
  required
  error={nicknameError}
/>
```

### 6.4 Badge 컴포넌트

```typescript
interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  pulse?: boolean;
}

const Badge = ({ 
  variant = 'default', 
  size = 'md', 
  icon, 
  children,
  pulse = false 
}: BadgeProps) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    info: 'bg-info-100 text-info-700'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-medium',
      variantStyles[variant],
      sizeStyles[size],
      pulse && 'animate-pulse'
    )}>
      {icon && icon}
      {children}
    </span>
  );
};

// 사용 예시
<Badge variant="success" icon={<Check className="w-3 h-3" />}>
  검증 완료
</Badge>

<Badge variant="warning" pulse>
  검증 중
</Badge>
```

### 6.5 Modal 컴포넌트

```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true
}: ModalProps) => {
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    full: 'max-w-full m-4'
  };
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 모달 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={cn(
                'bg-white rounded-2xl shadow-2xl w-full',
                'max-h-[90vh] overflow-y-auto',
                sizeStyles[size]
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* 헤더 */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    {title && (
                      <h2 className="text-xl font-bold text-gray-900">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              )}
              
              {/* 바디 */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// 사용 예시
<Modal
  open={showMissionDetail}
  onClose={() => setShowMissionDetail(false)}
  title="미션 상세"
  description="아래 조건을 확인하고 미션을 시작하세요"
  size="md"
>
  <MissionDetailContent />
  <div className="flex gap-3 mt-6">
    <Button variant="outline" fullWidth onClick={onClose}>
      취소
    </Button>
    <Button variant="primary" fullWidth onClick={onStartMission}>
      시작하기
    </Button>
  </div>
</Modal>
```

### 6.6 Bottom Sheet 컴포넌트

```typescript
interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // % heights
  initialSnap?: number;
}

const BottomSheet = ({
  open,
  onClose,
  children,
  snapPoints = [20, 50, 90],
  initialSnap = 1
}: BottomSheetProps) => {
  const [snapIndex, setSnapIndex] = useState(initialSnap);
  const currentHeight = snapPoints[snapIndex];
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              const velocity = info.velocity.y;
              const offset = info.offset.y;
              
              // Fast swipe down = close
              if (velocity > 500 || offset > 100) {
                onClose();
                return;
              }
              
              // Snap to nearest point
              const newIndex = Math.round(
                snapIndex + offset / (window.innerHeight * 0.3)
              );
              setSnapIndex(
                Math.max(0, Math.min(snapPoints.length - 1, newIndex))
              );
            }}
            style={{
              height: `${currentHeight}vh`,
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px'
            }}
            className="bg-white shadow-2xl overflow-hidden"
          >
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* 콘텐츠 */}
            <div className="overflow-y-auto h-full pb-6 px-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

---

## 7. Screen Specifications

### 7.1 홈 화면 (Home Screen)

#### 레이아웃 구조
```
┌─────────────────────────────────┐
│  🔔 알림     ZZIK LIVE    🔍 검색  │ ← Header (64px)
├─────────────────────────────────┤
│  📍 현재 위치: 성수동              │ ← Location Bar (48px)
│  ↓ 반경 2km 내 12개 미션          │
├─────────────────────────────────┤
│                                 │
│  [카테고리 필터 가로 스크롤]        │ ← Category Pills (56px)
│  전체  카페  레스토랑  바  베이커리  │
│                                 │
├─────────────────────────────────┤
│                                 │
│  🔥 인기 미션 (Trending)           │ ← Section Header (40px)
│  ───────────────────────────   │
│  [가로 스크롤 카드 리스트]          │ ← Horizontal Scroll (220px)
│  ┌───────┐ ┌───────┐ ┌───────┐│
│  │미션 카드│ │미션 카드│ │미션 카드││
│  └───────┘ └───────┘ └───────┘│
│                                 │
├─────────────────────────────────┤
│  📍 근처 미션 (Nearby)             │ ← Section Header (40px)
│  ───────────────────────────   │
│  ┌───────────────────────────┐ │ ← Mission Card (120px each)
│  │ 카페 이름     거리: 0.3km   │ │
│  │ 보상: 15,000원 | 쉬움      │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ 레스토랑 이름  거리: 0.8km  │ │
│  │ 보상: 20,000원 | 보통      │ │
│  └───────────────────────────┘ │
│                                 │
│  [계속 스크롤...]                 │
│                                 │
└─────────────────────────────────┘
│  🏠 홈  🗺️ 지도  ➕  💰  👤  │ ← Bottom Nav (72px)
└─────────────────────────────────┘
```

#### 상호작용 명세
```typescript
// 홈 화면 상태 관리
const HomeScreen = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pull to refresh
  const onRefresh = async () => {
    setLoading(true);
    const newMissions = await fetchNearbyMissions(location);
    setMissions(newMissions);
    setLoading(false);
  };
  
  // 카테고리 필터
  const filteredMissions = useMemo(() => {
    if (selectedCategory === 'all') return missions;
    return missions.filter(m => m.category === selectedCategory);
  }, [missions, selectedCategory]);
  
  return (
    <ScrollView 
      refreshControl={<RefreshControl onRefresh={onRefresh} />}
    >
      <LocationBar location={location} />
      <CategoryFilter 
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />
      <TrendingSection missions={missions.slice(0, 5)} />
      <NearbySection missions={filteredMissions} />
    </ScrollView>
  );
};
```

### 7.2 지도 화면 (Map Screen)

#### 레이아웃 구조
```
┌─────────────────────────────────┐
│  ← 뒤로  지도    필터 🎚️  리스트 ≡ │ ← Floating Header (56px)
│                                 │
│                                 │
│         [인터랙티브 지도]          │
│                                 │
│    📍      📍                   │ ← Location Pins
│        📍     📍                │
│                                 │
│  📍            📍               │
│        📍                       │
│                                 │
│ ┌─ 🎯 내 위치 ────────────────┐ │ ← Floating Action (48px)
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← Drawer Handle (16px)
│                                 │
│  Brooklyn Bridge Park   🔥 12   │ ← Drawer Header (56px)
│  파크 · 0.5km                   │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │ ← Photo Grid (160px per row)
│  │Photo│ │Photo│ │Photo│       │
│  │ ♥ 234│ │ ♥ 189│ │ ♥ 301│    │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  [미션 시작하기 버튼]              │ ← CTA Button (56px)
│                                 │
└─────────────────────────────────┘
│  🏠 홈  🗺️ 지도  ➕  💰  👤  │ ← Bottom Nav (72px)
└─────────────────────────────────┘
```

#### 드로어 스냅 포인트
```typescript
const DRAWER_CONFIG = {
  snapPoints: [20, 45, 80], // % of screen height
  defaultSnap: 1, // 45%
  dragThreshold: 50, // px
  velocityThreshold: 500 // px/s
};

// 드로어 높이별 콘텐츠 표시
const DrawerContent = ({ height }: { height: number }) => {
  if (height <= 20) {
    // 최소화 상태: 위치 이름만
    return <DrawerHeaderCollapsed />;
  } else if (height <= 60) {
    // 중간 상태: 위치 정보 + 사진 3개
    return (
      <>
        <DrawerHeader />
        <PhotoGrid photos={photos.slice(0, 3)} />
      </>
    );
  } else {
    // 확장 상태: 전체 콘텐츠
    return (
      <>
        <DrawerHeader />
        <PhotoGrid photos={photos} />
        <MissionDetails />
        <CTAButton />
      </>
    );
  }
};
```

### 7.3 미션 수행 화면 (Mission Execution)

#### 단계별 화면 플로우

**Step 1: GPS 검증**
```
┌─────────────────────────────────┐
│  ← 취소          GPS 검증         │
│                                 │
│         ┌───────────────┐       │
│         │               │       │
│         │   🎯 위치     │       │
│         │   확인 중...  │       │
│         │               │       │
│         └───────────────┘       │
│                                 │
│  현재 위치를 확인하고 있습니다      │
│  매장 반경 3m 이내에 있어야 합니다  │
│                                 │
│  ━━━━━━━━━━━━━━━ 33%          │ ← Progress Bar
│                                 │
│  ✅ GPS 검증         (진행 중)   │
│  ⚪ QR 스캔          (대기)      │
│  ⚪ 영수증 업로드     (대기)      │
│                                 │
└─────────────────────────────────┘
```

**Step 2: 사진 촬영**
```
┌─────────────────────────────────┐
│  ← 뒤로         사진 촬영     ✓ 완료│
│                                 │
│         [카메라 뷰파인더]          │
│                                 │
│  💡 TIP                         │
│  • 음식이 중앙에 오도록          │
│  • 자연광 활용                   │
│  • 인테리어도 함께 담기           │
│                                 │
│         ⭕ [촬영 버튼]           │
│         🖼️  🔄  ⚡             │
│       갤러리  전환  플래시         │
│                                 │
│  ━━━━━━━━━━━━━━━ 66%          │
│                                 │
└─────────────────────────────────┘
```

**Step 3: 검증 완료**
```
┌─────────────────────────────────┐
│                                 │
│         ┌───────────────┐       │
│         │               │       │
│         │   🎉 완료!    │       │
│         │               │       │
│         └───────────────┘       │
│                                 │
│  미션이 성공적으로 완료되었습니다!  │
│                                 │
│  💰 보상: 15,000원              │
│  📅 정산 예정: 내일 오후 3시      │
│                                 │
│  ━━━━━━━━━━━━━━━ 100%         │
│                                 │
│  ✅ GPS 검증        (완료)       │
│  ✅ QR 스캔         (완료)       │
│  ✅ 영수증 업로드    (완료)       │
│                                 │
│  ┌─────────────────────────┐   │
│  │  📱 인스타 스토리 공유    │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  🏠 홈으로 돌아가기       │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### 7.4 보상 화면 (Rewards Screen)

```
┌─────────────────────────────────┐
│              보상                │
│                                 │
│  ┌─────────────────────────┐   │
│  │  💰 누적 보상            │   │
│  │  ₩234,500              │   │
│  │                         │   │
│  │  정산 예정: ₩45,000     │   │
│  │  정산 완료: ₩189,500    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  💳 출금하기             │   │
│  └─────────────────────────┘   │
│                                 │
│  ─── 이번 달 ────────────────  │
│                                 │
│  ✅ 2024.11.10 - 카페 미션      │
│     +15,000원 | 정산 완료       │
│                                 │
│  ⏳ 2024.11.11 - 레스토랑 미션   │
│     +20,000원 | 정산 예정       │
│                                 │
│  ✅ 2024.11.09 - 바 미션        │
│     +25,000원 | 정산 완료       │
│                                 │
│  ─── 지난 달 ────────────────  │
│                                 │
│  ✅ 2024.10.28 - 베이커리 미션   │
│     +10,000원 | 정산 완료       │
│                                 │
└─────────────────────────────────┘
│  🏠 홈  🗺️ 지도  ➕  💰  👤  │
└─────────────────────────────────┘
```

### 7.5 프로필 화면 (Profile Screen)

```
┌─────────────────────────────────┐
│             프로필               │
│                                 │
│      ┌─────────────────┐       │
│      │   👤 프로필 사진  │       │
│      └─────────────────┘       │
│                                 │
│         민지 @minji_official    │
│                                 │
│  ┌───────┐ ┌───────┐ ┌───────┐│
│  │  42   │ │ 28    │ │ 5.0   ││
│  │완료미션│ │ 총보상 │ │ 평점   ││
│  │       │ │ 63만원 │ │       ││
│  └───────┘ └───────┘ └───────┘│
│                                 │
│  ─────────────────────────────│
│                                 │
│  📸 내 포트폴리오                │
│  ┌─────┐ ┌─────┐ ┌─────┐      │
│  │Photo│ │Photo│ │Photo│      │
│  └─────┘ └─────┘ └─────┘      │
│  ┌─────┐ ┌─────┐ ┌─────┐      │
│  │Photo│ │Photo│ │Photo│      │
│  └─────┘ └─────┘ └─────┘      │
│                                 │
│  ─────────────────────────────│
│                                 │
│  ⚙️ 설정                        │
│  🔔 알림 설정                   │
│  💳 결제 정보                   │
│  📍 위치 권한 관리               │
│  ❓ 고객 지원                   │
│  🚪 로그아웃                    │
│                                 │
└─────────────────────────────────┘
│  🏠 홈  🗺️ 지도  ➕  💰  👤  │
└─────────────────────────────────┘
```

---

## 8. Accessibility Guidelines

### 8.1 WCAG 2.1 AA 준수 사항

#### 색상 대비 (Color Contrast)
```css
/* WCAG AA 기준: 일반 텍스트 4.5:1, 큰 텍스트 3:1 */

/* ✅ 적합한 조합 */
--text-on-white: #111827;      /* 대비비 16.2:1 */
--primary-on-white: #7C3AED;   /* 대비비 4.8:1 */
--gray-on-white: #4B5563;      /* 대비비 7.5:1 */

/* ❌ 부적합한 조합 (피할 것) */
--gray-300-on-white: #D1D5DB;  /* 대비비 1.8:1 - 너무 낮음 */
--primary-100-on-white: #EDE9FE; /* 대비비 1.1:1 - 너무 낮음 */

/* 테스트 도구 */
// Chrome DevTools Lighthouse 사용
// https://webaim.org/resources/contrastchecker/
```

#### 키보드 네비게이션 (Keyboard Navigation)
```typescript
// 모든 인터랙티브 요소에 키보드 접근 가능
const AccessibleButton = ({ onClick, children }: Props) => (
  <button
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    tabIndex={0}
    aria-label="미션 시작하기"
  >
    {children}
  </button>
);

// Tab 순서 관리
const TabOrder = () => (
  <div>
    <button tabIndex={1}>첫 번째</button>
    <button tabIndex={2}>두 번째</button>
    <button tabIndex={3}>세 번째</button>
  </div>
);

// Skip to main content
const SkipLink = () => (
  <a 
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
  >
    본문으로 건너뛰기
  </a>
);
```

#### 스크린 리더 지원 (Screen Reader Support)
```typescript
// ARIA 속성 적절히 사용
const AccessibleCard = ({ mission }: Props) => (
  <div
    role="article"
    aria-label={`${mission.name} 미션, 보상 ${mission.reward}원, 거리 ${mission.distance}`}
    tabIndex={0}
  >
    <img 
      src={mission.imageUrl} 
      alt={`${mission.name} 매장 사진`}
      role="img"
    />
    <h3 id={`mission-${mission.id}-title`}>{mission.name}</h3>
    <p aria-describedby={`mission-${mission.id}-title`}>
      {mission.description}
    </p>
  </div>
);

// Live regions for dynamic content
const Toast = ({ message }: Props) => (
  <div
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    {message}
  </div>
);

// Hidden text for screen readers
const VisuallyHidden = ({ children }: Props) => (
  <span className="sr-only">{children}</span>
);

// 사용 예시
<button>
  <Heart className="w-5 h-5" />
  <VisuallyHidden>좋아요</VisuallyHidden>
</button>
```

#### 포커스 관리 (Focus Management)
```typescript
// 포커스 트랩 (모달 내부)
const useFocusTrap = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    ref.current.addEventListener('keydown', handleTabKey);
    firstElement.focus();
    
    return () => {
      ref.current?.removeEventListener('keydown', handleTabKey);
    };
  }, [ref]);
};

// 사용 예시
const Modal = ({ children }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef);
  
  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};
```

### 8.2 터치 타겟 크기 (Touch Target Size)

```css
/* WCAG 2.5.5: 최소 44x44px 터치 타겟 */

/* ✅ 적합한 크기 */
.btn-sm { min-width: 44px; min-height: 44px; } /* 최소 기준 */
.btn-md { min-width: 48px; min-height: 48px; } /* 권장 */
.btn-lg { min-width: 56px; min-height: 56px; } /* 편안함 */

/* 작은 아이콘 버튼은 패딩으로 확장 */
.icon-btn {
  padding: 12px; /* 20px 아이콘 + 12px 패딩 = 44px */
}

/* 리스트 아이템 간격 */
.list-item {
  min-height: 56px;
  padding: 16px;
  margin-bottom: 8px; /* 터치 타겟 간 최소 8px */
}
```

### 8.3 모션 감소 (Reduce Motion)

```typescript
// prefers-reduced-motion 미디어 쿼리 감지
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return reducedMotion;
};

// 조건부 애니메이션
const AnimatedCard = ({ children }: Props) => {
  const reducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// CSS로 처리
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Mobile Optimization

### 9.1 성능 예산 (Performance Budget)

```typescript
// 성능 목표 (Lighthouse 기준)
const PERFORMANCE_TARGETS = {
  // Core Web Vitals
  LCP: 2500,  // Largest Contentful Paint < 2.5s
  FID: 100,   // First Input Delay < 100ms
  CLS: 0.1,   // Cumulative Layout Shift < 0.1
  
  // 추가 지표
  FCP: 1800,  // First Contentful Paint < 1.8s
  TTI: 3800,  // Time to Interactive < 3.8s
  TBT: 200,   // Total Blocking Time < 200ms
  
  // 리소스 크기
  totalPageSize: 1024 * 1024 * 2,  // < 2MB
  imageSize: 1024 * 500,            // < 500KB per image
  jsSize: 1024 * 300,               // < 300KB JS bundle
  cssSize: 1024 * 50                // < 50KB CSS
};

// 번들 크기 분석
// npm run build -- --analyze
// 또는 webpack-bundle-analyzer 사용
```

### 9.2 이미지 최적화

```typescript
// Next.js Image 컴포넌트 사용
import Image from 'next/image';

const OptimizedImage = ({ src, alt }: Props) => (
  <Image
    src={src}
    alt={alt}
    width={800}
    height={600}
    quality={80}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
);

// WebP/AVIF 포맷 자동 변환
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};

// 이미지 압축 (빌드 타임)
// npm install --save-dev imagemin imagemin-webp
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

await imagemin(['images/*.{jpg,png}'], {
  destination: 'public/images',
  plugins: [
    imageminWebp({ quality: 80 })
  ]
});
```

### 9.3 코드 스플리팅 (Code Splitting)

```typescript
// 동적 임포트로 코드 스플리팅
const DynamicMap = dynamic(() => import('./Map'), {
  loading: () => <MapSkeleton />,
  ssr: false // 지도는 클라이언트 전용
});

// 라우트 기반 스플리팅 (자동)
// app/
//   ├── page.tsx          → chunk-home.js
//   ├── map/page.tsx      → chunk-map.js
//   ├── mission/page.tsx  → chunk-mission.js
//   └── profile/page.tsx  → chunk-profile.js

// 컴포넌트 레벨 스플리팅
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<Spinner />}>
    <HeavyComponent />
  </Suspense>
);
```

### 9.4 캐싱 전략 (Caching Strategy)

```typescript
// Service Worker 캐싱 (PWA)
// public/sw.js
const CACHE_NAME = 'zzik-live-v1';
const urlsToCache = [
  '/',
  '/map',
  '/mission',
  '/rewards',
  '/profile',
  '/styles/globals.css',
  '/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Stale-While-Revalidate 전략
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      
      return cachedResponse || fetchPromise;
    })
  );
});

// Next.js 캐싱 설정
// app/layout.tsx
export const revalidate = 3600; // 1시간마다 재검증

// API 라우트 캐싱
export async function GET() {
  const data = await fetchMissions();
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  });
}
```

### 9.5 오프라인 지원 (Offline Support)

```typescript
// PWA 매니페스트
// public/manifest.json
{
  "name": "ZZIK LIVE",
  "short_name": "ZZIK",
  "description": "GPS 기반 나노 크리에이터 플랫폼",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#8B5CF6",
  "theme_color": "#7C3AED",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

// 오프라인 감지 훅
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};

// 오프라인 알림
const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  
  if (isOnline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-warning-500 text-white p-3 text-center z-50">
      ⚠️ 인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.
    </div>
  );
};
```

### 9.6 반응형 브레이크포인트 (Responsive Breakpoints)

```typescript
// Tailwind 커스텀 브레이크포인트
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'xs': '375px',   // iPhone SE
      'sm': '640px',   // Small tablets
      'md': '768px',   // Tablets
      'lg': '1024px',  // Laptops
      'xl': '1280px',  // Desktops
      '2xl': '1536px'  // Large desktops
    }
  }
};

// 반응형 훅
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('xs');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else setBreakpoint('xl');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return breakpoint;
};

// 반응형 컴포넌트 예시
const ResponsiveLayout = () => {
  const breakpoint = useBreakpoint();
  
  return (
    <div className={cn(
      'grid gap-4',
      breakpoint === 'xs' && 'grid-cols-1',
      breakpoint === 'sm' && 'grid-cols-2',
      breakpoint === 'md' && 'grid-cols-3',
      breakpoint === 'lg' && 'grid-cols-4'
    )}>
      {/* 콘텐츠 */}
    </div>
  );
};
```

---

## 10. Business Alignment

### 10.1 비즈니스 목표와 UX 매핑

| 비즈니스 목표 | UX 전략 | 핵심 메트릭 | 구현 우선순위 |
|------------|--------|----------|------------|
| **크리에이터 확보 (2025년 500명)** | - 간편 가입 (네이버/카카오 로그인)<br>- 즉시 미션 추천<br>- 첫 미션 보너스 2만원 | - 회원가입 전환율 60%<br>- 첫 미션 완료율 50% (24h 내) | 🔴 P0 (MVP) |
| **검증 신뢰도 95%** | - GPS + QR + 영수증 삼중 검증<br>- 실시간 검증 피드백 (3초 이내)<br>- 검증 프로세스 시각화 | - 검증 성공률 95%<br>- 허위 콘텐츠 비율 < 1% | 🔴 P0 (MVP) |
| **정산 만족도 NPS 70+** | - 24시간 내 자동 정산<br>- 정산 예정 시각 명확히 표시<br>- 출금 프로세스 간소화 (1탭) | - NPS 점수 70+<br>- 정산 지연 민원 < 2% | 🟠 P1 (출시 후 1개월) |
| **파트너 전환율 60%** | - 무료 1개월 체험<br>- ROI 계산기 제공<br>- 실시간 콘텐츠 확인 대시보드 | - 체험 → 유료 전환율 60%<br>- 6개월 갱신율 80% | 🟠 P1 (출시 후 1개월) |
| **재방문율 70% (MAU)** | - 푸시 알림 (근처 신규 미션)<br>- 보상 히스토리 가시화<br>- 레벨업/뱃지 시스템 | - 월 3회 이상 방문 70%<br>- DAU/MAU 비율 > 40% | 🟡 P2 (출시 후 3개월) |
| **일본 진출 (2027년)** | - 다국어 지원 (i18n)<br>- 일본 결제 시스템 연동<br>- 문화권별 UI 최적화 | - 일본 시장 점유율 5%<br>- 현지화 만족도 4.5/5 | 🔵 P3 (2027년) |

### 10.2 사용자 행동과 매출 연결

```typescript
// 사용자 액션별 비즈니스 가치
const USER_ACTION_VALUE = {
  // 크리에이터 액션
  sign_up: {
    value: 0,           // 직접 매출 없음
    ltv_impact: 50000,  // 예상 LTV (미션 10개 완료 시)
    conversion_rate: 0.6 // 가입 전환율
  },
  first_mission_complete: {
    value: 15000,       // 플랫폼 수수료 (평균)
    ltv_impact: 80000,  // 첫 미션 완료 시 LTV 상승
    conversion_rate: 0.5 // 가입 → 첫 미션 완료율
  },
  mission_share: {
    value: 0,           // 직접 매출 없음
    acquisition_value: 5000, // 바이럴 효과
    conversion_rate: 0.2 // 공유 → 신규 가입 전환율
  },
  
  // 파트너 액션
  partner_signup: {
    value: 1500000,     // 첫 6개월 계약 (월 25만원)
    ltv_impact: 3600000, // 2년 계약 시 LTV
    conversion_rate: 0.4 // 영업 → 계약 전환율
  },
  partner_renewal: {
    value: 1800000,     // 6개월 갱신
    ltv_impact: 5400000, // 3년 누적 LTV
    conversion_rate: 0.8 // 갱신율 목표
  }
};

// UX 개선과 매출 영향 예측
const calculateRevenueImpact = (
  metric: string,
  currentValue: number,
  targetValue: number,
  userBase: number
) => {
  const improvement = targetValue - currentValue;
  const impactedUsers = userBase * improvement;
  
  // 예시: 첫 미션 완료율 40% → 50% 개선 시
  // 500명 * 10% * 15,000원 = 750,000원 추가 매출
  if (metric === 'first_mission_complete_rate') {
    return impactedUsers * USER_ACTION_VALUE.first_mission_complete.value;
  }
  
  return 0;
};

// 실제 계산
const revenueGain = calculateRevenueImpact(
  'first_mission_complete_rate',
  0.4,   // 현재 40%
  0.5,   // 목표 50%
  500    // 크리에이터 500명
);
console.log(`예상 추가 매출: ${revenueGain.toLocaleString()}원/월`);
// 출력: "예상 추가 매출: 750,000원/월"
```

### 10.3 핵심 지표 대시보드 (KPI Dashboard)

```typescript
// 실시간 모니터링할 핵심 지표
interface BusinessMetrics {
  // 크리에이터 지표
  creator: {
    totalSignups: number;           // 누적 가입자
    activeUsers: {
      dau: number;                  // Daily Active Users
      wau: number;                  // Weekly Active Users
      mau: number;                  // Monthly Active Users
    };
    engagement: {
      avgMissionsPerUser: number;   // 사용자당 평균 미션 수
      completionRate: number;       // 미션 완료율
      verificationSuccessRate: number; // 검증 성공률
    };
    retention: {
      day1: number;                 // 1일 재방문율
      day7: number;                 // 7일 재방문율
      day30: number;                // 30일 재방문율
    };
    nps: number;                    // Net Promoter Score
  };
  
  // 파트너 지표
  partner: {
    totalPartners: number;          // 누적 파트너
    activePartners: number;         // 활성 파트너
    conversionRate: number;         // 체험 → 유료 전환율
    renewalRate: number;            // 갱신율
    avgMissionsPerPartner: number;  // 파트너당 평균 미션 수
    satisfactionScore: number;      // 파트너 만족도 (5점 척도)
  };
  
  // 플랫폼 지표
  platform: {
    totalRevenue: number;           // 총 매출
    gmv: number;                    // Gross Merchandise Value
    takeRate: number;               // 플랫폼 수수료율
    operatingMargin: number;        // 영업 이익률
    customerAcquisitionCost: number; // CAC
    lifetimeValue: number;          // LTV
    ltvCacRatio: number;            // LTV/CAC 비율 (3 이상 목표)
  };
}

// 대시보드 컴포넌트 (파트너용)
const PartnerDashboard = ({ partnerId }: Props) => {
  const [metrics, setMetrics] = useState<PartnerMetrics | null>(null);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await api.getPartnerMetrics(partnerId);
      setMetrics(data);
    };
    fetchMetrics();
  }, [partnerId]);
  
  if (!metrics) return <Loading />;
  
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* 핵심 지표 카드 */}
      <MetricCard
        title="이번 달 방문자"
        value={metrics.visitors}
        change={metrics.visitorsChange}
        icon={<Users />}
      />
      <MetricCard
        title="콘텐츠 수"
        value={metrics.contents}
        change={metrics.contentsChange}
        icon={<Camera />}
      />
      <MetricCard
        title="인스타 도달"
        value={metrics.reach}
        change={metrics.reachChange}
        icon={<TrendingUp />}
      />
      <MetricCard
        title="ROI"
        value={`${metrics.roi}%`}
        change={metrics.roiChange}
        icon={<DollarSign />}
      />
      
      {/* 차트 */}
      <div className="col-span-2">
        <LineChart data={metrics.dailyVisitors} />
      </div>
    </div>
  );
};
```

### 10.4 A/B 테스트 프레임워크

```typescript
// 실험 정의
interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  variants: {
    control: React.ComponentType;
    treatment: React.ComponentType;
  };
  metrics: {
    primary: string;    // 주요 지표
    secondary: string[]; // 부차 지표
  };
  targetSampleSize: number;
  startDate: Date;
  endDate: Date;
}

// 실험 예시: CTA 버튼 문구 테스트
const CTAButtonExperiment: Experiment = {
  id: 'cta-button-wording-001',
  name: 'CTA 버튼 문구 테스트',
  hypothesis: '"미션 시작하기"보다 "지금 바로 ₩15,000 받기"가 클릭률을 높일 것',
  variants: {
    control: () => <Button>미션 시작하기</Button>,
    treatment: () => <Button>지금 바로 ₩15,000 받기</Button>
  },
  metrics: {
    primary: 'button_click_rate',
    secondary: ['mission_start_rate', 'mission_complete_rate']
  },
  targetSampleSize: 1000,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-14')
};

// 실험 실행 훅
const useExperiment = (experimentId: string) => {
  const userId = useUserId();
  const [variant, setVariant] = useState<'control' | 'treatment'>('control');
  
  useEffect(() => {
    // 사용자 ID 해싱으로 일관된 변형 할당
    const hash = hashCode(userId + experimentId);
    const assignedVariant = hash % 2 === 0 ? 'control' : 'treatment';
    setVariant(assignedVariant);
    
    // 분석 도구에 이벤트 전송
    analytics.track('experiment_exposure', {
      experimentId,
      variant: assignedVariant,
      userId
    });
  }, [userId, experimentId]);
  
  return variant;
};

// 사용 예시
const MissionDetailScreen = () => {
  const variant = useExperiment('cta-button-wording-001');
  
  return (
    <div>
      <h1>미션 상세</h1>
      {variant === 'control' ? (
        <Button onClick={onStartMission}>미션 시작하기</Button>
      ) : (
        <Button onClick={onStartMission}>지금 바로 ₩15,000 받기</Button>
      )}
    </div>
  );
};
```

---

## 11. Implementation Roadmap

### 11.1 Phase 1: MVP (출시 전 2개월)

#### Week 1-2: 기반 구축
```typescript
// Sprint 1: 프로젝트 셋업 & 인증
const Sprint1Tasks = [
  {
    task: 'Next.js 16 + TypeScript 프로젝트 초기화',
    priority: 'P0',
    estimate: '2일',
    assignee: 'Lead Developer'
  },
  {
    task: 'Supabase 인증 & DB 스키마 설계',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Backend Developer'
  },
  {
    task: '네이버/카카오 간편 로그인 구현',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Frontend Developer'
  },
  {
    task: 'Tailwind + Design System 구축',
    priority: 'P0',
    estimate: '2일',
    assignee: 'UI Developer'
  }
];

// Sprint 2: 핵심 화면 구현
const Sprint2Tasks = [
  {
    task: '홈 화면 - 미션 리스트 & 필터',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Frontend Developer'
  },
  {
    task: '지도 화면 - Mapbox 연동 & 드로어',
    priority: 'P0',
    estimate: '4일',
    assignee: 'Frontend Developer'
  },
  {
    task: '미션 상세 화면 & 미션 시작 플로우',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Frontend Developer'
  }
];
```

#### Week 3-4: 검증 시스템
```typescript
const Sprint3Tasks = [
  {
    task: 'GPS 검증 로직 구현 (PostGIS)',
    priority: 'P0',
    estimate: '4일',
    assignee: 'Backend Developer'
  },
  {
    task: 'QR 코드 생성 & 스캔 기능',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Full Stack Developer'
  },
  {
    task: '영수증 OCR (Tesseract.js)',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Backend Developer'
  }
];

const Sprint4Tasks = [
  {
    task: '사진 촬영 & 업로드 (S3 연동)',
    priority: 'P0',
    estimate: '2일',
    assignee: 'Frontend Developer'
  },
  {
    task: '검증 프로세스 UI/UX',
    priority: 'P0',
    estimate: '3일',
    assignee: 'UI Developer'
  },
  {
    task: '성공/실패 화면 & 피드백',
    priority: 'P0',
    estimate: '2일',
    assignee: 'Frontend Developer'
  }
];
```

#### Week 5-6: 보상 시스템
```typescript
const Sprint5Tasks = [
  {
    task: '보상 계산 로직 & 정산 스케줄러',
    priority: 'P0',
    estimate: '4일',
    assignee: 'Backend Developer'
  },
  {
    task: '보상 화면 & 출금 UI',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Frontend Developer'
  },
  {
    task: '네이버페이/토스 결제 연동',
    priority: 'P0',
    estimate: '3일',
    assignee: 'Backend Developer'
  }
];
```

#### Week 7-8: 테스트 & 최적화
```typescript
const Sprint6Tasks = [
  {
    task: 'E2E 테스트 작성 (Playwright)',
    priority: 'P1',
    estimate: '3일',
    assignee: 'QA Engineer'
  },
  {
    task: '성능 최적화 (Lighthouse 90+ 목표)',
    priority: 'P1',
    estimate: '3일',
    assignee: 'Frontend Developer'
  },
  {
    task: '접근성 개선 (WCAG AA)',
    priority: 'P1',
    estimate: '2일',
    assignee: 'UI Developer'
  }
];

const Sprint7Tasks = [
  {
    task: '시드 유저 베타 테스트 (50명)',
    priority: 'P0',
    estimate: '7일',
    assignee: 'Product Manager'
  },
  {
    task: '피드백 수집 & 긴급 버그 수정',
    priority: 'P0',
    estimate: '7일',
    assignee: 'Full Team'
  }
];
```

### 11.2 Phase 2: Growth (출시 후 1-3개월)

```typescript
const Phase2Features = [
  {
    feature: '푸시 알림 시스템',
    description: '근처 신규 미션 알림, 정산 완료 알림',
    priority: 'P1',
    timeline: 'Week 9-10',
    impact: '재방문율 20% 향상 예상'
  },
  {
    feature: '포트폴리오 기능',
    description: '크리에이터 프로필 & 과거 콘텐츠 갤러리',
    priority: 'P1',
    timeline: 'Week 11-12',
    impact: '크리에이터 자부심 향상, 공유율 증가'
  },
  {
    feature: '파트너 대시보드 고도화',
    description: 'ROI 계산기, 실시간 통계, 콘텐츠 SNS 자동 공유',
    priority: 'P1',
    timeline: 'Week 13-14',
    impact: '파트너 전환율 60% 달성'
  },
  {
    feature: '레벨/뱃지 시스템',
    description: '미션 완료 수에 따른 레벨업, 뱃지 획득',
    priority: 'P2',
    timeline: 'Week 15-16',
    impact: '게이미피케이션, 장기 리텐션 향상'
  }
];
```

### 11.3 Phase 3: Scale (출시 후 4-6개월)

```typescript
const Phase3Features = [
  {
    feature: 'AI 콘텐츠 분석',
    description: '사진 퀄리티 자동 평가, 구도 제안, 필터 추천',
    priority: 'P2',
    timeline: 'Week 17-20',
    impact: '콘텐츠 품질 향상, 파트너 만족도 증가'
  },
  {
    feature: '크리에이터 랭킹',
    description: '주간/월간 TOP 크리에이터, 리더보드',
    priority: 'P2',
    timeline: 'Week 21-22',
    impact: '경쟁 요소 도입, 고품질 콘텐츠 유도'
  },
  {
    feature: '추천 시스템',
    description: '개인화된 미션 추천 (AI 기반)',
    priority: 'P2',
    timeline: 'Week 23-24',
    impact: '미션 매칭 효율 향상'
  }
];
```

### 11.4 Phase 4: Expansion (출시 후 7-12개월)

```typescript
const Phase4Features = [
  {
    feature: '다국어 지원 (일본어)',
    description: 'i18n 인프라 구축, 일본 시장 진출 준비',
    priority: 'P3',
    timeline: 'Week 25-28',
    impact: '일본 시장 진출 기반 마련'
  },
  {
    feature: '일본 결제 시스템',
    description: 'PayPay, LINE Pay 연동',
    priority: 'P3',
    timeline: 'Week 29-30',
    impact: '일본 사용자 결제 편의성'
  },
  {
    feature: '크리에이터 커뮤니티',
    description: '팁 공유, Q&A, 크리에이터 간 교류',
    priority: 'P3',
    timeline: 'Week 31-32',
    impact: '커뮤니티 형성, 플랫폼 충성도 향상'
  },
  {
    feature: '파트너 셀프 서비스',
    description: '파트너가 직접 미션 생성/수정/삭제',
    priority: 'P3',
    timeline: 'Week 33-36',
    impact: '운영 효율 향상, 파트너 자율성 증가'
  }
];
```

### 11.5 마일스톤 & 성공 지표

```typescript
const MILESTONES = [
  {
    phase: 'MVP Launch',
    date: 'Month 2',
    criteria: [
      '✅ 핵심 기능 100% 구현 (GPS+QR+영수증 검증)',
      '✅ Lighthouse 성능 점수 90+',
      '✅ 시드 유저 베타 테스트 완료 (50명)',
      '✅ 앱스토어/플레이스토어 출시'
    ],
    successMetrics: {
      signupRate: 0.4,           // 다운로드 → 가입 40%
      firstMissionRate: 0.3,     // 가입 → 첫 미션 30%
      verificationRate: 0.9      // 검증 성공률 90%
    }
  },
  {
    phase: 'Product-Market Fit',
    date: 'Month 6',
    criteria: [
      '✅ 크리에이터 500명 확보',
      '✅ 파트너 20개 확보',
      '✅ 월 매출 5천만원 달성',
      '✅ NPS 60+ 달성'
    ],
    successMetrics: {
      mau: 300,                  // MAU 300명
      retentionDay30: 0.5,       // 30일 리텐션 50%
      partnerConversion: 0.4,    // 파트너 전환율 40%
      ltvCacRatio: 2.5          // LTV/CAC > 2.5
    }
  },
  {
    phase: 'Scale & Profitability',
    date: 'Month 12',
    criteria: [
      '✅ 크리에이터 2,000명 확보',
      '✅ 파트너 50개 확보',
      '✅ 월 매출 2억원 달성',
      '✅ 영업 이익 흑자 전환'
    ],
    successMetrics: {
      mau: 1200,                 // MAU 1,200명
      retentionDay30: 0.7,       // 30일 리텐션 70%
      partnerRenewal: 0.8,       // 파트너 갱신율 80%
      operatingMargin: 0.15      // 영업 이익률 15%
    }
  },
  {
    phase: 'Japan Market Entry',
    date: 'Month 24 (2027)',
    criteria: [
      '✅ 일본어 앱 출시',
      '✅ 일본 파트너 10개 확보',
      '✅ 일본 크리에이터 500명 확보',
      '✅ 일본 현지 팀 구성 (3명)'
    ],
    successMetrics: {
      japanMau: 300,             // 일본 MAU 300명
      japanRevenue: 50000000,    // 일본 월 매출 5천만원
      japanNps: 65               // 일본 NPS 65+
    }
  }
];
```

### 11.6 리스크 관리 & 대응 계획

```typescript
const RISK_MANAGEMENT = [
  {
    risk: 'GPS 정확도 문제 (실내 3m 검증 실패)',
    probability: 'High',
    impact: 'Critical',
    mitigation: [
      '- Wi-Fi 삼각측량 백업',
      '- iBeacon 설치 (실내 정확도 향상)',
      '- Kalman 필터로 센서 융합',
      '- 파트너에게 QR 위치 가이드 제공'
    ],
    contingency: '수동 검증 옵션 제공 (관리자 승인)'
  },
  {
    risk: '허위 검증 시도 (사진 재사용, 영수증 위조)',
    probability: 'Medium',
    impact: 'High',
    mitigation: [
      '- EXIF 메타데이터 검증 (시간/위치)',
      '- 이미지 해시로 중복 검출',
      '- OCR로 영수증 날짜/시간 자동 확인',
      '- AI로 의심 패턴 탐지'
    ],
    contingency: '3회 이상 검증 실패 시 계정 정지'
  },
  {
    risk: '크리에이터 확보 지연 (목표 500명 미달)',
    probability: 'Medium',
    impact: 'High',
    mitigation: [
      '- 첫 미션 보너스 2만원 (초기 인센티브)',
      '- 인스타그램 광고 집행 (타겟: 대학생)',
      '- 바이럴 마케팅 (추천 보상)',
      '- 캠퍼스 홍보 (오프라인)'
    ],
    contingency: '파트너에게 크리에이터 직접 섭외 인센티브 제공'
  },
  {
    risk: '파트너 이탈 (갱신율 목표 80% 미달)',
    probability: 'Low',
    impact: 'High',
    mitigation: [
      '- 무료 1개월 체험으로 효과 검증',
      '- 실시간 ROI 대시보드 제공',
      '- 정기 CS 전화 (월 1회)',
      '- 성공 사례 공유 (커뮤니티)'
    ],
    contingency: '갱신 시 할인 (20% off) & 보너스 크레딧 제공'
  }
];
```

---

## 12. 부록 (Appendix)

### 12.1 용어집 (Glossary)

| 용어 | 설명 |
|-----|------|
| **나노 크리에이터** | 팔로워 1,000~10,000명의 마이크로 인플루언서 |
| **삼중 검증** | GPS + QR 코드 + 영수증 OCR을 통한 방문 검증 |
| **드로어 (Drawer)** | 화면 하단에서 위로 끌어올리는 UI 패턴 |
| **스냅 포인트 (Snap Point)** | 드로어가 멈추는 특정 높이 위치 |
| **LTV (Lifetime Value)** | 고객 생애 가치, 한 고객이 평생 동안 기여하는 매출 |
| **CAC (Customer Acquisition Cost)** | 고객 획득 비용 |
| **NPS (Net Promoter Score)** | 고객 추천 지수 (-100 ~ +100) |
| **MAU (Monthly Active Users)** | 월간 활성 사용자 |
| **DAU (Daily Active Users)** | 일간 활성 사용자 |

### 12.2 참고 자료 (References)

- **Design System**: [Material Design 3](https://m3.material.io/)
- **Accessibility**: [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- **Performance**: [Core Web Vitals](https://web.dev/vitals/)
- **React Patterns**: [React Patterns](https://reactpatterns.com/)
- **Animation**: [Framer Motion Docs](https://www.framer.com/motion/)

### 12.3 변경 이력 (Change Log)

| 버전 | 날짜 | 변경 사항 | 작성자 |
|-----|------|----------|--------|
| 1.0 | 2025-11-12 | 초기 버전 작성 (섹션 1-11 완성) | Multi-Agent Team |

---

**문서 끝 (End of Document)**

이 문서는 ZZIK LIVE 플랫폼의 완전한 UX/UI 기획설계서입니다. 모든 섹션이 완료되었으며, 개발팀은 이 문서를 기반으로 즉시 구현을 시작할 수 있습니다.

**다음 단계 (Next Steps)**:
1. ✅ 이 문서를 팀 전체와 공유
2. ✅ Phase 1 MVP 스프린트 계획 확정
3. ✅ 디자인 시스템 Figma 파일 생성
4. ✅ 개발 환경 셋업 시작

**문의 사항**:
- 기술 문의: tech@zziklive.com
- 디자인 문의: design@zziklive.com
- 비즈니스 문의: biz@zziklive.com
