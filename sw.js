/**
 * Banking Current Affairs Mentor — Service Worker
 * Production-safe PWA and Offline Cache Layer
 */

const CACHE_VERSION = 'v2-banking-ca';
const STATIC_CACHE = `ca-static-${CACHE_VERSION}`;
const DATA_CACHE = `ca-data-${CACHE_VERSION}`;
const PAGES_CACHE = `ca-pages-${CACHE_VERSION}`;

// Dynamically compute base path from service worker registration scope
const getBasePath = () => {
  try {
    return new URL(self.registration.scope).pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
};

const getCoreAssets = () => {
  const base = getBasePath();
  return [
    `${base}/`,
    `${base}/dashboard`,
    `${base}/topics`,
    `${base}/revision`,
    `${base}/search`,
    `${base}/institutions`,
    `${base}/chronology`,
    `${base}/offline`,
    `${base}/manifest.json`,
    `${base}/icons/icon-192.svg`,
    `${base}/icons/icon-512.svg`,
    `${base}/icons/icon-maskable-512.svg`
  ];
};

// 1. Installation: Pre-cache Core Offline Shell & Skip Waiting Immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(getCoreAssets()).catch((err) => {
        console.warn('Failed to precache some assets:', err);
      });
    })
  );
});

// 2. Activation: Clean Stale/Obsolete Caches Immediately
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DATA_CACHE, PAGES_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            console.log('Purging obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Controlled Skip-Waiting via Client Message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. Fetch Strategy Orchestration
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and browser extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  const base = getBasePath();

  // Strategy A: Stale-While-Revalidate for Canonical Data Registry & JSON
  if (url.pathname.includes('banking-ca-registry.json') || url.pathname.includes('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy B: Cache-First for Versioned Next.js Static Assets & Fonts & Images
  if (
    url.pathname.includes('/_next/static/') ||
    url.pathname.includes('/icons/') ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image'
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy C: Network-First with Cache & Offline Fallback for HTML Navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(PAGES_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedPage) => {
            if (cachedPage) return cachedPage;
            return caches.match(`${base}/offline`) || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request);
    })
  );
});
