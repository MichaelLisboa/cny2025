self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cny2025-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/css/style.css',
        '/src/js/app.js',
        // Add other assets to cache
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
