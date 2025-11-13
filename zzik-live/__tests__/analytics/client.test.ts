/**
 * Analytics Client Tests
 * 
 * Tests for offline queue, consent, flush mechanism
 */

import { track, configure, identify, setConsent, flush } from '@/lib/analytics/client';
import { getDeviceId, getSessionId, clearIds } from '@/lib/analytics/ids';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    language: 'en-US',
    onLine: true,
  },
  writable: true,
});

describe('Analytics Client', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    clearIds();
    configure({ appVersion: '1.0.0', build: 'web' });
    setConsent(true);
    (global.fetch as jest.Mock).mockClear();
  });

  describe('track()', () => {
    it('should queue event with correct context', () => {
      track('pin_tap', {
        place_id: 'plc_123',
        zoom: 14,
        lat: 37.5,
        lng: 126.9,
      });

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(1);
      expect(queue[0].name).toBe('pin_tap');
      expect(queue[0].props.place_id).toBe('plc_123');
      expect(queue[0].context.app_version).toBe('1.0.0');
      expect(queue[0].context.build).toBe('web');
    });

    it('should respect consent setting', () => {
      setConsent(false);
      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(0);
    });

    it('should include user_id when identified', () => {
      identify('user_123');
      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue[0].context.user_id).toBe('user_123');
    });

    it('should generate unique event_id', () => {
      track('pin_tap', { place_id: 'test1', zoom: 14, lat: 37.5, lng: 126.9 });
      track('pin_tap', { place_id: 'test2', zoom: 14, lat: 37.5, lng: 126.9 });

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue[0].event_id).toBeTruthy();
      expect(queue[1].event_id).toBeTruthy();
      expect(queue[0].event_id).not.toBe(queue[1].event_id);
    });
  });

  describe('flush()', () => {
    it('should send queued events to server', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });
      await flush();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/analytics',
        expect.objectContaining({
          method: 'POST',
          headers: { 'content-type': 'application/json' },
        })
      );
    });

    it('should clear queue after successful flush', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });
      await flush();

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(0);
    });

    it('should not flush when offline', async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true,
      });

      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });
      await flush();

      expect(global.fetch).not.toHaveBeenCalled();

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(1);
    });

    it('should batch events (max 50)', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      });

      // Queue 75 events
      for (let i = 0; i < 75; i++) {
        mockLocalStorage.setItem(
          'zzik:analytics:queue',
          JSON.stringify(
            Array(i + 1).fill({
              event_id: `event_${i}`,
              name: 'test',
              schema_version: 1,
              ts_client: Date.now(),
              context: {},
              props: {},
            })
          )
        );
      }

      await flush();

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Should have been called twice (50 + 25)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should retry on network failure', async () => {
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ok: true }),
        });

      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });
      
      // First flush fails
      await flush();
      let queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(1);

      // Second flush succeeds
      await flush();
      await new Promise((resolve) => setTimeout(resolve, 100));
      queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(0);
    });
  });

  describe('configure()', () => {
    it('should set app version', () => {
      configure({ appVersion: '2.0.0' });
      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue[0].context.app_version).toBe('2.0.0');
    });

    it('should set build platform', () => {
      configure({ appVersion: '1.0.0', build: 'ios' });
      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });

      const queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue[0].context.build).toBe('ios');
    });
  });

  describe('setConsent()', () => {
    it('should flush queue when consent is granted', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      setConsent(false);
      mockLocalStorage.setItem('zzik:analytics:queue', JSON.stringify([
        {
          event_id: 'test',
          name: 'pin_tap',
          schema_version: 1,
          ts_client: Date.now(),
          context: {},
          props: {},
        },
      ]));

      setConsent(true);

      // Wait for async flush
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should clear queue when consent is revoked', () => {
      track('pin_tap', { place_id: 'test', zoom: 14, lat: 37.5, lng: 126.9 });
      
      let queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(1);

      setConsent(false);

      queue = JSON.parse(mockLocalStorage.getItem('zzik:analytics:queue') || '[]');
      expect(queue).toHaveLength(0);
    });
  });
});
