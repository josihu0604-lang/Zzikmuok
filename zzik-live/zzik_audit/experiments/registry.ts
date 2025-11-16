/**
 * Experiment Registry
 * 
 * Centralized configuration for all A/B experiments
 * Single source of truth for variant definitions and traffic allocation
 * 
 * Usage:
 * ```tsx
 * import { EXPERIMENTS } from '@/lib/experiments/registry';
 * const variant = useExperiment(EXPERIMENTS.feed_caption_lines);
 * ```
 */

import type { ExperimentConfig } from './useExperiment';

/**
 * All active experiments
 * 
 * Naming convention: surface_feature_description
 * Examples: feed_caption_lines, map_pin_size, place_sheet_layout
 */
export const EXPERIMENTS = {
  /**
   * Feed Caption Lines Test
   * 
   * Hypothesis: 2-line captions increase engagement vs 1-line
   * Primary Metric: Post view dwell time (post_view_end.dwell_ms)
   * Secondary Metrics: Like rate, Save rate
   * Guardrails: Error rate, Session duration
   * 
   * Traffic: 100% (all users)
   * Duration: 2025-01-15 to 2025-02-15
   * Owner: Product Team
   */
  feed_caption_lines: {
    key: 'feed_caption_lines',
    variants: [
      { name: '1l', weight: 0.5 },  // Control: 1 line
      { name: '2l', weight: 0.5 },  // Treatment: 2 lines
    ],
    traffic: 1.0,
  } as ExperimentConfig,

  /**
   * Map Pin Clustering Test
   * 
   * Hypothesis: Clustering reduces visual clutter and improves pin tap rate
   * Primary Metric: Pin tap rate (pin_tap / map_view)
   * Secondary Metrics: Place sheet open rate
   * Guardrails: Map load time (perf_web_vitals.LCP)
   * 
   * Traffic: 50% (pilot)
   * Duration: 2025-01-20 to 2025-02-05
   * Owner: Map Team
   */
  map_pin_clustering: {
    key: 'map_pin_clustering',
    variants: [
      { name: 'off', weight: 0.5 },     // Control: No clustering
      { name: 'on', weight: 0.5 },      // Treatment: Clustering enabled
    ],
    traffic: 0.5,
  } as ExperimentConfig,

  /**
   * Place Sheet Initial Stage Test
   * 
   * Hypothesis: Starting at 'half' stage increases post view rate vs 'peek'
   * Primary Metric: Post view rate (post_view_start / place_sheet_open)
   * Secondary Metrics: Sheet stage progression (peek → half → full)
   * Guardrails: Bounce rate
   * 
   * Traffic: 100%
   * Duration: 2025-01-18 to 2025-02-10
   * Owner: UX Team
   */
  place_sheet_initial_stage: {
    key: 'place_sheet_initial_stage',
    variants: [
      { name: 'peek', weight: 0.33 },   // Control: Start at peek
      { name: 'half', weight: 0.33 },   // Treatment A: Start at half
      { name: 'full', weight: 0.34 },   // Treatment B: Start at full
    ],
    traffic: 1.0,
  } as ExperimentConfig,

  /**
   * Feed Load Pagination Test
   * 
   * Hypothesis: 20 posts per page reduces load time vs 50
   * Primary Metric: FCP (First Contentful Paint)
   * Secondary Metrics: Scroll depth, Feed item visibility
   * Guardrails: Session duration, Bounce rate
   * 
   * Traffic: 30% (pilot)
   * Duration: 2025-01-22 to 2025-02-08
   * Owner: Performance Team
   */
  feed_load_pagination: {
    key: 'feed_load_pagination',
    variants: [
      { name: '50', weight: 0.5 },      // Control: 50 posts
      { name: '20', weight: 0.5 },      // Treatment: 20 posts
    ],
    traffic: 0.3,
  } as ExperimentConfig,

  /**
   * Error Retry Button Test
   * 
   * Hypothesis: Explicit retry button reduces user drop-off on errors
   * Primary Metric: Recovery rate (successful action after error)
   * Secondary Metrics: Error event count
   * Guardrails: User frustration (consecutive error count)
   * 
   * Traffic: 50% (pilot)
   * Duration: 2025-01-25 to 2025-02-12
   * Owner: Reliability Team
   */
  error_retry_button: {
    key: 'error_retry_button',
    variants: [
      { name: 'auto', weight: 0.5 },    // Control: Auto-retry
      { name: 'manual', weight: 0.5 },  // Treatment: Manual button
    ],
    traffic: 0.5,
  } as ExperimentConfig,
} as const;

/**
 * Get experiment config by key
 * Type-safe accessor with autocomplete
 */
export function getExperiment(key: keyof typeof EXPERIMENTS): ExperimentConfig {
  return EXPERIMENTS[key];
}

/**
 * List all active experiments
 * Useful for debugging and admin dashboards
 */
export function listActiveExperiments(): ExperimentConfig[] {
  return Object.values(EXPERIMENTS);
}

/**
 * Experiment Lifecycle States
 * 
 * DRAFT: Not yet launched, config in progress
 * ACTIVE: Currently running and collecting data
 * PAUSED: Temporarily stopped (e.g., due to guardrail violations)
 * CONCLUDED: Finished, decision made
 * ROLLED_OUT: Winner variant deployed to 100%
 */
export enum ExperimentState {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CONCLUDED = 'CONCLUDED',
  ROLLED_OUT = 'ROLLED_OUT',
}

/**
 * Experiment metadata for tracking
 * Not used in runtime bucketing, only for documentation
 */
export type ExperimentMeta = {
  key: string;
  state: ExperimentState;
  owner: string;
  startDate: string;
  endDate: string;
  hypothesis: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  guardrails: string[];
  sampleSize?: number;
  powerAnalysis?: {
    minimumDetectableEffect: number;  // e.g., 0.05 = 5%
    statisticalPower: number;          // e.g., 0.8 = 80%
    significance: number;              // e.g., 0.05 = 95% confidence
  };
};

/**
 * Full experiment metadata (for documentation and dashboards)
 * Extend this as experiments are added
 */
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
  map_pin_clustering: {
    key: 'map_pin_clustering',
    state: ExperimentState.ACTIVE,
    owner: 'Map Team',
    startDate: '2025-01-20',
    endDate: '2025-02-05',
    hypothesis: 'Pin clustering reduces clutter and improves discoverability',
    primaryMetric: 'pin_tap / screen_view (map)',
    secondaryMetrics: ['place_sheet_open rate', 'zoom level distribution'],
    guardrails: ['perf_web_vitals.LCP < 2500ms'],
  },
  place_sheet_initial_stage: {
    key: 'place_sheet_initial_stage',
    state: ExperimentState.ACTIVE,
    owner: 'UX Team',
    startDate: '2025-01-18',
    endDate: '2025-02-10',
    hypothesis: 'Starting at half stage increases content visibility and engagement',
    primaryMetric: 'post_view_start / place_sheet_open',
    secondaryMetrics: ['stage progression rates', 'sheet dwell time'],
    guardrails: ['bounce_rate < baseline + 5%'],
  },
  feed_load_pagination: {
    key: 'feed_load_pagination',
    state: ExperimentState.ACTIVE,
    owner: 'Performance Team',
    startDate: '2025-01-22',
    endDate: '2025-02-08',
    hypothesis: 'Smaller page size improves initial load time without hurting engagement',
    primaryMetric: 'perf_web_vitals.FCP',
    secondaryMetrics: ['scroll_depth', 'feed_item_visible count'],
    guardrails: ['session_duration > baseline - 5%', 'bounce_rate < baseline + 3%'],
  },
  error_retry_button: {
    key: 'error_retry_button',
    state: ExperimentState.ACTIVE,
    owner: 'Reliability Team',
    startDate: '2025-01-25',
    endDate: '2025-02-12',
    hypothesis: 'Manual retry gives users more control and reduces frustration',
    primaryMetric: 'recovery_rate (successful action after error)',
    secondaryMetrics: ['error count per session', 'user feedback sentiment'],
    guardrails: ['consecutive_errors < 3 per session'],
  },
};
