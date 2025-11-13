/**
 * Post View Lifecycle Manager
 * 
 * Ensures post_view_end is always emitted when:
 * - User navigates away
 * - Tab becomes hidden
 * - Page unloads
 * 
 * Prevents data loss from incomplete view tracking
 */

import { track } from './client';

let currentPostId: string | null = null;
let startedAt = 0;
let source: 'feed' | 'place' | 'map' = 'feed';

/**
 * Mark post as currently visible
 * Automatically flushes previous post if switching
 */
export function markPostVisible(
  postId: string,
  placeId?: string,
  viewSource: 'feed' | 'place' | 'map' = 'feed'
): void {
  if (currentPostId === postId) return;
  
  // Flush previous post
  flushActive();
  
  // Start new tracking
  currentPostId = postId;
  source = viewSource;
  startedAt = performance.now();
  
  track('post_view_start', {
    post_id: postId,
    place_id: placeId,
    source: viewSource,
  });
}

/**
 * Flush currently active post view
 */
export function flushActive(): void {
  if (!currentPostId) return;
  
  const dwellMs = Math.max(0, Math.round(performance.now() - startedAt));
  
  track('post_view_end', {
    post_id: currentPostId,
    dwell_ms: dwellMs,
  });
  
  // Reset state
  currentPostId = null;
  startedAt = 0;
}

/**
 * Initialize lifecycle listeners
 * Call once in app entry point
 */
export function initFlushOnHide(): void {
  if (typeof window === 'undefined') return;

  const handleHide = () => {
    if (document.visibilityState === 'hidden') {
      flushActive();
    }
  };

  const handleUnload = () => {
    flushActive();
  };

  // Page visibility changes (tab switch, minimize)
  document.addEventListener('visibilitychange', handleHide);
  
  // Page unload (navigation, close)
  window.addEventListener('pagehide', handleUnload);
  window.addEventListener('beforeunload', handleUnload);
}

/**
 * Get current post ID (for debugging)
 */
export function getCurrentPostId(): string | null {
  return currentPostId;
}
