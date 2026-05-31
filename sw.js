// Service Worker for Life Clock PWA
const CACHE_NAME = 'life-clock-v7';
const urlsToCache = [
    '/index.html',  // Your HTML file
'./manifest.json'
];

// Install event - cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
        .catch(err => console.log('Cache error:', err))
    );
    self.skipWaiting(); // Activate immediately
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Cache hit - return response
            if (response) {
                return response;
            }
            // Clone the request (requests are one-time use)
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(response => {
                // Check if valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response (it can only be consumed once)
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                .then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});

// Activate event - clean up old caches
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
    event.waitUntil(clients.claim()); // Take control immediately
});
