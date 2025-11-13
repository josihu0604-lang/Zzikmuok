/**
 * Analytics E2E Tests
 * 
 * Tests the complete analytics pipeline:
 * - Event tracking in UI
 * - Queue persistence
 * - Server collection
 * - Offline/online behavior
 */

import { test, expect, type Page } from '@playwright/test';

test.describe('Analytics Pipeline', () => {
  test.beforeEach(async ({ page }) => {
    // Enable analytics consent
    await page.addInitScript(() => {
      localStorage.setItem('zzik:consent:analytics', 'true');
    });
  });

  test('should track pin tap event', async ({ page }) => {
    let analyticsData: any = null;

    // Intercept analytics endpoint
    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      analyticsData = JSON.parse(request.postData() || '[]');
      await route.fulfill({ json: { ok: true, count: analyticsData.length } });
    });

    // Navigate to map page
    await page.goto('/map');

    // Wait for map to load and click a pin
    await page.waitForSelector('[data-place-id]', { timeout: 10000 });
    await page.click('[data-place-id="plc_123"]');

    // Wait for analytics request
    await page.waitForTimeout(500);

    // Verify event data
    expect(analyticsData).toBeTruthy();
    expect(Array.isArray(analyticsData)).toBe(true);
    
    const pinTapEvent = analyticsData.find((e: any) => e.name === 'pin_tap');
    expect(pinTapEvent).toBeTruthy();
    expect(pinTapEvent.props.place_id).toBe('plc_123');
    expect(pinTapEvent.context.app_version).toBeTruthy();
    expect(pinTapEvent.context.device_id).toBeTruthy();
    expect(pinTapEvent.context.session_id).toBeTruthy();
  });

  test('should track place sheet open event', async ({ page }) => {
    let analyticsData: any = null;

    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      analyticsData = JSON.parse(request.postData() || '[]');
      await route.fulfill({ json: { ok: true, count: analyticsData.length } });
    });

    await page.goto('/map');
    await page.waitForSelector('[data-place-id]');
    await page.click('[data-place-id="plc_123"]');

    // Wait for analytics request
    await page.waitForTimeout(500);

    const sheetEvent = analyticsData?.find((e: any) => e.name === 'place_sheet_open');
    expect(sheetEvent).toBeTruthy();
    expect(sheetEvent.props.place_id).toBe('plc_123');
    expect(['peek', 'half', 'full']).toContain(sheetEvent.props.stage);
  });

  test('should track post view with dwell time', async ({ page }) => {
    let analyticsData: any = null;

    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      const data = JSON.parse(request.postData() || '[]');
      
      // Collect all analytics data
      if (!analyticsData) {
        analyticsData = data;
      } else {
        analyticsData = analyticsData.concat(data);
      }

      await route.fulfill({ json: { ok: true, count: data.length } });
    });

    await page.goto('/feed');
    
    // Wait for feed to load
    await page.waitForSelector('[data-id]', { timeout: 10000 });

    // Scroll to trigger visibility
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(3000); // Dwell for 3 seconds

    // Scroll away to trigger post_view event
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);

    // Find post_view event
    const postViewEvent = analyticsData?.find((e: any) => e.name === 'post_view');
    expect(postViewEvent).toBeTruthy();
    expect(postViewEvent.props.dwell_ms).toBeGreaterThan(2000); // At least 2 seconds
    expect(postViewEvent.props.post_id).toBeTruthy();
  });

  test('should persist events offline and flush online', async ({ page, context }) => {
    const events: any[] = [];

    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      const data = JSON.parse(request.postData() || '[]');
      events.push(...data);
      await route.fulfill({ json: { ok: true, count: data.length } });
    });

    // Go offline
    await context.setOffline(true);

    await page.goto('/map');
    await page.waitForSelector('[data-place-id]');
    await page.click('[data-place-id="plc_123"]');

    // Verify event is queued but not sent
    await page.waitForTimeout(500);
    expect(events).toHaveLength(0);

    // Check localStorage queue
    const queuedEvents = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('zzik:analytics:queue') || '[]');
    });
    expect(queuedEvents.length).toBeGreaterThan(0);

    // Go back online
    await context.setOffline(false);

    // Trigger flush
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForTimeout(1000);

    // Verify events were sent
    expect(events.length).toBeGreaterThan(0);
    expect(events.some((e: any) => e.name === 'pin_tap')).toBe(true);
  });

  test('should respect consent settings', async ({ page }) => {
    let analyticsRequests = 0;

    await page.route('/api/analytics', async (route) => {
      analyticsRequests++;
      await route.fulfill({ json: { ok: true, count: 0 } });
    });

    // Disable consent
    await page.addInitScript(() => {
      localStorage.setItem('zzik:consent:analytics', 'false');
    });

    await page.goto('/map');
    await page.waitForSelector('[data-place-id]');
    await page.click('[data-place-id="plc_123"]');
    await page.waitForTimeout(1000);

    // No analytics should be sent
    expect(analyticsRequests).toBe(0);

    // Check queue is empty
    const queue = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('zzik:analytics:queue') || '[]');
    });
    expect(queue).toHaveLength(0);
  });

  test('should batch multiple events', async ({ page }) => {
    let batchSize = 0;

    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      const data = JSON.parse(request.postData() || '[]');
      batchSize = data.length;
      await route.fulfill({ json: { ok: true, count: data.length } });
    });

    await page.goto('/map');
    await page.waitForSelector('[data-place-id]');

    // Trigger multiple events quickly
    await page.click('[data-place-id="plc_123"]');
    await page.waitForTimeout(100);
    await page.click('[data-place-id="plc_456"]');
    await page.waitForTimeout(100);
    await page.click('[data-place-id="plc_789"]');

    await page.waitForTimeout(1000);

    // Should batch events together
    expect(batchSize).toBeGreaterThan(1);
  });

  test('should include proper context in all events', async ({ page }) => {
    let analyticsData: any = null;

    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      analyticsData = JSON.parse(request.postData() || '[]');
      await route.fulfill({ json: { ok: true, count: analyticsData.length } });
    });

    await page.goto('/map');
    await page.waitForSelector('[data-place-id]');
    await page.click('[data-place-id="plc_123"]');
    await page.waitForTimeout(500);

    expect(analyticsData).toBeTruthy();
    const event = analyticsData[0];

    // Verify context fields
    expect(event.context.app_version).toBeTruthy();
    expect(['web', 'ios', 'android', 'desktop']).toContain(event.context.build);
    expect(event.context.locale).toBeTruthy();
    expect(event.context.timezone).toBeTruthy();
    expect(event.context.screen.width).toBeGreaterThan(0);
    expect(event.context.screen.height).toBeGreaterThan(0);
    expect(event.context.device_id).toBeTruthy();
    expect(event.context.session_id).toBeTruthy();

    // Verify event structure
    expect(event.event_id).toBeTruthy();
    expect(event.name).toBeTruthy();
    expect(event.schema_version).toBe(1);
    expect(event.ts_client).toBeGreaterThan(0);
    expect(event.props).toBeTruthy();
  });

  test('should maintain session across page navigations', async ({ page }) => {
    const sessionIds: string[] = [];

    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      const data = JSON.parse(request.postData() || '[]');
      data.forEach((event: any) => {
        sessionIds.push(event.context.session_id);
      });
      await route.fulfill({ json: { ok: true, count: data.length } });
    });

    // First page
    await page.goto('/map');
    await page.waitForSelector('[data-place-id]');
    await page.click('[data-place-id="plc_123"]');
    await page.waitForTimeout(500);

    // Navigate to another page
    await page.goto('/feed');
    await page.waitForSelector('[data-id]');
    await page.waitForTimeout(1000);

    // All events should have the same session ID
    const uniqueSessions = new Set(sessionIds);
    expect(uniqueSessions.size).toBe(1);
  });

  test('should handle server errors gracefully', async ({ page }) => {
    let requestCount = 0;

    await page.route('/api/analytics', async (route) => {
      requestCount++;
      if (requestCount === 1) {
        // First request fails
        await route.fulfill({ status: 500, json: { error: 'Server error' } });
      } else {
        // Subsequent requests succeed
        await route.fulfill({ json: { ok: true, count: 1 } });
      }
    });

    await page.goto('/map');
    await page.waitForSelector('[data-place-id]');
    await page.click('[data-place-id="plc_123"]');
    await page.waitForTimeout(500);

    // Events should remain in queue after failure
    const queue = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('zzik:analytics:queue') || '[]');
    });
    expect(queue.length).toBeGreaterThan(0);

    // Trigger another flush
    await page.evaluate(() => {
      const { flush } = require('@/lib/analytics/client');
      flush();
    });
    await page.waitForTimeout(1000);

    // Verify retry worked
    expect(requestCount).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Experiment Exposure Tracking', () => {
  test('should track experiment exposure once', async ({ page }) => {
    let exposureEvents = 0;

    await page.route('/api/analytics', async (route) => {
      const request = route.request();
      const data = JSON.parse(request.postData() || '[]');
      data.forEach((event: any) => {
        if (event.name === 'experiment_exposure') {
          exposureEvents++;
        }
      });
      await route.fulfill({ json: { ok: true, count: data.length } });
    });

    await page.addInitScript(() => {
      localStorage.setItem('zzik:consent:analytics', 'true');
    });

    // Visit page multiple times
    await page.goto('/map');
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(1000);

    // Exposure should only be tracked once
    expect(exposureEvents).toBeLessThanOrEqual(1);
  });
});
