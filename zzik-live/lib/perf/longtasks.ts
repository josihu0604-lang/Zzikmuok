/**
 * Long Task Monitoring
 * 
 * Tracks JavaScript execution blocking main thread for extended periods
 * Uses PerformanceObserver API to monitor 'longtask' entries
 * 
 * Helps identify:
 * - Heavy JavaScript operations
 * - Frame drops and janky animations
 * - Poor user experience during interactions
 * 
 * Sampling: Default 10% to reduce event volume
 * Threshold: Default 50ms (any task blocking >50ms is considered "long")
 */

import { track } from '@/lib/analytics/client';

/**
 * Initialize long task monitoring
 * 
 * @param threshold - Minimum duration (ms) to report (default: 50ms)
 * @param sampleRate - Percentage of sessions to monitor (default: 0.1 = 10%)
 */
export function initLongTasks(threshold = 50, sampleRate = 0.1): void {
  if (typeof window === 'undefined') return;
  
  // Check browser support
  if (!('PerformanceObserver' in window)) {
    console.warn('[LongTasks] PerformanceObserver not supported');
    return;
  }

  // Apply sampling rate
  if (Math.random() > sampleRate) {
    console.log(`[LongTasks] Skipped (sampled out, rate=${sampleRate})`);
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration >= threshold) {
          // Report long task via generic error event
          // Using 'error' event type with specific code for filtering
          track('error', {
            code: 'long_task',
            surface: 'performance',
            retryable: false,
            message: `Long task detected: ${Math.round(entry.duration)}ms`,
          });
        }
      }
    });

    // Observe long tasks
    observer.observe({ type: 'longtask', buffered: true });

    console.log(`[LongTasks] Monitoring enabled (threshold=${threshold}ms, sample=${sampleRate})`);
  } catch (err) {
    console.warn('[LongTasks] Failed to initialize:', err);
  }
}

/**
 * Alternative: Track frame drops using requestAnimationFrame
 * More universal browser support but less precise
 * 
 * Usage:
 * ```typescript
 * initFrameDropMonitoring(60); // Track if FPS drops below 60
 * ```
 */
export function initFrameDropMonitoring(targetFPS = 60): void {
  if (typeof window === 'undefined') return;

  let lastTime = performance.now();
  let frameCount = 0;
  const frameDuration = 1000 / targetFPS;

  function checkFrameRate() {
    const now = performance.now();
    frameCount++;

    // Check every second
    if (now - lastTime >= 1000) {
      const actualFPS = frameCount;
      
      if (actualFPS < targetFPS * 0.8) {
        // Report if FPS drops below 80% of target
        track('error', {
          code: 'frame_drop',
          surface: 'performance',
          retryable: false,
          message: `Low FPS: ${actualFPS} (target: ${targetFPS})`,
        });
      }

      frameCount = 0;
      lastTime = now;
    }

    requestAnimationFrame(checkFrameRate);
  }

  requestAnimationFrame(checkFrameRate);
  console.log(`[FrameDrop] Monitoring enabled (target=${targetFPS}fps)`);
}
