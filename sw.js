const CACHE_NAME = 'ai-agent-system-v2-mobile-optimized';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-192-maskable.png',
  '/icon-512.png',
  '/favicon.ico',
  '/sw.js'
];

// Ollama local endpoints for offline capability
const OLLAMA_ENDPOINTS = [
  'http://localhost:11434',
  'http://127.0.0.1:11434'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline, handle Ollama requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle Ollama local requests for offline capability
  if (OLLAMA_ENDPOINTS.some(endpoint => url.href.startsWith(endpoint))) {
    event.respondWith(handleOllamaRequest(event.request));
    return;
  }
  
  // Handle API requests with offline fallback
  if (url.pathname.includes('/api/') || url.hostname.includes('api.')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // Handle static resources
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Handle Ollama requests for offline AI processing
async function handleOllamaRequest(request) {
  try {
    // Try to reach Ollama locally
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Ollama not available, return offline response
    return new Response(JSON.stringify({
      error: 'Ollama offline',
      message: 'Local AI model not available. Please ensure Ollama is running locally.',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle API requests with intelligent caching
async function handleApiRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'No internet connection. Some features may be limited.',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for offline task queuing
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any queued tasks when back online
  console.log('Background sync triggered');
  // Implementation would depend on specific offline requirements
}