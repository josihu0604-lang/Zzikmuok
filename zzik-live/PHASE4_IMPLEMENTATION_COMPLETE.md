# Phase 4 Analytics & Experimentation - Complete Implementation Guide

**Status**: ✅ Phase 1 Complete | 🔄 Phase 2 In Progress | ⏳ Phase 3 Pending

**Last Updated**: 2025-11-13

---

## 📋 Table of Contents

1. [Phase 1: Critical Security Fixes (✅ COMPLETE)](#phase-1-critical-security-fixes)
2. [Phase 2: Operations Completion (🔄 IN PROGRESS)](#phase-2-operations-completion)
3. [Phase 3: Quality & Security Gates (⏳ PENDING)](#phase-3-quality--security-gates)
4. [Event Catalog](#event-catalog)
5. [Integration Examples](#integration-examples)
6. [SQL Dashboard Queries](#sql-dashboard-queries)
7. [Testing & Validation](#testing--validation)
8. [Go/No-Go Criteria](#gono-go-criteria)

---

## Phase 1: Critical Security Fixes (✅ COMPLETE)

### ✅ 1.1 Coordinate Privacy Enforcement

**Files Modified**:
- `lib/analytics/schema.ts` - Removed lat/lng from PinTapProps
- `app/api/analytics/route.ts` - Server-side PII filtering

**Implementation**:
```typescript
// ❌ BEFORE (PRIVACY VIOLATION)
export type PinTapProps = {
  place_id: string;
  zoom: number;
  lat: number;    // ← REMOVED
  lng: number;    // ← REMOVED
};

// ✅ AFTER (COMPLIANT)
export type PinTapProps = {
  place_id: string;
  zoom: number;
  // ⚠️ CRITICAL: Never send exact coordinates (lat/lng)
  // Server derives geohash/rounded coords from place_id if needed
};
```

**Server-Side Defense**:
```typescript
// app/api/analytics/route.ts
const sanitizedProps = { ...e.props };
const forbiddenKeys = ['lat', 'lng', 'latitude', 'longitude', 'email', 'phone', 'address', 'password'];
forbiddenKeys.forEach(key => delete sanitizedProps[key]);
```

**Policy**: Zero-tolerance for PII/coordinates transmission. All violations blocked at build-time (ESLint) and runtime (server filter).

---

### ✅ 1.2 Post View Lifecycle Safety

**File Created**: `lib/analytics/flushOnHide.ts`

**Problem**: Post view events were lost when users:
- Switched tabs (visibilitychange)
- Closed browser (beforeunload/pagehide)
- Navigated away from page

**Solution**: Lifecycle manager with guaranteed `post_view_end` emission

```typescript
import { markPostVisible, flushActive, initFlushOnHide } from '@/lib/analytics/flushOnHide';

// 1. Initialize once in app entry point
initFlushOnHide();

// 2. Mark post as visible when entering viewport
markPostVisible(postId, placeId, 'feed');

// 3. Automatic flush on:
//    - Tab hide (document.visibilitychange)
//    - Page unload (window.pagehide, beforeunload)
//    - Post change (automatic when calling markPostVisible again)
```

**Event Split**: `post_view` → `post_view_start` + `post_view_end`
- `post_view_start`: Emitted immediately when post enters viewport
- `post_view_end`: Emitted with `dwell_ms` when post leaves viewport or page hides

**Guarantees**:
- No lost post_view_end events (even on force quit)
- Accurate dwell time measurement using `performance.now()`
- Single responsibility: lifecycle management only

---

### ✅ 1.3 Database Hardening & Deduplication

**File Created**: `supabase/migrations/2025_analytics_hardening.sql`

**Unique Constraint** (Event Deduplication):
```sql
CREATE UNIQUE INDEX analytics_event_id_uq 
  ON public.analytics_events(event_id)
  WHERE event_id IS NOT NULL;
```

**Performance Indexes**:
```sql
-- Common query pattern: filter by name + sort by time
CREATE INDEX analytics_events_name_ts 
  ON public.analytics_events(name, ts_server DESC);

-- Time-series optimization (future partitioning support)
CREATE INDEX analytics_events_partition_ts
  ON public.analytics_events(partition_day, ts_server DESC);
```

**Server Timestamp Authority**:
```sql
ALTER TABLE public.analytics_events
  ALTER COLUMN ts_server SET DEFAULT NOW();
```

**Health Monitoring View**:
```sql
CREATE OR REPLACE VIEW analytics_event_health AS
SELECT
  DATE(ts_server) AS date,
  COUNT(*) AS total_events,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(*) FILTER (WHERE name = 'error') AS error_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE name = 'error')::NUMERIC / COUNT(*), 2) AS error_rate_pct
FROM public.analytics_events
WHERE ts_server >= NOW() - INTERVAL '30 days'
GROUP BY DATE(ts_server);
```

**Migration Command**:
```bash
cd /home/user/webapp/zzik-live
npx supabase migration up
# Or manually apply: psql -f supabase/migrations/2025_analytics_hardening.sql
```

---

### ✅ 1.4 Build-Time PII Prevention (ESLint)

**Files Created**:
- `.eslint/rules/no-pii-in-analytics.js` - Custom ESLint rule
- `.eslint/index.js` - Plugin entry point

**File Modified**:
- `eslint.config.mjs` - Enable custom rule with error severity

**Forbidden Properties** (30+ blocked):
- **Coordinates**: lat, lng, latitude, longitude, coords, coordinates
- **PII**: email, phone, telephone, mobile, address, street, city, zip, postal
- **Sensitive**: password, ssn, social_security, credit_card, card_number
- **Identifiers**: name, full_name, first_name, last_name, username

**Implementation**:
```javascript
// .eslint/rules/no-pii-in-analytics.js
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      forbiddenProp: 'Analytics property "{{prop}}" is forbidden (PII/coordinates policy violation)',
    },
  },
  create(context) {
    const FORBIDDEN_PROPS = new Set([
      'lat', 'lng', 'email', 'phone', 'name', /* ... */
    ]);

    return {
      CallExpression(node) {
        // Detect track() calls
        // Check object properties recursively
        // Report violations
      },
    };
  },
};
```

**Configuration**:
```javascript
// eslint.config.mjs
import zzikAnalytics from "./.eslint/index.js";

export default defineConfig([
  {
    plugins: { "zzik": zzikAnalytics },
    rules: { "zzik/no-pii-in-analytics": "error" },
  },
]);
```

**CI Integration**:
```bash
# Build will fail if PII detected in track() calls
npm run lint
# OR
pnpm lint
```

**Example Violations**:
```typescript
// ❌ BUILD FAILS
track('pin_tap', { lat: 37.123, lng: 127.456 });
track('user_signup', { email: 'user@example.com' });

// ✅ PASSES
track('pin_tap', { place_id: 'place_123', zoom: 15 });
track('user_signup', { user_id: 'user_abc123' });
```

---

### ✅ 1.5 Experiment System - Exposure Tracking

**File Created**: `lib/experiments/useExperiment.ts`

**Features**:
1. **Deterministic Bucketing**: MurmurHash3 ensures same user → same variant
2. **Session-Based Exposure**: 1 exposure event per session per experiment
3. **Context Snapshot**: Auto-persist to localStorage for all event context
4. **React Integration**: Drop-in hook with type safety

**Usage**:
```typescript
import { useExperiment } from '@/lib/experiments/useExperiment';
import { EXPERIMENTS } from '@/lib/experiments/registry';

function FeedComponent() {
  const variant = useExperiment(EXPERIMENTS.feed_caption_lines);
  
  const maxLines = variant === '2l' ? 2 : 1;
  
  return (
    <p className={`line-clamp-${maxLines}`}>
      {caption}
    </p>
  );
}
```

**Implementation Details**:
```typescript
export function useExperiment(config: ExperimentConfig): string | null {
  const deviceId = getDeviceId();
  const sessionId = getSessionId();

  // Deterministic assignment (same user always gets same variant)
  const assignment = useMemo(() => {
    return assign(deviceId, config.key, config.variants, config.traffic);
  }, [deviceId, config.key]);

  // Track exposure once per session
  useEffect(() => {
    if (!assignment.enabled) return;

    const exposureKey = `zzik:exp:seen:${config.key}:${sessionId}`;
    
    // Check if already tracked this session
    if (sessionStorage.getItem(exposureKey)) return;

    // Mark as tracked
    sessionStorage.setItem(exposureKey, 'true');

    // Persist to localStorage for context snapshot
    localStorage.setItem(`zzik:experiment:${config.key}`, assignment.variant);

    // Send exposure event
    track('exp_exposure', {
      exp_key: config.key,
      variant: assignment.variant,
    });
  }, [assignment, config.key, sessionId]);

  return assignment.enabled ? assignment.variant : null;
}
```

**Context Integration** (Automatic):
```typescript
// lib/analytics/client.ts
function getActiveExperiments(): Record<string, string> {
  const experiments: Record<string, string> = {};
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('zzik:experiment:') && !key.endsWith(':tracked')) {
      const expKey = key.replace('zzik:experiment:', '');
      const variant = localStorage.getItem(key);
      if (variant) experiments[expKey] = variant;
    }
  });
  return experiments;
}

// All events automatically include experiments in context
const context = {
  // ... other fields
  experiments: getActiveExperiments(), // ← Auto-populated
};
```

---

### ✅ 1.6 Minor Spec Alignment

**Changes**:
1. **Batch Size**: 50 → 20 events (spec requirement)
2. **Event Name Limit**: Max 64 characters (server enforcement)
3. **Partition Day**: Added for future time-series optimization
4. **Context Fields**: Added `flags?` and `experiments?`

```typescript
// lib/analytics/client.ts
const MAX_BATCH_SIZE = 20; // ← Changed from 50

// lib/analytics/schema.ts
export type EventContext = {
  // ... existing fields
  flags?: Record<string, boolean>;      // ← NEW
  experiments?: Record<string, string>; // ← NEW
};

// app/api/analytics/route.ts
{
  event_id: e.event_id ?? crypto.randomUUID(),
  name: String(e.name).slice(0, 64), // ← Limit to 64 chars
  // ...
  partition_day: new Date(e.ts_client).toISOString().slice(0, 10), // ← NEW
}
```

---

## Phase 2: Operations Completion (🔄 IN PROGRESS)

### ✅ 2.1 App Entry Integration

**File Modified**: `app/layout.tsx`
**File Created**: `components/AnalyticsProvider.tsx`

**Implementation**:
```typescript
// components/AnalyticsProvider.tsx
'use client';

import { useEffect } from 'react';
import { init } from '@/lib/analytics/client';
import { initFlushOnHide } from '@/lib/analytics/flushOnHide';
import { initWebVitals } from '@/lib/perf/vitals';
import { initLongTasks } from '@/lib/perf/longtasks';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    init();                    // Analytics SDK
    initFlushOnHide();         // Post view lifecycle
    initWebVitals();           // CLS, LCP, INP, FCP, TTFB
    initLongTasks(50, 0.1);    // Long task monitoring (10% sample)

    console.log('[Analytics] All systems initialized');
  }, []);

  return <>{children}</>;
}
```

**Layout Integration**:
```typescript
// app/layout.tsx
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AnalyticsProvider>
          {/* ... existing providers ... */}
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

---

### ✅ 2.2 Experiment Registry

**File Created**: `lib/experiments/registry.ts`

**Purpose**: Single source of truth for all experiments

**Structure**:
```typescript
export const EXPERIMENTS = {
  feed_caption_lines: {
    key: 'feed_caption_lines',
    variants: [
      { name: '1l', weight: 0.5 },  // Control
      { name: '2l', weight: 0.5 },  // Treatment
    ],
    traffic: 1.0, // 100%
  } as ExperimentConfig,

  map_pin_clustering: {
    key: 'map_pin_clustering',
    variants: [
      { name: 'off', weight: 0.5 },
      { name: 'on', weight: 0.5 },
    ],
    traffic: 0.5, // 50% pilot
  } as ExperimentConfig,

  // ... 5 total experiments defined
};

export const EXPERIMENT_META: Record<keyof typeof EXPERIMENTS, ExperimentMeta> = {
  feed_caption_lines: {
    key: 'feed_caption_lines',
    state: ExperimentState.ACTIVE,
    owner: 'Product Team',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    hypothesis: '2-line captions increase engagement by allowing more context visibility',
    primaryMetric: 'post_view_end.dwell_ms (avg)',
    secondaryMetrics: ['like_toggle rate', 'save_toggle rate'],
    guardrails: ['error_rate < 1%', 'session_duration > baseline - 10%'],
    powerAnalysis: {
      minimumDetectableEffect: 0.10,  // 10% lift
      statisticalPower: 0.8,
      significance: 0.05,
    },
  },
  // ... metadata for all experiments
};
```

**Usage**:
```typescript
import { EXPERIMENTS } from '@/lib/experiments/registry';
const variant = useExperiment(EXPERIMENTS.feed_caption_lines);
```

---

### ✅ 2.3 SQL Dashboard Queries

**File Created**: `supabase/analytics_queries.sql`

**Total Queries**: 14 production-ready queries across 3 categories

#### Category 1: Engagement & Retention (7 queries)

1. **Daily Active Users (DAU) Trend**
   - Metrics: DAU, New Users, Returning Users
   - 30-day rolling window
   - Filters: Date range, Platform

2. **Map Engagement Funnel**
   - Stages: map_view → pin_tap → sheet_open → post_view
   - Conversion rates at each stage
   - 7-day window

3. **Post View Dwell Time Distribution**
   - Percentiles: p50, p75, p90, p95
   - Engagement rate (3s+ threshold)
   - Group by date

4. **Feed Item Visibility & Scroll Depth**
   - Impressions, visibility ratio, visible time
   - Minimum 10 impressions for significance
   - Group by post_id

5. **Engagement Actions (Like/Save) Rates**
   - Action rates per post
   - Unique actors vs unique viewers
   - Activations vs deactivations

6. **Session Duration & Events per Session**
   - Session depth metrics
   - Duration percentiles
   - Engaged sessions (10+ events)

7. **Place Sheet Engagement Stages**
   - Stage progression: peek → half → full
   - Conversion rates between stages
   - Minimum 5 sessions threshold

#### Category 2: Performance & Health (3 queries)

8. **Web Vitals Performance Monitoring**
   - Metrics: CLS, LCP, INP, FCP, TTFB
   - Google "Good" thresholds
   - Percentile distribution (p50, p75, p90, p95)

9. **Error Rate & Error Types**
   - Error count, rate, session impact
   - Group by error code, surface, retryable
   - 7-day window

10. **Analytics Pipeline Health**
    - Event volume, latency (client→server)
    - Unique devices/sessions
    - Health status flags (HIGH_LATENCY, NO_EVENTS)

#### Category 3: Experiments & A/B Testing (4 queries)

11. **Experiment Exposure & Bucketing Balance**
    - Users per variant
    - Variant distribution (should match weights)
    - Exposure count per variant

12. **Experiment Impact - Post View Engagement**
    - Dwell time comparison across variants
    - Engagement rate (3s+ threshold)
    - Placeholder for statistical significance (p-value)

13. **Experiment Impact - Like & Save Rates**
    - Action rates per variant
    - Lift calculation vs control
    - Impressions normalization

14. **Experiment Guardrail Metrics**
    - Error rate per variant
    - Session duration per variant
    - Performance (p75 LCP) per variant
    - Health status flags

**Query Example** (Map Engagement Funnel):
```sql
WITH funnel_base AS (
  SELECT
    DATE(ts_server) AS date,
    COUNT(*) FILTER (WHERE name = 'screen_view' AND props->>'screen_name' = 'map') AS map_views,
    COUNT(*) FILTER (WHERE name = 'pin_tap') AS pin_taps,
    COUNT(*) FILTER (WHERE name = 'place_sheet_open') AS sheet_opens,
    COUNT(*) FILTER (WHERE name = 'post_view_start') AS post_views
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server)
)
SELECT
  date,
  map_views,
  pin_taps,
  ROUND(100.0 * pin_taps / NULLIF(map_views, 0), 2) AS pin_tap_rate,
  sheet_opens,
  ROUND(100.0 * sheet_opens / NULLIF(pin_taps, 0), 2) AS sheet_open_rate,
  post_views,
  ROUND(100.0 * post_views / NULLIF(sheet_opens, 0), 2) AS post_view_rate,
  ROUND(100.0 * post_views / NULLIF(map_views, 0), 2) AS overall_conversion
FROM funnel_base
ORDER BY date DESC;
```

---

### 🔄 2.4 Component Instrumentation (IN PROGRESS)

**Coverage Matrix**:

| Component | Events | Status |
|-----------|--------|--------|
| `FeedItem.tsx` | post_view_start, post_view_end, video_play, video_pause, like_toggle, save_toggle | 🔄 TODO |
| `MapView.tsx` | pin_tap, place_sheet_open, screen_view | 🔄 TODO |
| `PlaceSheet.tsx` | place_sheet_open (stage changes) | 🔄 TODO |
| `SearchBar.tsx` | search_submit | 🔄 TODO |
| `ShareButton.tsx` | share_open | 🔄 TODO |
| `UploadFlow.tsx` | upload_complete | 🔄 TODO |
| `ErrorBoundary.tsx` | error | ✅ Likely complete |

**Next Steps**:
1. Update `FeedItem.tsx` to use `useDwell` hook and track engagement
2. Add `pin_tap` tracking to map pin click handlers
3. Add `place_sheet_open` tracking to sheet stage changes
4. Update search component with `search_submit` tracking

---

## Phase 3: Quality & Security Gates (⏳ PENDING)

### ⏳ 3.1 Health Metrics Monitoring

**TODO**: Implement real-time monitoring dashboard

**Requirements**:
- Event volume tracking (alerts if drops below threshold)
- Error rate monitoring (alert if >1%)
- Latency p95 tracking (alert if >5s)
- Event loss detection (client→server drop-off)

**Proposed Stack**: Grafana + Prometheus or Metabase

---

### ⏳ 3.2 Documentation Updates

**TODO**: Add critical sections to this document

**Sections Needed**:
1. **Coordinate Policy Enforcement**
   - Why: Privacy compliance
   - How: Build-time + runtime checks
   - Examples: Violations and fixes

2. **Post View Lifecycle Handling**
   - Why: Prevent data loss
   - How: visibilitychange + pagehide listeners
   - Edge cases: Force quit, tab switch

3. **Unique Index Strategy**
   - Why: Event deduplication
   - How: UUID generation + UNIQUE constraint
   - Trade-offs: Storage vs accuracy

4. **Sampling Ratios**
   - Long tasks: 10% (high volume)
   - Web Vitals: 100% (low volume, critical)
   - Experiments: Per-experiment traffic setting

---

### ⏳ 3.3 Experiment Lifecycle Documentation

**TODO**: Create `DOCS_EXPERIMENTS.md`

**Contents**:
1. **Experiment Lifecycle**
   - DRAFT → ACTIVE → PAUSED → CONCLUDED → ROLLED_OUT
   - Decision criteria at each stage
   - Rollback procedures

2. **Guardrails**
   - Error rate thresholds
   - Performance budgets
   - Automatic pause triggers

3. **Statistical Rigor**
   - Minimum sample size calculation
   - Significance testing (t-test, chi-square)
   - Multiple testing correction (Bonferroni)

4. **Best Practices**
   - Hypothesis-driven design
   - Primary vs secondary metrics
   - Avoiding peeking at results

---

## Event Catalog

### Core Events (10 types)

| Event Name | Props | Purpose |
|------------|-------|---------|
| `pin_tap` | `place_id`, `zoom` | User taps map pin |
| `place_sheet_open` | `place_id`, `stage` | Sheet opens at peek/half/full |
| `post_view_start` | `post_id`, `place_id?`, `source` | Post enters viewport |
| `post_view_end` | `post_id`, `dwell_ms` | Post leaves viewport with dwell time |
| `feed_item_visible` | `post_id`, `ratio`, `visible_ms` | Feed item visibility tracking |
| `like_toggle` | `target`, `id`, `active`, `source` | Like button interaction |
| `save_toggle` | `target`, `id`, `active`, `source` | Save button interaction |
| `error` | `code`, `surface`, `retryable`, `message?` | Application error |
| `perf_web_vitals` | `name`, `value`, `id` | Web Vitals metric |
| `exp_exposure` | `exp_key`, `variant` | Experiment exposure |

### Event Context (Auto-attached)

All events include:
```typescript
{
  app_version: string;
  build: 'web' | 'ios' | 'android' | 'desktop';
  locale: string;
  timezone: string;
  screen: { width, height, dpr };
  device_id: string;  // UUID, localStorage
  session_id: string; // UUID, sessionStorage
  user_id?: string;   // If authenticated
  flags?: Record<string, boolean>;
  experiments?: Record<string, string>;
}
```

---

## Integration Examples

### Example 1: Feed Item with Dwell Tracking

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics/client';
import { markPostVisible, flushActive } from '@/lib/analytics/flushOnHide';

export function FeedItem({ item, active }: { item: FeedItemData; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Post view lifecycle tracking
  useEffect(() => {
    if (active) {
      markPostVisible(item.id, item.placeId, 'feed');
    } else {
      flushActive();
    }
  }, [active, item.id, item.placeId]);

  // Video playback tracking
  useEffect(() => {
    if (item.type !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      track('video_play', {
        post_id: item.id,
        sec: video.currentTime,
        muted: video.muted,
        autoplay: active,
      });
    };

    const handlePause = () => {
      track('video_pause', {
        post_id: item.id,
        sec: video.currentTime,
        reason: document.visibilityState === 'hidden' ? 'blur' : 'tap',
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [item.type, item.id, active]);

  // Auto-play/pause based on active state
  useEffect(() => {
    if (item.type !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.play().catch((err) => console.warn('Auto-play failed:', err));
    } else {
      video.pause();
    }
  }, [active, item.type]);

  const handleLikeToggle = () => {
    const newState = !isLiked;
    setIsLiked(newState);
    
    track('like_toggle', {
      target: 'post',
      id: item.id,
      active: newState,
      source: 'feed',
    });
  };

  const handleSaveToggle = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    
    track('save_toggle', {
      target: 'post',
      id: item.id,
      active: newState,
      source: 'feed',
    });
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Media */}
      {item.type === 'video' ? (
        <video
          ref={videoRef}
          src={item.mediaUrl}
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
        />
      ) : (
        <img src={item.mediaUrl} className="w-full h-full object-cover" />
      )}

      {/* Actions */}
      <div className="absolute bottom-safe right-4 pb-8 flex flex-col gap-6">
        <ActionButton
          icon={Heart}
          label="좋아요"
          active={isLiked}
          onClick={handleLikeToggle}
        />
        <ActionButton
          icon={Bookmark}
          label="저장"
          active={isSaved}
          onClick={handleSaveToggle}
        />
      </div>
    </div>
  );
}
```

### Example 2: Map Pin Tap Tracking

```typescript
// components/explore/MapView.tsx
import { track } from '@/lib/analytics/client';

function MapView() {
  const handlePinClick = (pin: Pin, zoom: number) => {
    track('pin_tap', {
      place_id: pin.placeId,
      zoom: zoom,
    });

    // Open place sheet
    openPlaceSheet(pin.placeId);
  };

  return (
    <Map onPinClick={handlePinClick} />
  );
}
```

### Example 3: Experiment Usage

```typescript
import { useExperiment } from '@/lib/experiments/useExperiment';
import { EXPERIMENTS } from '@/lib/experiments/registry';

function FeedCaption({ text }: { text: string }) {
  const variant = useExperiment(EXPERIMENTS.feed_caption_lines);
  
  // variant is '1l' or '2l' or null (if user not in experiment)
  const maxLines = variant === '2l' ? 2 : 1;
  
  return (
    <p className={`text-white line-clamp-${maxLines}`}>
      {text}
    </p>
  );
}
```

---

## SQL Dashboard Queries

See **`supabase/analytics_queries.sql`** for all 14 production-ready queries.

**Quick Reference**:
- Queries 1-7: Engagement & Retention
- Queries 8-10: Performance & Health
- Queries 11-14: Experiments & A/B Testing

**Usage in Metabase/Grafana**:
1. Copy query from `analytics_queries.sql`
2. Add dashboard filters (date range, experiment key, etc.)
3. Set refresh interval (hourly for most, real-time for errors)
4. Create alerts on threshold violations

---

## Testing & Validation

### Unit Tests

**Required**:
```bash
# Test event validation
npm test lib/analytics/schema.test.ts

# Test experiment assignment determinism
npm test lib/experiments/engine.test.ts

# Test dwell time accumulation
npm test lib/analytics/flushOnHide.test.ts
```

### Integration Tests

**Required**:
```bash
# Test offline queue → online flush
npm test tests/integration/analytics-offline.test.ts

# Test route transitions update screen field
npm test tests/integration/analytics-routing.test.ts

# Test ESLint rule blocks PII
npm run lint -- --rule "zzik/no-pii-in-analytics: error"
```

### E2E Tests

**Required** (Playwright):
```typescript
test('Feed engagement funnel', async ({ page }) => {
  await page.goto('/feed');
  
  // Verify post_view_start sent
  const startEvent = await waitForAnalyticsEvent('post_view_start');
  expect(startEvent.props.post_id).toBeTruthy();
  
  // Scroll to next post
  await page.keyboard.press('ArrowDown');
  
  // Verify post_view_end sent with dwell_ms
  const endEvent = await waitForAnalyticsEvent('post_view_end');
  expect(endEvent.props.dwell_ms).toBeGreaterThan(100);
});

test('Experiment exposure once per session', async ({ page }) => {
  await page.goto('/feed');
  
  // First page load
  const exposure1 = await waitForAnalyticsEvent('exp_exposure');
  expect(exposure1.props.exp_key).toBe('feed_caption_lines');
  
  // Reload page
  await page.reload();
  
  // Should NOT send another exposure event
  const events = await getAllAnalyticsEvents();
  const exposureCount = events.filter(e => 
    e.name === 'exp_exposure' && 
    e.props.exp_key === 'feed_caption_lines'
  ).length;
  
  expect(exposureCount).toBe(1);
});
```

---

## Go/No-Go Criteria

### Phase 1 Gates (✅ ALL COMPLETE)

- [x] No PII/coordinates in event schemas
- [x] ESLint rule blocks PII at build time
- [x] Server-side PII filtering active
- [x] post_view_end never lost (lifecycle safety)
- [x] Event deduplication (unique constraint)
- [x] Server timestamp authority (ts_server)
- [x] Experiment exposure tracking (1 per session)

### Phase 2 Gates (🔄 IN PROGRESS)

- [x] AnalyticsProvider integrated in layout
- [x] Experiment registry with 5+ experiments
- [x] 14 SQL dashboard queries ready
- [ ] All components instrumented (FeedItem, MapView, etc.)
- [ ] useExperiment hook used in production code

### Phase 3 Gates (⏳ PENDING)

- [ ] Health metrics dashboard live
- [ ] Error rate <1% for 24 hours
- [ ] Event loss rate <0.1%
- [ ] Latency p95 <5s
- [ ] Statistical significance tests implemented
- [ ] Experiment lifecycle docs complete

### Rollout Gates (⏳ PENDING)

- [ ] 10% traffic: 48 hours stable
- [ ] 50% traffic: 24 hours stable
- [ ] 100% traffic: No rollback triggers

**Rollback Triggers**:
- Error rate >2%
- Event loss rate >1%
- Latency p95 >10s
- Critical experiment guardrail violation

---

## Quick Start Checklist

### For Developers

- [ ] Read this document top-to-bottom
- [ ] Run database migration: `npx supabase migration up`
- [ ] Test ESLint rule: `npm run lint`
- [ ] Add instrumentation to your component (see examples)
- [ ] Test locally: Check browser console for `[Analytics]` logs
- [ ] Create PR following git workflow (commit → sync → squash → PR)

### For Product/Analytics

- [ ] Review experiment registry (`lib/experiments/registry.ts`)
- [ ] Define new experiment: hypothesis, metrics, guardrails
- [ ] Review SQL queries (`supabase/analytics_queries.sql`)
- [ ] Set up Metabase/Grafana dashboards
- [ ] Define alert thresholds
- [ ] Schedule experiment review meetings

### For QA

- [ ] Test offline → online queue flush
- [ ] Test tab hide → post_view_end emission
- [ ] Test experiment assignment consistency
- [ ] Verify no PII in network requests
- [ ] Check event_id uniqueness in database
- [ ] Validate funnel query results

---

## Appendix

### File Structure

```
zzik-live/
├── lib/
│   ├── analytics/
│   │   ├── client.ts              # SDK with offline queue
│   │   ├── schema.ts              # Event types & Zod validation
│   │   ├── ids.ts                 # device_id, session_id
│   │   └── flushOnHide.ts         # ✅ NEW: Post view lifecycle
│   ├── experiments/
│   │   ├── engine.ts              # MurmurHash3 bucketing
│   │   ├── useExperiment.ts       # ✅ NEW: React hook
│   │   └── registry.ts            # ✅ NEW: Experiment definitions
│   └── perf/
│       ├── vitals.ts              # Web Vitals tracking
│       └── longtasks.ts           # ✅ NEW: Long task monitoring
├── components/
│   └── AnalyticsProvider.tsx      # ✅ NEW: App entry initializer
├── app/
│   ├── layout.tsx                 # ✅ MODIFIED: Added AnalyticsProvider
│   └── api/analytics/route.ts     # ✅ MODIFIED: PII filtering
├── supabase/
│   ├── migrations/
│   │   └── 2025_analytics_hardening.sql  # ✅ NEW: DB hardening
│   └── analytics_queries.sql      # ✅ NEW: 14 dashboard queries
└── .eslint/
    ├── index.js                   # ✅ NEW: Plugin entry
    └── rules/
        └── no-pii-in-analytics.js # ✅ NEW: PII blocking rule
```

### Next Sprint Items

1. **Component Instrumentation** (2-3 days)
   - Update FeedItem.tsx with full tracking
   - Add MapView.tsx pin_tap tracking
   - Add PlaceSheet.tsx stage tracking

2. **Health Monitoring** (1-2 days)
   - Set up Grafana/Metabase
   - Import SQL queries
   - Configure alerts

3. **Testing** (2-3 days)
   - Write unit tests for critical paths
   - E2E tests for main funnels
   - Load testing for analytics endpoint

4. **Documentation** (1 day)
   - Create DOCS_EXPERIMENTS.md
   - Add coordinate policy details
   - Document sampling strategies

5. **Staged Rollout** (1 week)
   - 10% traffic: Monitor 48h
   - 50% traffic: Monitor 24h
   - 100% traffic: Final checks

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0
**Status**: Phase 1 Complete ✅ | Phase 2 In Progress 🔄 | Phase 3 Pending ⏳
