/**
 * A/B Experiment Engine
 * 
 * Features:
 * - Deterministic bucketing (consistent assignment per user)
 * - Traffic percentage control
 * - Weighted variant distribution
 * - Exposure tracking
 */

import murmurhash from 'murmurhash-js';

export type Variant = {
  name: string;
  weight: number; // 0.0 - 1.0, sum must equal 1.0
};

export type AssignmentResult =
  | { enabled: false }
  | { enabled: true; variant: string; bucket: number };

/**
 * Assign user to experiment variant
 * 
 * @param userKey Unique user identifier (device_id or user_id)
 * @param experimentKey Experiment identifier
 * @param variants Array of variant configs (weights must sum to 1.0)
 * @param traffic Percentage of users to include (0.0 - 1.0)
 * @returns Assignment result with variant and bucket
 * 
 * @example
 * ```ts
 * const result = assign('user-123', 'place_sheet_auto_open', [
 *   { name: 'on', weight: 0.5 },
 *   { name: 'off', weight: 0.5 },
 * ], 1.0);
 * 
 * if (result.enabled) {
 *   console.log(`Assigned to: ${result.variant}`);
 * }
 * ```
 */
export function assign(
  userKey: string,
  experimentKey: string,
  variants: Variant[],
  traffic = 1.0
): AssignmentResult {
  // Validate weights sum to 1.0
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    throw new Error(
      `Variant weights must sum to 1.0 (got ${totalWeight})`
    );
  }

  // Hash user+experiment key to [0, 1) range
  const hash = murmurhash.murmur3(userKey + ':' + experimentKey);
  const bucket = hash / Math.pow(2, 32); // Normalize to [0, 1)

  // Check if user is in traffic percentage
  if (bucket > traffic) {
    return { enabled: false };
  }

  // Assign variant based on weighted distribution
  let accumulated = 0;
  for (const variant of variants) {
    accumulated += variant.weight;
    if (bucket <= accumulated) {
      return {
        enabled: true,
        variant: variant.name,
        bucket,
      };
    }
  }

  // Fallback to last variant (should never happen if weights sum to 1.0)
  return {
    enabled: true,
    variant: variants[variants.length - 1].name,
    bucket,
  };
}

/**
 * Check if exposure has been tracked (to avoid duplicate events)
 */
export function hasTrackedExposure(experimentKey: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const key = `zzik:experiment:${experimentKey}`;
  return localStorage.getItem(key) === 'true';
}

/**
 * Mark exposure as tracked
 */
export function markExposureTracked(experimentKey: string): void {
  if (typeof window === 'undefined') return;
  
  const key = `zzik:experiment:${experimentKey}`;
  localStorage.setItem(key, 'true');
}

/**
 * Clear experiment exposure tracking (for testing)
 */
export function clearExposures(): void {
  if (typeof window === 'undefined') return;
  
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('zzik:experiment:')) {
      localStorage.removeItem(key);
    }
  });
}
