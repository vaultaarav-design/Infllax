// ISI Terminal v6.0 — Service Worker (PWA)
const CACHE = 'isi-v6-cache-v1';
const ASSETS = [
  './index.html',
  './style.css',
  './index.js',
  './gemini.js',
  './order-tracker.js',
  './monitoring.html',
  './monitoring.js',
  './preentry.html',
  './preentry.js',
  './Settings.html',
  './settings.js',
  './algo.html',
  './multicluster.html',
  './knowledge.html',
  './knowledge.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for Firebase, fallback to cache
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200 && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
