/**
 * Analytics Client SDK
 * 
 * Features:
 * - Offline queue with localStorage persistence
 * - Batch sending (max 50 events)
 * - Auto-flush on visibility change & online event
 * - Consent-aware tracking
 */

import type { EventName, EventPayload, EventProps, BuildPlatform } from './schema';
import { getDeviceId, getSessionId } from './ids';

type QueueItem = EventPayload;

const KEY_QUEUE = 'zzik:analytics:queue';
const KEY_CONSENT = 'zzik:consent:analytics';
const ENDPOINT = '/api/analytics';
const MAX_BATCH_SIZE = 20; // Spec requirement: 20 events trigger auto-flush

let appVersion = '0.0.0';
let build: BuildPlatform = 'web';
let userId: string | undefined;

/**
 * Load queue from localStorage
 */
function loadQueue(): QueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY_QUEUE) ?? '[]');
  } catch {
    return [];
  }
}

/**
 * Save queue to localStorage
 */
function saveQueue(queue: QueueItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_QUEUE, JSON.stringify(queue));
}

/**
 * Check if analytics consent is granted
 */
function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEY_CONSENT) === 'true';
}

/**
 * Set analytics consent
 */
export function setConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_CONSENT, granted ? 'true' : 'false');
  
  if (granted) {
    // Flush queued events
    flush();
  } else {
    // Clear queue
    saveQueue([]);
  }
}

/**
 * Identify user (optional)
 */
export function identify(uid?: string): void {
  userId = uid;
}

/**
 * Configure analytics
 */
export function configure(opts: { appVersion: string; build?: BuildPlatform }): void {
  appVersion = opts.appVersion;
  if (opts.build) build = opts.build;
}

/**
 * Track an event
 */
/**
 * Get active feature flags snapshot
 */
function getActiveFlags(): Record<string, boolean> {
  // TODO: Integrate with feature flag system
  // For now, return empty object
  return {};
}

/**
 * Get active experiments snapshot
 */
function getActiveExperiments(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const experiments: Record<string, string> = {};
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('zzik:experiment:') && !key.endsWith(':tracked')) {
      const expKey = key.replace('zzik:experiment:', '');
      const variant = localStorage.getItem(key);
      if (variant) experiments[expKey] = variant;
    }
  });
  return experiments;
}

export function track<N extends EventName>(name: N, props: EventProps<N>): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent()) return;

  const payload: QueueItem = {
    event_id: crypto.randomUUID(),
    name,
    schema_version: 1,
    ts_client: Date.now(),
    context: {
      app_version: appVersion,
      build,
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio ?? 1,
      },
      device_id: getDeviceId(),
      session_id: getSessionId(),
      user_id: userId,
      flags: getActiveFlags(),
      experiments: getActiveExperiments(),
    },
    props: props as any,
  };

  const queue = loadQueue();
  queue.push(payload);
  saveQueue(queue);

  // Auto-flush if threshold reached
  if (queue.length >= MAX_BATCH_SIZE) {
    flush();
  }
}

let flushing = false;

/**
 * Flush event queue to server
 */
export async function flush(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (flushing) return;
  if (!navigator.onLine) return;

  const queue = loadQueue();
  if (queue.length === 0) return;

  flushing = true;

  try {
    const batch = queue.slice(0, MAX_BATCH_SIZE);

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(batch),
      keepalive: true,
    });

    if (res.ok) {
      // Remove sent events
      const remaining = queue.slice(batch.length);
      saveQueue(remaining);

      // Recursive flush if more events
      if (remaining.length > 0) {
        setTimeout(() => {
          flushing = false;
          flush();
        }, 50);
      } else {
        flushing = false;
      }
    } else {
      flushing = false;
    }
  } catch (err) {
    console.warn('[Analytics] Flush failed:', err);
    flushing = false;
  }
}

// Auto-flush on visibility change (page hide)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  });
}

// Auto-flush when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flush();
  });
}
