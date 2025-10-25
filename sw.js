const CACHE_NAME = 'ai-worker-plus-v2'; // Incremented cache name to force update

// ONLY cache your local files.
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install the service worker and cache local assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching local files');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting(); // Force the new service worker to activate
});

// Serve cached assets first, but ignore third-party requests
self.addEventListener('fetch', event => {
  // If the request is NOT for our own domain, let the browser handle it.
  // This is the key fix for the CORS error.
  if (!event.request.url.startsWith(self.location.origin)) {
    return; // Do not intercept the request.
  }

  // For our own files, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch, cache, and return
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control immediately
});
