/**
 * Web Vitals Monitoring
 * 
 * Tracks and reports Core Web Vitals metrics:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Threshold values for Web Vitals ratings
 * Based on Google's Web Vitals recommendations
 */
const THRESHOLDS = {
  LCP: {
    good: 2500, // 2.5s
    poor: 4000, // 4s
  },
  FID: {
    good: 100, // 100ms
    poor: 300, // 300ms
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  FCP: {
    good: 1800, // 1.8s
    poor: 3000, // 3s
  },
  TTFB: {
    good: 800, // 800ms
    poor: 1800, // 1.8s
  },
  INP: {
    good: 200, // 200ms
    poor: 500, // 500ms
  },
};

/**
 * Get rating for a metric based on its value
 */
function getRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Format metric for reporting
 */
function formatMetric(metric: Metric): WebVitalsMetric {
  return {
    id: metric.id,
    name: metric.name,
    value: Math.round(metric.value),
    rating: getRating(metric.name, metric.value),
    delta: Math.round(metric.delta),
    navigationType: metric.navigationType,
  };
}

/**
 * Send metric to analytics endpoint
 */
function sendToAnalytics(metric: WebVitalsMetric) {
  // For development, log to console
  if (process.env.NODE_ENV === 'development') {
    const emoji = {
      good: '✅',
      'needs-improvement': '⚠️',
      poor: '❌',
    }[metric.rating];

    console.log(
      `${emoji} [Web Vitals] ${metric.name}:`,
      `${metric.value}ms`,
      `(${metric.rating})`
    );
  }

  // In production, send to your analytics service
  if (process.env.NODE_ENV === 'production') {
    const analyticsEndpoint = '/api/analytics/web-vitals';

    // Use sendBeacon if available for reliable sending even when page is closing
    if (navigator.sendBeacon) {
      const body = JSON.stringify(metric);
      navigator.sendBeacon(analyticsEndpoint, body);
    } else {
      // Fallback to fetch
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
        keepalive: true,
      }).catch((error) => {
        console.error('[Web Vitals] Failed to send metric:', error);
      });
    }
  }
}

/**
 * Report a single metric
 */
export function reportWebVital(metric: Metric) {
  const formattedMetric = formatMetric(metric);
  sendToAnalytics(formattedMetric);
}

/**
 * Initialize Web Vitals monitoring
 * Call this once in your app's entry point
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Monitor all Core Web Vitals
  onCLS(reportWebVital);
  onFID(reportWebVital);
  onLCP(reportWebVital);
  onFCP(reportWebVital);
  onTTFB(reportWebVital);
  onINP(reportWebVital);

  console.log('[Web Vitals] Monitoring initialized');
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation Timing
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,

    // Paint Timing
    firstPaint: paint.find((entry) => entry.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint:
      paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,

    // Resource Counts
    resources: performance.getEntriesByType('resource').length,
  };
}

/**
 * Performance observer for long tasks
 */
export function observeLongTasks(callback: (tasks: PerformanceEntry[]) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      callback(entries);
    });

    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  } catch (error) {
    console.error('[Web Vitals] Long task observer failed:', error);
  }
}

/**
 * Performance observer for layout shifts
 */
export function observeLayoutShifts(callback: (shifts: PerformanceEntry[]) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      callback(entries);
    });

    observer.observe({ entryTypes: ['layout-shift'] });

    return () => observer.disconnect();
  } catch (error) {
    console.error('[Web Vitals] Layout shift observer failed:', error);
  }
}

/**
 * Log performance summary
 */
export function logPerformanceSummary() {
  const metrics = getPerformanceMetrics();
  if (!metrics) return;

  console.group('📊 Performance Summary');
  console.log('DNS Lookup:', `${metrics.dns.toFixed(2)}ms`);
  console.log('TCP Connection:', `${metrics.tcp.toFixed(2)}ms`);
  console.log('TTFB:', `${metrics.ttfb.toFixed(2)}ms`);
  console.log('Download:', `${metrics.download.toFixed(2)}ms`);
  console.log('DOM Interactive:', `${metrics.domInteractive.toFixed(2)}ms`);
  console.log('DOM Complete:', `${metrics.domComplete.toFixed(2)}ms`);
  console.log('Load Complete:', `${metrics.loadComplete.toFixed(2)}ms`);
  console.log('First Paint:', `${metrics.firstPaint.toFixed(2)}ms`);
  console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`);
  console.log('Total Resources:', metrics.resources);
  console.groupEnd();
}
