/**
 * Analytics IDs Tests
 * 
 * Tests for device ID and session ID generation
 */

import { getDeviceId, getSessionId, clearIds } from '@/lib/analytics/ids';

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

describe('Analytics IDs', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    clearIds();
  });

  describe('getDeviceId()', () => {
    it('should generate device ID on first call', () => {
      const deviceId = getDeviceId();
      expect(deviceId).toBeTruthy();
      expect(typeof deviceId).toBe('string');
    });

    it('should persist device ID across calls', () => {
      const id1 = getDeviceId();
      const id2 = getDeviceId();
      expect(id1).toBe(id2);
    });

    it('should use localStorage for persistence', () => {
      const deviceId = getDeviceId();
      const storedId = mockLocalStorage.getItem('zzik:device_id');
      expect(storedId).toBe(deviceId);
    });

    it('should reuse existing device ID from localStorage', () => {
      mockLocalStorage.setItem('zzik:device_id', 'existing-device-id');
      const deviceId = getDeviceId();
      expect(deviceId).toBe('existing-device-id');
    });
  });

  describe('getSessionId()', () => {
    it('should generate session ID on first call', () => {
      const sessionId = getSessionId();
      expect(sessionId).toBeTruthy();
      expect(typeof sessionId).toBe('string');
    });

    it('should persist session ID within TTL', () => {
      const id1 = getSessionId();
      const id2 = getSessionId();
      expect(id1).toBe(id2);
    });

    it('should regenerate session ID after TTL expiry', () => {
      const id1 = getSessionId();

      // Simulate TTL expiry (30 minutes)
      const expiredTime = Date.now() - (31 * 60 * 1000);
      mockLocalStorage.setItem('zzik:session_at', String(expiredTime));

      const id2 = getSessionId();
      expect(id2).not.toBe(id1);
    });

    it('should update session timestamp on each call', () => {
      const before = Date.now();
      getSessionId();
      const timestamp = Number(mockLocalStorage.getItem('zzik:session_at'));
      const after = Date.now();

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('should use same session ID when called rapidly', () => {
      const ids = [];
      for (let i = 0; i < 10; i++) {
        ids.push(getSessionId());
      }

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(1);
    });

    it('should regenerate when session_id is missing but timestamp exists', () => {
      mockLocalStorage.setItem('zzik:session_at', String(Date.now()));
      mockLocalStorage.removeItem('zzik:session_id');

      const sessionId = getSessionId();
      expect(sessionId).toBeTruthy();
      expect(mockLocalStorage.getItem('zzik:session_id')).toBe(sessionId);
    });
  });

  describe('clearIds()', () => {
    it('should remove device ID', () => {
      getDeviceId();
      expect(mockLocalStorage.getItem('zzik:device_id')).toBeTruthy();

      clearIds();
      expect(mockLocalStorage.getItem('zzik:device_id')).toBeNull();
    });

    it('should remove session ID', () => {
      getSessionId();
      expect(mockLocalStorage.getItem('zzik:session_id')).toBeTruthy();

      clearIds();
      expect(mockLocalStorage.getItem('zzik:session_id')).toBeNull();
    });

    it('should remove session timestamp', () => {
      getSessionId();
      expect(mockLocalStorage.getItem('zzik:session_at')).toBeTruthy();

      clearIds();
      expect(mockLocalStorage.getItem('zzik:session_at')).toBeNull();
    });
  });

  describe('Session TTL Edge Cases', () => {
    it('should handle exactly 30 minute boundary', () => {
      const id1 = getSessionId();

      // Set timestamp to exactly 30 minutes ago
      const exactTTL = Date.now() - (30 * 60 * 1000);
      mockLocalStorage.setItem('zzik:session_at', String(exactTTL));

      const id2 = getSessionId();
      expect(id2).toBe(id1); // Should NOT regenerate at exact boundary
    });

    it('should handle 30 minutes + 1ms', () => {
      const id1 = getSessionId();

      // Set timestamp to 30 minutes + 1ms ago
      const pastTTL = Date.now() - (30 * 60 * 1000 + 1);
      mockLocalStorage.setItem('zzik:session_at', String(pastTTL));

      const id2 = getSessionId();
      expect(id2).not.toBe(id1); // Should regenerate
    });

    it('should handle future timestamps (clock skew)', () => {
      const id1 = getSessionId();

      // Set timestamp to future
      const futureTime = Date.now() + 10000;
      mockLocalStorage.setItem('zzik:session_at', String(futureTime));

      const id2 = getSessionId();
      expect(id2).toBe(id1); // Should keep same ID
    });

    it('should handle invalid timestamp', () => {
      getSessionId();
      mockLocalStorage.setItem('zzik:session_at', 'invalid');

      const sessionId = getSessionId();
      expect(sessionId).toBeTruthy(); // Should regenerate
    });
  });
});
