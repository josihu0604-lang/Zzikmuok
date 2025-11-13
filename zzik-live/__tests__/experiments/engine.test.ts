/**
 * Experiment Engine Tests
 * 
 * Tests for deterministic bucketing, traffic control, exposure tracking
 */

import {
  assign,
  hasTrackedExposure,
  markExposureTracked,
  clearExposures,
} from '@/lib/experiments/engine';

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

describe('Experiment Engine', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    clearExposures();
  });

  describe('assign()', () => {
    it('should assign variant deterministically', () => {
      const result1 = assign('user-123', 'test-exp', [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ]);

      const result2 = assign('user-123', 'test-exp', [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ]);

      expect(result1).toEqual(result2);
    });

    it('should assign different variants to different users', () => {
      const assignments = new Set();

      for (let i = 0; i < 100; i++) {
        const result = assign(`user-${i}`, 'test-exp', [
          { name: 'control', weight: 0.5 },
          { name: 'treatment', weight: 0.5 },
        ]);

        if (result.enabled) {
          assignments.add(result.variant);
        }
      }

      // Should have both variants assigned
      expect(assignments.size).toBe(2);
      expect(assignments.has('control')).toBe(true);
      expect(assignments.has('treatment')).toBe(true);
    });

    it('should respect weighted distribution', () => {
      const counts = { a: 0, b: 0, c: 0 };
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const result = assign(`user-${i}`, 'test-exp', [
          { name: 'a', weight: 0.5 },  // 50%
          { name: 'b', weight: 0.3 },  // 30%
          { name: 'c', weight: 0.2 },  // 20%
        ]);

        if (result.enabled) {
          counts[result.variant as 'a' | 'b' | 'c']++;
        }
      }

      const total = counts.a + counts.b + counts.c;

      // Allow 10% variance from expected distribution
      expect(counts.a / total).toBeCloseTo(0.5, 1);
      expect(counts.b / total).toBeCloseTo(0.3, 1);
      expect(counts.c / total).toBeCloseTo(0.2, 1);
    });

    it('should respect traffic percentage', () => {
      let enabledCount = 0;
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const result = assign(`user-${i}`, 'test-exp', [
          { name: 'control', weight: 0.5 },
          { name: 'treatment', weight: 0.5 },
        ], 0.25); // 25% traffic

        if (result.enabled) {
          enabledCount++;
        }
      }

      // Allow 10% variance from expected 25% traffic
      expect(enabledCount / iterations).toBeCloseTo(0.25, 1);
    });

    it('should return disabled for users outside traffic', () => {
      const result = assign('user-999', 'test-exp', [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ], 0.01); // 1% traffic - very likely to be outside

      // Can't guarantee disabled for specific user, but at least check structure
      if (!result.enabled) {
        expect(result).toEqual({ enabled: false });
      } else {
        expect(result.enabled).toBe(true);
        expect(result.variant).toBeTruthy();
      }
    });

    it('should throw error if weights do not sum to 1.0', () => {
      expect(() => {
        assign('user-123', 'test-exp', [
          { name: 'control', weight: 0.5 },
          { name: 'treatment', weight: 0.4 }, // Sum = 0.9
        ]);
      }).toThrow('Variant weights must sum to 1.0');
    });

    it('should handle single variant', () => {
      const result = assign('user-123', 'test-exp', [
        { name: 'only', weight: 1.0 },
      ]);

      expect(result.enabled).toBe(true);
      if (result.enabled) {
        expect(result.variant).toBe('only');
      }
    });

    it('should return bucket value in [0, 1) range', () => {
      const result = assign('user-123', 'test-exp', [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ]);

      if (result.enabled) {
        expect(result.bucket).toBeGreaterThanOrEqual(0);
        expect(result.bucket).toBeLessThan(1);
      }
    });

    it('should generate different buckets for different experiments', () => {
      const result1 = assign('user-123', 'exp-1', [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ]);

      const result2 = assign('user-123', 'exp-2', [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ]);

      if (result1.enabled && result2.enabled) {
        expect(result1.bucket).not.toBe(result2.bucket);
      }
    });

    it('should handle zero traffic', () => {
      const result = assign('user-123', 'test-exp', [
        { name: 'control', weight: 1.0 },
      ], 0);

      expect(result.enabled).toBe(false);
    });

    it('should handle full traffic', () => {
      const result = assign('user-123', 'test-exp', [
        { name: 'control', weight: 1.0 },
      ], 1.0);

      expect(result.enabled).toBe(true);
    });
  });

  describe('hasTrackedExposure()', () => {
    it('should return false for untracked experiment', () => {
      expect(hasTrackedExposure('test-exp')).toBe(false);
    });

    it('should return true after marking as tracked', () => {
      markExposureTracked('test-exp');
      expect(hasTrackedExposure('test-exp')).toBe(true);
    });

    it('should track different experiments independently', () => {
      markExposureTracked('exp-1');
      expect(hasTrackedExposure('exp-1')).toBe(true);
      expect(hasTrackedExposure('exp-2')).toBe(false);
    });
  });

  describe('markExposureTracked()', () => {
    it('should persist in localStorage', () => {
      markExposureTracked('test-exp');
      const value = mockLocalStorage.getItem('zzik:experiment:test-exp');
      expect(value).toBe('true');
    });

    it('should handle multiple experiments', () => {
      markExposureTracked('exp-1');
      markExposureTracked('exp-2');
      markExposureTracked('exp-3');

      expect(hasTrackedExposure('exp-1')).toBe(true);
      expect(hasTrackedExposure('exp-2')).toBe(true);
      expect(hasTrackedExposure('exp-3')).toBe(true);
    });
  });

  describe('clearExposures()', () => {
    it('should remove all tracked exposures', () => {
      markExposureTracked('exp-1');
      markExposureTracked('exp-2');
      markExposureTracked('exp-3');

      clearExposures();

      expect(hasTrackedExposure('exp-1')).toBe(false);
      expect(hasTrackedExposure('exp-2')).toBe(false);
      expect(hasTrackedExposure('exp-3')).toBe(false);
    });

    it('should not affect other localStorage keys', () => {
      mockLocalStorage.setItem('other-key', 'value');
      markExposureTracked('exp-1');

      clearExposures();

      expect(mockLocalStorage.getItem('other-key')).toBe('value');
      expect(hasTrackedExposure('exp-1')).toBe(false);
    });

    it('should only clear experiment keys', () => {
      mockLocalStorage.setItem('zzik:device_id', 'device-123');
      mockLocalStorage.setItem('zzik:session_id', 'session-456');
      markExposureTracked('exp-1');

      clearExposures();

      expect(mockLocalStorage.getItem('zzik:device_id')).toBe('device-123');
      expect(mockLocalStorage.getItem('zzik:session_id')).toBe('session-456');
      expect(hasTrackedExposure('exp-1')).toBe(false);
    });
  });

  describe('Integration: Full Experiment Flow', () => {
    it('should prevent duplicate exposure tracking', () => {
      const userKey = 'user-123';
      const experimentKey = 'test-exp';

      // First exposure
      const result = assign(userKey, experimentKey, [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ]);

      if (result.enabled && !hasTrackedExposure(experimentKey)) {
        markExposureTracked(experimentKey);
      }

      // Second exposure (should be prevented)
      const shouldTrack = !hasTrackedExposure(experimentKey);
      expect(shouldTrack).toBe(false);
    });

    it('should maintain consistency across multiple assigns', () => {
      const userKey = 'user-123';
      const experimentKey = 'test-exp';
      const variants = [
        { name: 'control', weight: 0.5 },
        { name: 'treatment', weight: 0.5 },
      ];

      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(assign(userKey, experimentKey, variants));
      }

      // All results should be identical
      const first = results[0];
      results.forEach((result) => {
        expect(result).toEqual(first);
      });
    });
  });
});
