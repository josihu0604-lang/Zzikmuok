# Phase 4 정제 사양 구현 가이드

**업데이트**: 2025-11-13  
**상태**: 🔄 부분 구현 완료 (Gap Analysis 기반)

---

## ✅ 구현 완료 항목

### 1. 핵심 스키마 업데이트
- ✅ `post_view` → `post_view_start` + `post_view_end` 분리
- ✅ `exp_exposure` props 정제 (`exp_key`, `variant`)
- ✅ `perf_web_vitals` 이벤트 타입 추가
- ✅ `context.flags` 및 `context.experiments` 필드 추가
- ✅ Zod 스키마 클라이언트/서버 이중 검증

### 2. 성능 관측 인프라
- ✅ Web Vitals 통합 (`lib/perf/vitals.ts`)
- ✅ Long Tasks 추적 (`lib/perf/longtasks.ts`)
- ✅ Frame Drop 모니터링

### 3. 동의 UI
- ✅ PrivacyCard 컴포넌트 (`components/settings/PrivacyCard.tsx`)
- ✅ ConsentBanner 최초 방문 배너
- ✅ 토글 스위치 + 상태 표시

### 4. 클라이언트 개선
- ✅ 배치 크기 20개로 조정
- ✅ `context.experiments` 자동 스냅샷
- ✅ `context.flags` 통합 준비 (구조체만)

---

## 🚧 남은 구현 작업

### A. 우선순위 높음 (1-2시간)

#### 1. 앱 엔트리 통합
```typescript
// app/layout.tsx
import { initWebVitals } from '@/lib/perf/vitals';
import { initLongTasks } from '@/lib/perf/longtasks';
import { configure } from '@/lib/analytics/client';
import { ConsentBanner } from '@/components/settings/PrivacyCard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Analytics 설정
    configure({
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      build: 'web',
    });

    // 성능 추적
    initWebVitals();
    initLongTasks(50, 0.1); // 10% sampling
  }, []);

  return (
    <html>
      <body>
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
```

#### 2. 컴포넌트 계측 업데이트

**지도 핀 탭** (`components/map/Pin.tsx`):
```typescript
import { track } from '@/lib/analytics/client';

<Pin
  onClick={() => {
    track('pin_tap', {
      place_id: point.id,
      zoom: mapZoom,
      lat: point.lat,
      lng: point.lng,
    });
    onPinClick(point);
  }}
/>
```

**장소 시트** (MapDrawer or PlaceSheet):
```typescript
useEffect(() => {
  if (!placeId || !stage) return;
  
  track('place_sheet_open', {
    place_id: placeId,
    stage, // 'peek' | 'half' | 'full'
  });
}, [placeId, stage]);
```

**포스트 뷰** (`components/feed/FeedItem.tsx`):
```typescript
// 시작 시
useEffect(() => {
  if (active) {
    track('post_view_start', {
      post_id: item.id,
      place_id: item.placeId,
      source: 'feed',
    });
    startTimeRef.current = performance.now();
  }

  return () => {
    if (startTimeRef.current && active) {
      const dwellMs = Math.round(performance.now() - startTimeRef.current);
      track('post_view_end', {
        post_id: item.id,
        dwell_ms: dwellMs,
      });
    }
  };
}, [active]);
```

**피드 가시성** (`components/feed/VerticalFeed.tsx`):
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
        const postId = entry.target.getAttribute('data-id');
        const visibleMs = Date.now() - visibilityStart.get(postId);
        
        if (visibleMs > 1000) { // 1초 이상 가시
          track('feed_item_visible', {
            post_id: postId,
            ratio: entry.intersectionRatio,
            visible_ms: visibleMs,
          });
        }
      }
    });
  },
  { threshold: [0.5, 0.75, 1.0] }
);
```

**인터랙션** (`components/feed/ActionStack.tsx`):
```typescript
const handleLike = () => {
  const newState = !liked;
  setLiked(newState);
  
  track('like_toggle', {
    target: 'post',
    id: postId,
    active: newState,
    source: 'feed',
  });
};

const handleSave = () => {
  const newState = !saved;
  setSaved(newState);
  
  track('save_toggle', {
    target: 'post',
    id: postId,
    active: newState,
    source: 'feed',
  });
};
```

**오류 추적** (`app/error.tsx`):
```typescript
import { track } from '@/lib/analytics/client';

useEffect(() => {
  track('error', {
    code: error.name || 'unknown',
    surface: 'app_boundary',
    retryable: false,
    message: error.message,
  });
}, [error]);
```

#### 3. 실험 프레임워크 통합

**레지스트리 생성** (`lib/experiments/registry.ts`):
```typescript
export const EXPERIMENTS = {
  FEED_CAPTION_LINES: {
    key: 'feed_caption_lines',
    variants: ['1l', '2l'],
    traffic: 1.0,
  },
  PLACE_SHEET_AUTO_OPEN: {
    key: 'place_sheet_auto_open',
    variants: ['on', 'off'],
    traffic: 0.5,
  },
  MAP_CLUSTER_THRESHOLD: {
    key: 'map_cluster_threshold',
    variants: ['low', 'medium', 'high'],
    traffic: 1.0,
  },
} as const;
```

**Hook 생성** (`lib/experiments/useExperiment.ts`):
```typescript
import { useMemo } from 'react';
import { assign } from './engine';
import { track } from '@/lib/analytics/client';
import { getDeviceId } from '@/lib/analytics/ids';

export function useExperiment(
  exp: { key: string; variants: string[]; traffic: number }
): string | null {
  const variant = useMemo(() => {
    const deviceId = getDeviceId();
    const assigned = assign(deviceId, exp.key, exp.variants, exp.traffic);
    
    // 노출 추적 (localStorage 중복 방지)
    if (assigned && !hasTrackedExposure(exp.key)) {
      track('exp_exposure', {
        exp_key: exp.key,
        variant: assigned,
      });
      markExposureTracked(exp.key);
      
      // context.experiments에 저장
      localStorage.setItem(`zzik:experiment:${exp.key}`, assigned);
    }
    
    return assigned;
  }, [exp.key]);

  return variant;
}

function hasTrackedExposure(key: string): boolean {
  return localStorage.getItem(`zzik:experiment:${key}:tracked`) === 'true';
}

function markExposureTracked(key: string): void {
  localStorage.setItem(`zzik:experiment:${key}:tracked`, 'true');
}
```

**사용 예시** (`components/feed/Caption.tsx`):
```typescript
import { useExperiment } from '@/lib/experiments/useExperiment';
import { EXPERIMENTS } from '@/lib/experiments/registry';

export function Caption({ text }: { text: string }) {
  const variant = useExperiment(EXPERIMENTS.FEED_CAPTION_LINES);
  const maxLines = variant === '2l' ? 2 : 1;

  return (
    <p
      className={`text-white text-sm ${
        maxLines === 1 ? 'line-clamp-1' : 'line-clamp-2'
      }`}
    >
      {text}
    </p>
  );
}
```

#### 4. API 서버 업데이트

**Zod 검증 강화** (`app/api/analytics/route.ts`):
```typescript
import { validateEvent } from '@/lib/analytics/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const batch = Array.isArray(body) ? body : [body];

    // 각 이벤트 검증
    const validatedEvents = batch.map((event) => {
      try {
        return validateEvent(event);
      } catch (err) {
        console.error('[Analytics] Validation failed:', err);
        return null;
      }
    }).filter(Boolean);

    if (validatedEvents.length === 0) {
      return NextResponse.json(
        { error: 'No valid events' },
        { status: 400 }
      );
    }

    // PII 필터링 (서버 측 보호)
    const sanitized = validatedEvents.map(sanitizeEvent);

    // Supabase 삽입
    const supabase = getSupabaseServer();
    if (supabase) {
      const { error } = await supabase
        .from('analytics_events')
        .insert(sanitized);

      if (error && error.code !== '23505') { // 중복 제외
        throw error;
      }
    }

    return NextResponse.json({
      ok: true,
      count: validatedEvents.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Internal error' },
      { status: 500 }
    );
  }
}

function sanitizeEvent(event: any): any {
  // PII 제거 로직
  // 예: props에 free-form 텍스트 있으면 드롭
  return event;
}
```

### B. 우선순위 중간 (3-4시간)

#### 5. ESLint PII 검증 룰

**`.eslintrc.js` 확장**:
```javascript
module.exports = {
  rules: {
    'no-pii-in-analytics': 'error',
  },
  plugins: ['@zzik/analytics'],
};
```

**커스텀 룰** (`.eslint/rules/no-pii-in-analytics.js`):
```javascript
module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (
          node.callee.name === 'track' &&
          node.arguments.length >= 2
        ) {
          const propsArg = node.arguments[1];
          
          // props 객체 검사
          if (propsArg.type === 'ObjectExpression') {
            propsArg.properties.forEach((prop) => {
              const key = prop.key.name || prop.key.value;
              
              // 금지 키워드
              const forbidden = ['email', 'phone', 'address', 'password', 'ssn'];
              if (forbidden.some((word) => key.toLowerCase().includes(word))) {
                context.report({
                  node: prop,
                  message: `PII detected in analytics: "${key}" is prohibited`,
                });
              }
            });
          }
        }
      },
    };
  },
};
```

#### 6. 대시보드 SQL 업데이트

**기존 쿼리 조정** (`supabase/analytics_queries.sql`):
```sql
-- 1. 퍼널: 지도 → 장소 시트 (사양 준수)
WITH pin AS (
  SELECT
    device_id AS anon_id, -- 사양: anon_id
    ts_server AS ts,
    props->>'place_id' AS place_id
  FROM analytics_events
  WHERE name = 'pin_tap'
    AND ts_server >= NOW() - INTERVAL '7 days'
),
sheet AS (
  SELECT
    device_id AS anon_id,
    ts_server AS ts,
    props->>'place_id' AS place_id
  FROM analytics_events
  WHERE name = 'place_sheet_open'
    AND props->>'stage' IN ('half', 'full')
    AND ts_server >= NOW() - INTERVAL '7 days'
)
SELECT
  COUNT(DISTINCT pin.anon_id || ':' || pin.place_id) AS pin_taps,
  COUNT(DISTINCT sheet.anon_id || ':' || sheet.place_id) AS sheet_opens,
  ROUND(
    100.0 * COUNT(DISTINCT sheet.anon_id || ':' || sheet.place_id)::NUMERIC
    / NULLIF(COUNT(DISTINCT pin.anon_id || ':' || pin.place_id), 0),
    1
  ) AS conversion_pct
FROM pin
LEFT JOIN sheet ON pin.anon_id = sheet.anon_id AND pin.place_id = sheet.place_id;

-- 2. 평균 체류 시간 (post_view_end 기준)
SELECT
  AVG((props->>'dwell_ms')::INT) AS avg_dwell_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (props->>'dwell_ms')::INT) AS median_dwell_ms
FROM analytics_events
WHERE name = 'post_view_end'
  AND ts_server >= NOW() - INTERVAL '7 days';

-- 3. 실험 리프트 (사양 준수)
WITH exp AS (
  SELECT
    device_id AS anon_id,
    props->>'exp_key' AS exp_key,
    props->>'variant' AS variant,
    MIN(ts_server) AS exposed_at
  FROM analytics_events
  WHERE name = 'exp_exposure'
  GROUP BY 1, 2, 3
),
conv AS (
  SELECT
    device_id AS anon_id,
    MIN(ts_server) AS first_act_at
  FROM analytics_events
  WHERE name IN ('save_toggle', 'like_toggle')
    AND (props->>'active')::BOOLEAN IS TRUE
  GROUP BY 1
)
SELECT
  exp_key,
  variant,
  COUNT(*) AS users,
  ROUND(
    100.0 * SUM(
      CASE
        WHEN first_act_at IS NOT NULL AND first_act_at >= exposed_at
        THEN 1
        ELSE 0
      END
    ) / COUNT(*),
    1
  ) AS conversion_rate_pct
FROM exp
LEFT JOIN conv USING (anon_id)
GROUP BY 1, 2
ORDER BY 1, 2;
```

#### 7. 테스트 추가

**오프라인 큐 테스트** (`__tests__/analytics/queue.offline.test.ts`):
```typescript
import { track, flush } from '@/lib/analytics/client';
import { setConsent } from '@/lib/analytics/client';

describe('Offline Queue', () => {
  beforeEach(() => {
    localStorage.clear();
    setConsent(true);
    global.fetch = jest.fn();
  });

  it('should queue events offline', async () => {
    // Simulate offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    track('pin_tap', {
      place_id: 'p1',
      zoom: 14,
      lat: 37.5,
      lng: 126.9,
    });

    const queue = JSON.parse(
      localStorage.getItem('zzik:analytics:queue') || '[]'
    );
    expect(queue).toHaveLength(1);
    expect(queue[0].name).toBe('pin_tap');
  });

  it('should flush queue when online', async () => {
    // Queue events offline
    Object.defineProperty(navigator, 'onLine', { value: false });
    
    for (let i = 0; i < 5; i++) {
      track('pin_tap', { place_id: `p${i}`, zoom: 14, lat: 37.5, lng: 126.9 });
    }

    // Go online
    Object.defineProperty(navigator, 'onLine', { value: true });
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    await flush();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    const queue = JSON.parse(
      localStorage.getItem('zzik:analytics:queue') || '[]'
    );
    expect(queue).toHaveLength(0);
  });

  it('should auto-flush at 20 events', async () => {
    Object.defineProperty(navigator, 'onLine', { value: true });
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    for (let i = 0; i < 20; i++) {
      track('pin_tap', { place_id: `p${i}`, zoom: 14, lat: 37.5, lng: 126.9 });
    }

    // Should auto-flush at 20
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    expect(global.fetch).toHaveBeenCalled();
  });
});
```

**실험 결정론 테스트** (`__tests__/experiments/deterministic.test.ts`):
```typescript
import { assign } from '@/lib/experiments/engine';

describe('Experiment Assignment', () => {
  it('should assign same user to same variant consistently', () => {
    const userId = 'user-123';
    const expKey = 'test-exp';
    const variants = ['control', 'treatment'];

    const results = Array(100)
      .fill(null)
      .map(() => assign(userId, expKey, variants));

    // All should be same
    const unique = new Set(results);
    expect(unique.size).toBe(1);
  });

  it('should distribute variants according to weights', () => {
    const counts = { A: 0, B: 0, C: 0 };

    for (let i = 0; i < 1000; i++) {
      const result = assign(
        `user-${i}`,
        'test-exp',
        [
          { name: 'A', weight: 0.5 },
          { name: 'B', weight: 0.3 },
          { name: 'C', weight: 0.2 },
        ]
      );
      if (result.enabled) {
        counts[result.variant as 'A' | 'B' | 'C']++;
      }
    }

    const total = counts.A + counts.B + counts.C;
    expect(counts.A / total).toBeCloseTo(0.5, 1);
    expect(counts.B / total).toBeCloseTo(0.3, 1);
    expect(counts.C / total).toBeCloseTo(0.2, 1);
  });
});
```

---

## 📋 적용 체크리스트

### Phase A (완료)
- [x] 스키마 타입 업데이트
- [x] Zod 검증 추가
- [x] Web Vitals 통합
- [x] Long Tasks 추적
- [x] 동의 UI 컴포넌트
- [x] 배치 크기 조정 (20개)
- [x] context.experiments/flags 추가

### Phase B (진행 중)
- [ ] 앱 엔트리 초기화 (`app/layout.tsx`)
- [ ] 지도/피드/액션 계측 삽입
- [ ] 실험 레지스트리 생성
- [ ] useExperiment hook 구현
- [ ] API 서버 Zod 검증 강화
- [ ] ESLint PII 룰 추가
- [ ] SQL 쿼리 업데이트
- [ ] 테스트 보강

### Phase C (미착수)
- [ ] 동의 배너 앱 통합
- [ ] 설정 페이지 Privacy 카드 추가
- [ ] 대시보드 시각화 (Supabase or custom)
- [ ] 성능 모니터링 대시보드
- [ ] 실험 결과 분석 도구
- [ ] 데이터 보존 정책 스크립트
- [ ] PII 감사 자동화

---

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
cd zzik-live
npm install web-vitals
```

### 2. 환경 변수 확인
```env
# .env.local
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
```

### 3. 앱 초기화
```typescript
// app/layout.tsx (root)
import { initWebVitals } from '@/lib/perf/vitals';

useEffect(() => {
  initWebVitals();
}, []);
```

### 4. 첫 이벤트 전송
```typescript
import { track } from '@/lib/analytics/client';

track('pin_tap', {
  place_id: 'plc_123',
  zoom: 14,
  lat: 37.5665,
  lng: 126.9780,
});
```

### 5. 동의 UI 표시
```typescript
// app/layout.tsx (body)
<ConsentBanner />
```

---

## 📈 예상 타임라인

| 단계 | 작업 | 예상 시간 |
|------|------|----------|
| ✅ Phase A | 스키마/성능/UI | 완료 |
| 🔄 Phase B | 통합/테스트 | 3-4시간 |
| ⏳ Phase C | 대시보드/정책 | 4-6시간 |
| **총계** | **전체 구현** | **~10시간** |

---

## 🎯 다음 단계

1. **Phase B 완료**: 컴포넌트 계측 + 실험 통합
2. **테스트 실행**: 모든 품질 게이트 통과 확인
3. **Staging 배포**: 1% 샘플링으로 검증
4. **Production 롤아웃**: 25% → 100% 점진적 확대
5. **첫 실험 시작**: `PLACE_SHEET_AUTO_OPEN` 50/50

---

**문의**: 구현 중 문제가 있으면 PR 코멘트 또는 Slack #zzik-analytics 채널로 연락 주세요.
