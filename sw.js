const CACHE_NAME = 'ai-worker-plus-v1';
// All paths are now relative
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/lucide-react@latest/dist/lucide-react.js'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Serve cached assets first, then fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch and cache
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
               // Only cache 200-level responses
               // We don't cache 'basic' type here to avoid caching opaque CDN responses
               // but we must cache our own app files
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache if it's one of our app's requests or a CDN script
                // This avoids caching API calls
                if(event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://unpkg.com')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        ).catch(err => {
            // Network request failed
            console.error('Fetch failed:', err);
            // You could return an offline page here if you had one
        });
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
