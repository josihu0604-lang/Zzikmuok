/**
 * Experiment Registry v2 - Enhanced with Guardrails
 * 
 * Single source of truth for all A/B experiments
 * Includes hypothesis, metrics, guardrails, and power analysis
 * 
 * Schema Evolution:
 * v1: Basic experiment config (key, variants, traffic)
 * v2: Added guardrails, success criteria, power analysis
 */

import type { ExperimentConfig } from './useExperiment';

/**
 * Guardrail Definition
 * Protects against negative side effects
 */
export type Guardrail = {
  metric: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  threshold: number;
  unit?: string;
  description: string;
};

/**
 * Success Criteria
 * Defines what "winning" means for this experiment
 */
export type SuccessCriteria = {
  primaryMetric: string;
  minimumDetectableEffect: number;  // e.g., 0.05 = 5% lift
  statisticalPower: number;          // e.g., 0.8 = 80%
  significance: number;              // e.g., 0.05 = 95% confidence
  minimumSampleSize?: number;
};

/**
 * Enhanced Experiment Configuration
 */
export type EnhancedExperimentConfig = ExperimentConfig & {
  hypothesis: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  guardrails: Guardrail[];
  successCriteria: SuccessCriteria;
  owner: string;
  startDate: string;
  endDate?: string;
  state: 'draft' | 'active' | 'paused' | 'concluded' | 'rolled_out';
};

/**
 * All Enhanced Experiments
 */
export const ENHANCED_EXPERIMENTS: Record<string, EnhancedExperimentConfig> = {
  /**
   * Experiment A: Feed Caption Lines
   * Tests impact of 2-line vs 1-line captions on engagement
   */
  feed_caption_lines: {
    // Basic config (from v1)
    key: 'feed_caption_lines',
    variants: [
      { name: '1l', weight: 0.5 },  // Control: 1 line
      { name: '2l', weight: 0.5 },  // Treatment: 2 lines
    ],
    traffic: 1.0,  // 100% of users

    // Enhanced metadata (v2)
    hypothesis: '2-line captions increase engagement by providing more context without hurting readability',
    primaryMetric: 'feed_dwell_p50',  // Median dwell time
    secondaryMetrics: [
      'like_toggle_rate',
      'save_toggle_rate',
      'post_view_completion_rate',
    ],
    
    // Guardrails (prevent negative side effects)
    guardrails: [
      {
        metric: 'lcp_p75_ms',
        operator: '<=',
        threshold: 2500,
        unit: 'ms',
        description: 'LCP should not exceed 2.5s (Google Good threshold)',
      },
      {
        metric: 'ingest_success_rate',
        operator: '>=',
        threshold: 0.97,
        unit: 'ratio',
        description: 'Analytics ingestion must stay above 97%',
      },
      {
        metric: 'error_rate',
        operator: '<=',
        threshold: 0.003,
        unit: 'ratio',
        description: 'Error rate must stay below 0.3%',
      },
    ],
    
    // Success criteria
    successCriteria: {
      primaryMetric: 'feed_dwell_p50',
      minimumDetectableEffect: 0.10,  // 10% lift
      statisticalPower: 0.8,
      significance: 0.05,
      minimumSampleSize: 10000,  // per variant
    },
    
    // Administrative
    owner: 'Product Team',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    state: 'active',
  },

  /**
   * Experiment B: Place Sheet Default Sort
   * Tests impact of default sort order on conversion
   */
  place_sheet_default_sort: {
    // Basic config
    key: 'place_sheet_default_sort',
    variants: [
      { name: 'recent', weight: 0.5 },  // Control: Recent first
      { name: 'top', weight: 0.5 },     // Treatment: Top rated first
    ],
    traffic: 1.0,

    // Enhanced metadata
    hypothesis: 'Showing top-rated posts first increases place sheet → post view conversion',
    primaryMetric: 'sheet_to_view_cr',  // Conversion rate
    secondaryMetrics: [
      'sheet_dwell_time',
      'posts_viewed_per_sheet',
      'place_save_rate',
    ],
    
    // Guardrails
    guardrails: [
      {
        metric: 'sheet_open_rate',
        operator: '>=',
        threshold: 0.55,
        unit: 'ratio',
        description: 'Map → sheet open rate must stay above 55%',
      },
      {
        metric: 'session_duration_sec',
        operator: '>=',
        threshold: 120,
        unit: 'seconds',
        description: 'Average session duration must stay above 2 minutes',
      },
    ],
    
    // Success criteria
    successCriteria: {
      primaryMetric: 'sheet_to_view_cr',
      minimumDetectableEffect: 0.05,  // 5% lift
      statisticalPower: 0.8,
      significance: 0.05,
      minimumSampleSize: 15000,
    },
    
    // Administrative
    owner: 'Product Team',
    startDate: '2025-01-20',
    endDate: '2025-02-20',
    state: 'active',
  },

  /**
   * Experiment C: Map Pin Size
   * Tests impact of larger pins on discoverability
   */
  map_pin_size: {
    key: 'map_pin_size',
    variants: [
      { name: 'small', weight: 0.5 },   // Control: 24px
      { name: 'large', weight: 0.5 },   // Treatment: 32px
    ],
    traffic: 0.5,  // 50% rollout (pilot)

    hypothesis: 'Larger pins improve discoverability without increasing clutter',
    primaryMetric: 'pin_tap_rate',
    secondaryMetrics: [
      'map_zoom_level_avg',
      'pins_tapped_per_session',
    ],
    
    guardrails: [
      {
        metric: 'map_fps_p50',
        operator: '>=',
        threshold: 55,
        unit: 'fps',
        description: 'Map frame rate must stay above 55 FPS',
      },
    ],
    
    successCriteria: {
      primaryMetric: 'pin_tap_rate',
      minimumDetectableEffect: 0.08,
      statisticalPower: 0.8,
      significance: 0.05,
      minimumSampleSize: 8000,
    },
    
    owner: 'Map Team',
    startDate: '2025-01-25',
    endDate: '2025-02-10',
    state: 'active',
  },
};

/**
 * Get active experiments
 */
export function getActiveExperiments(): EnhancedExperimentConfig[] {
  return Object.values(ENHANCED_EXPERIMENTS).filter(
    (exp) => exp.state === 'active'
  );
}

/**
 * Get experiment by key
 */
export function getExperimentByKey(
  key: string
): EnhancedExperimentConfig | undefined {
  return ENHANCED_EXPERIMENTS[key];
}

/**
 * Check if guardrails are violated
 * 
 * @param experimentKey - Experiment to check
 * @param metrics - Current metric values
 * @returns List of violated guardrails
 * 
 * @example
 * ```typescript
 * const violations = checkGuardrails('feed_caption_lines', {
 *   lcp_p75_ms: 2800,  // Violation!
 *   ingest_success_rate: 0.98,  // OK
 *   error_rate: 0.002,  // OK
 * });
 * 
 * if (violations.length > 0) {
 *   pauseExperiment('feed_caption_lines');
 *   alert(violations);
 * }
 * ```
 */
export function checkGuardrails(
  experimentKey: string,
  metrics: Record<string, number>
): Guardrail[] {
  const experiment = ENHANCED_EXPERIMENTS[experimentKey];
  if (!experiment) return [];

  return experiment.guardrails.filter((guardrail) => {
    const value = metrics[guardrail.metric];
    if (value === undefined) return false;

    switch (guardrail.operator) {
      case '>':
        return !(value > guardrail.threshold);
      case '>=':
        return !(value >= guardrail.threshold);
      case '<':
        return !(value < guardrail.threshold);
      case '<=':
        return !(value <= guardrail.threshold);
      case '==':
        return !(value === guardrail.threshold);
      case '!=':
        return !(value !== guardrail.threshold);
      default:
        return false;
    }
  });
}

/**
 * Calculate required sample size
 * 
 * Uses simplified formula:
 * n = 2 * (Z_α/2 + Z_β)² * σ² / δ²
 * 
 * Where:
 * - Z_α/2: Critical value for significance (e.g., 1.96 for 95% confidence)
 * - Z_β: Critical value for power (e.g., 0.84 for 80% power)
 * - σ: Standard deviation (assumed = mean for count metrics)
 * - δ: Minimum detectable effect
 */
export function calculateSampleSize(
  baselineRate: number,
  mde: number,
  power: number = 0.8,
  significance: number = 0.05
): number {
  // Z-scores (approximate)
  const zAlpha = significance === 0.05 ? 1.96 : 2.58; // 95% or 99%
  const zBeta = power === 0.8 ? 0.84 : 1.28; // 80% or 90%
  
  // Standard deviation for binomial (proportion)
  const sigma = Math.sqrt(baselineRate * (1 - baselineRate));
  
  // Effect size
  const delta = mde * baselineRate;
  
  // Sample size per variant
  const n = (2 * Math.pow(zAlpha + zBeta, 2) * Math.pow(sigma, 2)) / Math.pow(delta, 2);
  
  return Math.ceil(n);
}

/**
 * Export as JSON for external tools
 * 
 * Usage:
 * ```bash
 * node -e "console.log(JSON.stringify(require('./registry.v2').ENHANCED_EXPERIMENTS, null, 2))" > experiments.json
 * ```
 */
export function exportToJSON(): string {
  return JSON.stringify(ENHANCED_EXPERIMENTS, null, 2);
}
