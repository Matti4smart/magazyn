// Service Worker — Magazyn Domowy
// Cache'uje interfejs (do działania offline), dane zawsze pobiera na świeżo z API.

const CACHE = 'magazyn-v1';
const PLIKI = [
  './',
  './index.html',
  './config.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PLIKI)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((klucze) =>
      Promise.all(klucze.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  // Żądań do API (Apps Script / googleusercontent) nigdy nie cache'ujemy
  if (url.includes('script.google.com') || url.includes('googleusercontent.com')) {
    return; // domyślny fetch z sieci
  }
  // App shell: najpierw cache, potem sieć
  e.respondWith(
    caches.match(e.request).then((odp) => odp || fetch(e.request))
  );
});
