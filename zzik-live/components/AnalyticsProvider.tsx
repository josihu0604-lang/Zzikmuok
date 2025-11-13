'use client';

import { useEffect } from 'react';
import { configure, setConsent } from '@/lib/analytics/client';
import { initFlushOnHide } from '@/lib/analytics/flushOnHide';
import { initWebVitals } from '@/lib/perf/vitals';
import { initLongTasks } from '@/lib/perf/longtasks';

/**
 * Analytics Provider
 * 
 * Initializes all analytics and performance tracking systems
 * Must be mounted once at app entry point (layout.tsx)
 * 
 * Features:
 * - Analytics SDK initialization
 * - Post view lifecycle safety (flush on hide)
 * - Web Vitals tracking (CLS, LCP, INP, FCP, TTFB)
 * - Long task monitoring (sampled at 10%)
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Configure analytics SDK
    configure({
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
      build: 'web',
    });

    // Set default consent (can be changed via PrivacyCard)
    setConsent(true);

    // Initialize post view lifecycle manager
    // Ensures post_view_end is always sent even if tab closes
    initFlushOnHide();

    // Initialize Web Vitals tracking
    // Tracks Core Web Vitals: CLS, LCP, INP, FCP, TTFB
    initWebVitals();

    // Initialize Long Task monitoring
    // 10% sample rate, 50ms threshold
    initLongTasks(50, 0.1);

    // Log initialization
    console.log('[Analytics] All systems initialized');
  }, []);

  return <>{children}</>;
}
