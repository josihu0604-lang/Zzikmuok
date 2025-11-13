/**
 * Web Vitals Integration
 * 
 * Tracks Core Web Vitals (CLS, LCP, INP) and sends to analytics
 * Requires: npm i web-vitals
 */

import { onCLS, onLCP, onINP, onFCP, onTTFB, type Metric } from 'web-vitals';
import { track } from '@/lib/analytics/client';

/**
 * Initialize Web Vitals tracking
 * Call once in app entry point (app/layout.tsx)
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined') return;

  const sendMetric = (metric: Metric) => {
    track('perf_web_vitals', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
    });
  };

  // Core Web Vitals (Google)
  onCLS(sendMetric);  // Cumulative Layout Shift
  onLCP(sendMetric);  // Largest Contentful Paint
  onINP(sendMetric);  // Interaction to Next Paint

  // Additional metrics
  onFCP(sendMetric);  // First Contentful Paint
  onTTFB(sendMetric); // Time to First Byte
}

/**
 * Report custom performance metric
 */
export function reportMetric(name: string, value: number): void {
  track('perf_web_vitals', {
    name,
    value,
    id: `${name}-${Date.now()}`,
  });
}
