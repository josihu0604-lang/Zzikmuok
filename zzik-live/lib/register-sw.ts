/**
 * Service Worker Registration Utility
 * Handles registration, updates, and lifecycle events
 */

export interface SwRegistrationCallbacks {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

/**
 * Register Service Worker
 */
export async function registerServiceWorker(
  callbacks: SwRegistrationCallbacks = {}
): Promise<ServiceWorkerRegistration | undefined> {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Workers are not supported in this browser');
    return undefined;
  }

  // Only register in production or when explicitly enabled
  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.NEXT_PUBLIC_ENABLE_SW
  ) {
    console.log('Service Worker registration skipped in development');
    return undefined;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service Worker registered successfully:', registration.scope);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          console.log('[SW] New Service Worker available');
          callbacks.onUpdate?.(registration);
        }
      });
    });

    callbacks.onSuccess?.(registration);
    return registration;
  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error);
    callbacks.onError?.(error as Error);
    return undefined;
  }
}

/**
 * Unregister Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      console.log('[SW] Service Worker unregistered:', success);
      return success;
    }
    return false;
  } catch (error) {
    console.error('[SW] Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Check for Service Worker updates
 */
export async function checkForUpdates(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('[SW] Checked for updates');
    }
  } catch (error) {
    console.error('[SW] Update check failed:', error);
  }
}

/**
 * Skip waiting and activate new Service Worker
 */
export async function skipWaitingAndReload(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration || !registration.waiting) {
    return;
  }

  // Send skip waiting message to waiting worker
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });

  // Reload page when new worker takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

/**
 * Request Push Notification Permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Subscribe to Push Notifications
 */
export async function subscribeToPushNotifications(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    // Request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('[SW] Notification permission not granted');
      return null;
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('[SW] Push notification subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('[SW] Push notification subscription failed:', error);
    return null;
  }
}

/**
 * Convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Check if app is running in standalone mode (installed PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Get install prompt event
 */
let deferredPrompt: any = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[SW] Install prompt ready');
  });
}

/**
 * Show PWA install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log('[SW] Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('[SW] Install prompt outcome:', outcome);

  deferredPrompt = null;
  return outcome === 'accepted';
}

/**
 * Check if install prompt is available
 */
export function isInstallPromptAvailable(): boolean {
  return deferredPrompt !== null;
}
