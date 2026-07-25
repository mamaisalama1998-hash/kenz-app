const C = 'kenz-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin === location.origin && e.request.method === 'GET') {
    e.respondWith(
      fetch(e.request).then(r => {
        const cl = r.clone();
        caches.open(C).then(c => c.put(e.request, cl));
        return r;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  }
});
