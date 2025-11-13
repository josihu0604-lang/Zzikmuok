# Analytics Integration Guide

This guide shows how to add analytics tracking to ZZIK LIVE components.

## Quick Start

### 1. Initialize Analytics

In your root layout or app initialization:

```tsx
import { configure, setConsent } from '@/lib/analytics/client';

// Configure on app start
configure({
  appVersion: '1.0.0', // From package.json
  build: 'web',        // or 'ios', 'android', 'desktop'
});

// Request consent (show UI to user)
const userConsent = await showConsentDialog();
setConsent(userConsent);
```

### 2. Track Events

```tsx
import { track } from '@/lib/analytics/client';

// Pin tap
track('pin_tap', {
  place_id: 'plc_123',
  zoom: 14,
  lat: 37.5665,
  lng: 126.9780,
});

// Place sheet open
track('place_sheet_open', {
  place_id: 'plc_123',
  stage: 'half', // 'peek' | 'half' | 'full'
});

// Post view (with dwell time)
track('post_view', {
  post_id: 'post_456',
  place_id: 'plc_123',
  dwell_ms: 5234,
  ratio: 0.95,
});
```

## Component Integration Examples

### Map Pin Component

```tsx
// components/map/Pin.tsx
import { track } from '@/lib/analytics/client';

export function Pin({ point, selected, onClick, mapZoom }: Props) {
  const handleClick = () => {
    // Track pin tap
    track('pin_tap', {
      place_id: point.id,
      zoom: mapZoom,
      lat: point.lat,
      lng: point.lng,
    });

    // Call original handler
    onClick?.();
  };

  return (
    <button onClick={handleClick} {...props}>
      {/* ... */}
    </button>
  );
}
```

### Place Sheet Component

```tsx
// components/map/PlaceSheet.tsx
import { useEffect } from 'react';
import { track } from '@/lib/analytics/client';

export function PlaceSheet({ placeId, stage }: Props) {
  // Track stage changes
  useEffect(() => {
    if (!placeId) return;

    track('place_sheet_open', {
      place_id: placeId,
      stage, // Current stage: 'peek' | 'half' | 'full'
    });
  }, [placeId, stage]);

  return (/* ... */);
}
```

### Feed Item Component

```tsx
// components/feed/FeedItem.tsx
import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics/client';

export function FeedItem({ item, active }: Props) {
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (active) {
      // Start tracking view time
      startTimeRef.current = performance.now();
    }

    return () => {
      if (startTimeRef.current && active) {
        // Calculate dwell time
        const dwellMs = Math.round(performance.now() - startTimeRef.current);

        // Track post view
        track('post_view', {
          post_id: item.id,
          place_id: item.placeId,
          dwell_ms: dwellMs,
          ratio: 1.0,
        });

        startTimeRef.current = 0;
      }
    };
  }, [active, item.id, item.placeId]);

  return (/* ... */);
}
```

### Intersection-based Visibility Tracking

```tsx
// components/feed/VerticalFeed.tsx
import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics/client';

export function VerticalFeed({ items }: Props) {
  const visibilityTracker = useRef<Map<string, { start: number; ratio: number }>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.getAttribute('data-id');
          if (!postId) return;

          if (entry.isIntersecting) {
            // Start tracking
            if (!visibilityTracker.current.has(postId)) {
              visibilityTracker.current.set(postId, {
                start: performance.now(),
                ratio: entry.intersectionRatio,
              });
            }
          } else {
            // Stop tracking
            const tracking = visibilityTracker.current.get(postId);
            if (tracking) {
              const visibleMs = Math.round(performance.now() - tracking.start);

              // Track if visible for more than 1 second with >60% visibility
              if (visibleMs > 1000 && tracking.ratio >= 0.6) {
                track('feed_item_visible', {
                  post_id: postId,
                  ratio: tracking.ratio,
                  visible_ms: visibleMs,
                });
              }

              visibilityTracker.current.delete(postId);
            }
          }
        });
      },
      { threshold: [0.0, 0.5, 0.6, 0.75, 1.0] }
    );

    // Observe all feed items
    const items = document.querySelectorAll('[data-id]');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [items]);

  return (/* ... */);
}
```

### Action Toggles (Like/Save)

```tsx
// components/feed/ActionButton.tsx
import { track } from '@/lib/analytics/client';

export function ActionButton({ type, postId, placeId, active, onToggle }: Props) {
  const handleToggle = () => {
    const newState = !active;

    // Track toggle event
    track(type === 'like' ? 'like_toggle' : 'save_toggle', {
      target: placeId ? 'place' : 'post',
      id: postId || placeId,
      active: newState,
      source: 'feed', // or 'place' | 'map'
    });

    // Call original handler
    onToggle?.(newState);
  };

  return (
    <button onClick={handleToggle} {...props}>
      {/* ... */}
    </button>
  );
}
```

### Error Tracking

```tsx
// components/ErrorBoundary.tsx
import { track } from '@/lib/analytics/client';

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error
    track('error', {
      code: error.name || 'unknown',
      surface: 'app_boundary',
      retryable: false,
      message: error.message,
    });

    // ... handle error
  }
}

// API error tracking
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (err) {
    track('error', {
      code: 'api_fetch_failed',
      surface: 'feed',
      retryable: true,
      message: String(err),
    });
    throw err;
  }
}
```

## A/B Experiments

### Basic Experiment

```tsx
import { assign, hasTrackedExposure, markExposureTracked } from '@/lib/experiments/engine';
import { track } from '@/lib/analytics/client';
import { getDeviceId } from '@/lib/analytics/ids';

function MyComponent() {
  // Assign variant
  const experimentKey = 'place_sheet_auto_open';
  const userKey = getDeviceId(); // or user_id if logged in

  const assignment = assign(
    userKey,
    experimentKey,
    [
      { name: 'on', weight: 0.5 },
      { name: 'off', weight: 0.5 },
    ],
    1.0 // 100% traffic
  );

  // Track exposure once
  useEffect(() => {
    if (assignment.enabled && !hasTrackedExposure(experimentKey)) {
      track('experiment_exposure', {
        key: experimentKey,
        variant: assignment.variant,
        bucket: assignment.bucket,
        traffic: 1.0,
      });
      markExposureTracked(experimentKey);
    }
  }, [assignment, experimentKey]);

  // Use variant
  if (assignment.enabled && assignment.variant === 'on') {
    // Show auto-open behavior
  }

  return (/* ... */);
}
```

## Privacy Guidelines

### ✅ Allowed

- **Device ID**: Anonymous UUID stored in localStorage
- **Session ID**: 30-minute TTL, regenerated on inactivity
- **User ID**: Only if user is logged in (no email/phone)
- **Screen dimensions**: Width, height, DPR
- **App version**: From package.json
- **Locale/Timezone**: From browser
- **Place IDs**: Internal identifiers (e.g., `plc_abc123`)
- **Geohash (7-char)**: ~150m precision for aggregation

### ❌ Prohibited

- **PII**: Email, phone number, name, exact address
- **Exact coordinates**: Must be snapped to 150m grid or geohash
- **Face identifiable data**: No user photos in events
- **Financial data**: Credit card, bank account
- **Auth tokens**: JWT, session tokens, passwords

### Coordinate Snapping Example

```tsx
// Snap coordinates to ~150m grid
function snapCoordinates(lat: number, lng: number): { lat: number; lng: number } {
  const precision = 0.001; // ~100m precision
  return {
    lat: Math.round(lat / precision) * precision,
    lng: Math.round(lng / precision) * precision,
  };
}

// Or use geohash (7 characters = ~150m)
import geohash from 'ngeohash';
const hash = geohash.encode(lat, lng, 7);
```

## Testing

### Unit Tests

```tsx
import { track, flush, setConsent } from '@/lib/analytics/client';

describe('Analytics Client', () => {
  beforeEach(() => {
    setConsent(true);
    localStorage.clear();
  });

  it('tracks events with context', () => {
    track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });
    
    const queue = JSON.parse(localStorage.getItem('zzik:analytics:queue') || '[]');
    expect(queue).toHaveLength(1);
    expect(queue[0].name).toBe('pin_tap');
  });

  it('respects consent', () => {
    setConsent(false);
    track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });
    
    const queue = JSON.parse(localStorage.getItem('zzik:analytics:queue') || '[]');
    expect(queue).toHaveLength(0);
  });
});
```

### E2E Tests

```tsx
import { test, expect } from '@playwright/test';

test('tracks pin tap event', async ({ page }) => {
  // Intercept analytics endpoint
  let eventData: any = null;
  await page.route('/api/analytics', async (route) => {
    const request = route.request();
    eventData = JSON.parse(request.postData() || '[]');
    await route.fulfill({ json: { ok: true } });
  });

  // Navigate and click pin
  await page.goto('/map');
  await page.click('[data-place-id="plc_123"]');

  // Verify event
  expect(eventData).toBeTruthy();
  expect(eventData[0].name).toBe('pin_tap');
  expect(eventData[0].props.place_id).toBe('plc_123');
});
```

## Rollout Strategy

### Phase 1: Silent Collection (Day 1-7)
- Deploy with `setConsent(false)` by default
- Enable for internal team only
- Verify pipeline health

### Phase 2: 1% Sample (Day 8-14)
- Add sampling: `Math.random() < 0.01 && setConsent(true)`
- Monitor error rates, schema violations
- Validate dashboard queries

### Phase 3: 25% Rollout (Day 15-30)
- Increase sampling to 25%
- Track performance impact
- Optimize batch sizes

### Phase 4: 100% Rollout (Day 30+)
- Full rollout with consent UI
- A/B test experiments enabled
- Production dashboards active

## Dashboard Queries

See `supabase/analytics_queries.sql` for SQL examples:
- Conversion funnels (map → sheet → post)
- NSM: Weekly Place-Engaged Users
- Experiment analysis (exposure → conversion)
- Error rate tracking
