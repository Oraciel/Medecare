let CACHE_NAME = "my-site-cache-v1";
const urlsToCache = ["/", "/index.html",];

// Ce code permet grace au fetch de récupérer les fichiers en cache si ils sont présents
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request)
        })
    );
});


// Ce code permet grace au install de mettre en cache les fichiers
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache)
        })
    );
    self.skipWaiting();
});