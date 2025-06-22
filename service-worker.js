/*!
 * Last War Nexus - Service Worker
 * Offline functionality and caching
 */

const CACHE_NAME = 'last-war-nexus-v1.0.1';
const STATIC_CACHE = 'lwn-static-v2';
const DATA_CACHE = 'lwn-data-v2';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/js/config.js',
  '/js/core.js',
  '/js/ui.js',
  '/js/app.js',
  '/manifest.json'
];

// API endpoints to cache (for future use)
const API_ENDPOINTS = [
  // Add any API endpoints here in the future
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache data endpoints
      caches.open(DATA_CACHE).then((cache) => {
        console.log('[SW] Caching data endpoints');
        return cache.addAll(API_ENDPOINTS);
      })
    ]).then(() => {
      // Force activation of new service worker
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

/**
 * Fetch event - serve from cache or network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip caching for Ezoic ad content
  if (url.hostname.includes('ezoic') || 
      url.hostname.includes('googleads') || 
      url.hostname.includes('googlesyndication') ||
      url.pathname.includes('ezoic')) {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle static assets
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset.replace('/', '')))) {
    event.respondWith(handleStaticAssetRequest(request));
    return;
  }
  
  // Handle API requests (for future use)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Default: try network first, fall back to cache
  event.respondWith(handleDefaultRequest(request));
});

/**
 * Handle navigation requests (HTML pages)
 */
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed for navigation, trying cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fall back to offline page
    return caches.match('/index.html');
  }
}

/**
 * Handle static asset requests (CSS, JS, etc.)
 */
async function handleStaticAssetRequest(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Check if we should update the cache in the background
      updateCacheInBackground(request);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to fetch static asset:', request.url);
    
    // Return a basic error response
    return new Response('Asset not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

/**
 * Handle API requests (for future use)
 */
async function handleApiRequest(request) {
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DATA_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network failed for API request, trying cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response
    return new Response(JSON.stringify({
      error: 'Data not available offline'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Handle default requests
 */
async function handleDefaultRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Nothing in cache either
    return new Response('Content not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

/**
 * Update cache in background (stale-while-revalidate)
 */
function updateCacheInBackground(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, response);
        });
      }
    })
    .catch((error) => {
      console.log('[SW] Background cache update failed:', error);
    });
}

/**
 * Handle background sync (for future use)
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'sync-settings') {
    event.waitUntil(syncSettings());
  }
});

/**
 * Sync settings when back online
 */
async function syncSettings() {
  try {
    // Future: sync settings with server
    console.log('[SW] Syncing settings...');
  } catch (error) {
    console.error('[SW] Settings sync failed:', error);
  }
}

/**
 * Handle push notifications (for future use)
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (!event.data) {
    return;
  }
  
  const options = {
    body: event.data.text(),
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/manifest-icon-96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/manifest-icon-96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Last War Nexus', options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

/**
 * Handle messages from the main thread
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_NAME
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED'
        });
      })
    );
  }
});

/**
 * Periodic background sync (for future use)
 */
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync event:', event.tag);
  
  if (event.tag === 'update-priority-windows') {
    event.waitUntil(updatePriorityWindows());
  }
});

/**
 * Update priority windows in background
 */
async function updatePriorityWindows() {
  try {
    // Future: fetch latest priority window data
    console.log('[SW] Updating priority windows...');
  } catch (error) {
    console.error('[SW] Priority windows update failed:', error);
  }
}

/**
 * Cache management utilities
 */
const CacheManager = {
  /**
   * Get cache size
   */
  async getCacheSize(cacheName) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let totalSize = 0;
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
    
    return totalSize;
  },
  
  /**
   * Clean up old cache entries
   */
  async cleanup(cacheName, maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const now = Date.now();
    
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const age = now - new Date(dateHeader).getTime();
          if (age > maxAge) {
            await cache.delete(key);
            console.log('[SW] Deleted old cache entry:', key.url);
          }
        }
      }
    }
  }
};

// Periodic cache cleanup
setInterval(() => {
  CacheManager.cleanup(STATIC_CACHE);
  CacheManager.cleanup(DATA_CACHE);
}, 24 * 60 * 60 * 1000); // Once per day