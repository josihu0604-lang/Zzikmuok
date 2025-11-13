/**
 * useExperiment Hook
 * 
 * Deterministic A/B test assignment with exposure tracking
 * 
 * Features:
 * - Consistent assignment per user/experiment
 * - Single exposure event per session
 * - Automatic context snapshot
 */

'use client';

import { useMemo, useEffect } from 'react';
import { assign } from './engine';
import { track } from '@/lib/analytics/client';
import { getDeviceId, getSessionId } from '@/lib/analytics/ids';

export type ExperimentConfig = {
  key: string;
  variants: Array<{ name: string; weight: number }>;
  traffic: number;
};

/**
 * Get experiment variant for current user
 * 
 * @param config Experiment configuration
 * @returns Assigned variant name or null if not in traffic
 * 
 * @example
 * ```tsx
 * const variant = useExperiment({
 *   key: 'feed_caption_lines',
 *   variants: [
 *     { name: '1l', weight: 0.5 },
 *     { name: '2l', weight: 0.5 },
 *   ],
 *   traffic: 1.0,
 * });
 * 
 * const maxLines = variant === '2l' ? 2 : 1;
 * ```
 */
export function useExperiment(config: ExperimentConfig): string | null {
  const deviceId = getDeviceId();
  const sessionId = getSessionId();

  // Deterministic assignment
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

    // Also persist to localStorage for context snapshot
    localStorage.setItem(`zzik:experiment:${config.key}`, assignment.variant);

    // Send exposure event
    track('exp_exposure', {
      exp_key: config.key,
      variant: assignment.variant,
    });
  }, [assignment, config.key, sessionId]);

  return assignment.enabled ? assignment.variant : null;
}

/**
 * Get all active experiments for context snapshot
 * (Called internally by analytics client)
 */
export function getActiveExperiments(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const experiments: Record<string, string> = {};

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('zzik:experiment:')) {
      const expKey = key.replace('zzik:experiment:', '');
      const variant = localStorage.getItem(key);
      if (variant) {
        experiments[expKey] = variant;
      }
    }
  });

  return experiments;
}

/**
 * Clear experiment assignments (for testing)
 */
export function clearExperiments(): void {
  if (typeof window === 'undefined') return;

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('zzik:experiment:')) {
      localStorage.removeItem(key);
    }
  });

  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('zzik:exp:seen:')) {
      sessionStorage.removeItem(key);
    }
  });
}
