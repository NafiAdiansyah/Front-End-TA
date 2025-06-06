self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('mqtt-cache-v1').then(cache => {
      return cache.addAll(self.__WB_MANIFEST);([
        '/',
        '/index.html',
        '/styles.css',
        '/main.js',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
