/**
 * Feature Flags for gradual rollout
 * 
 * Usage:
 * if (FEATURE_FLAGS.FEED_VERTICAL) {
 *   // New vertical feed implementation
 * }
 */

export const FEATURE_FLAGS = {
  // Phase 2 Features
  FEED_VERTICAL: true,         // #10: Vertical fullscreen feed
  MAP_CLUSTER: true,            // #8: Map clustering with Supercluster
  METRICS_SIMPLIFIED: true,     // #6: Unified metric system
  CONTROL_CLARITY: true,        // #7: IconButton with aria-pressed
  VISUAL_TOKENS: true,          // #9: Design token system
  PERFORMANCE_OPT: true,        // #11: Blur minimization, LQIP
  
  // Experimental
  AUTO_PLAY_CELLULAR: false,    // Auto-play video on cellular data
  COMMENTS_MODAL: true,         // Dynamic import for comments
  PLACE_SHEET_AUTO_OPEN: false, // Auto-open place sheet on map load
  
  // AB Test Groups
  FEED_CAPTION_LINES: 2,        // 1 or 2 lines
  PLACE_SORT_DEFAULT: 'recent', // 'recent' or 'popular'
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if feature is enabled
 * @param flag Feature flag name
 * @returns boolean
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag] === true;
}

/**
 * Get feature flag value
 * @param flag Feature flag name
 * @returns any
 */
export function getFeatureValue<T extends FeatureFlag>(flag: T): typeof FEATURE_FLAGS[T] {
  return FEATURE_FLAGS[flag];
}
