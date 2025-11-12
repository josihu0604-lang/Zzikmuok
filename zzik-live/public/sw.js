/**
 * Service Worker for ZZIK LIVE PWA
 * Provides offline support, caching strategies, and push notifications
 * 
 * Cache Strategy:
 * - Network First: API calls and dynamic content
 * - Cache First: Static assets (images, fonts, CSS, JS)
 * - Stale While Revalidate: HTML pages
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `zzik-live-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/home',
  '/map',
  '/missions',
  '/rewards',
  '/profile',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Cache size limits
const CACHE_LIMITS = {
  images: 50,
  pages: 20,
  api: 30,
};

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[Service Worker] Installed successfully');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('[Service Worker] Installation failed:', error);
    })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('zzik-live-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[Service Worker] Activated successfully');
      return self.clients.claim();
    })
  );
});

/**
 * Fetch Event - Handle requests with appropriate caching strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except for images)
  if (url.origin !== location.origin && !request.destination === 'image') {
    return;
  }
  
  // API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, 'api-cache'));
    return;
  }
  
  // Images - Cache First
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, 'image-cache'));
    return;
  }
  
  // Static assets (CSS, JS, fonts) - Cache First
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request, 'static-cache'));
    return;
  }
  
  // HTML pages - Stale While Revalidate
  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request, 'page-cache'));
    return;
  }
  
  // Default - Network First
  event.respondWith(networkFirst(request, CACHE_NAME));
});

/**
 * Network First Strategy
 * Try network, fallback to cache if offline
 */
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page if available
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

/**
 * Cache First Strategy
 * Try cache first, fallback to network
 */
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      
      // Limit cache size
      limitCacheSize(cacheName, CACHE_LIMITS.images);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache First failed:', error);
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 * Return cached version immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      const cache = caches.open(cacheName);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[Service Worker] Background fetch failed:', error);
  });
  
  return cachedResponse || fetchPromise;
}

/**
 * Limit cache size by deleting oldest entries
 */
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    const itemsToDelete = keys.length - maxItems;
    for (let i = 0; i < itemsToDelete; i++) {
      await cache.delete(keys[i]);
    }
  }
}

/**
 * Push Notification Event
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || '새로운 미션이 도착했습니다!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/missions',
      timestamp: Date.now(),
    },
    actions: [
      {
        action: 'view',
        title: '확인하기',
        icon: '/icons/check-icon.png',
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icons/close-icon.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'ZZIK LIVE', options)
  );
});

/**
 * Notification Click Event
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/missions';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

/**
 * Background Sync Event
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-missions') {
    event.waitUntil(syncMissions());
  }
});

async function syncMissions() {
  try {
    const response = await fetch('/api/missions/sync', {
      method: 'POST',
    });
    
    if (response.ok) {
      console.log('[Service Worker] Missions synced successfully');
    }
  } catch (error) {
    console.error('[Service Worker] Mission sync failed:', error);
    throw error;
  }
}

console.log('[Service Worker] Loaded successfully');
