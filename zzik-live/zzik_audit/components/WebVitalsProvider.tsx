'use client';

import { useEffect } from 'react';
import { initWebVitals, logPerformanceSummary } from '@/lib/web-vitals';

/**
 * Web Vitals Provider
 * 
 * Initializes Core Web Vitals monitoring when the app loads
 * Also logs performance summary in development mode
 */
export function WebVitalsProvider() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals();

    // Log performance summary after page load (development only)
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          logPerformanceSummary();
        }, 0);
      });
    }
  }, []);

  return null;
}
