const C = 'kenz-v4-4';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin === location.origin && e.request.method === 'GET') {
    // always prefer the network so a new build is picked up immediately
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then(r => {
        const cl = r.clone();
        caches.open(C).then(c => c.put(e.request, cl));
        return r;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  }
});
