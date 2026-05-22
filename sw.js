const CACHE_NAME = 'audio-player-v3';
const ASSETS = [
  'Podcast.html',
  'manifest.json'
];

// Installieren und App-Hülle in den Cache laden
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Alten Cache löschen, wenn sich die Version ändert
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Netzwerk-Anfragen abfangen
self.addEventListener('fetch', (e) => {
  // Radio-Streams und Datei-Blobs ignorieren, nur App-Hülle cachen
  if (e.request.url.startsWith('http') && !e.request.url.includes('.mp3') && !e.request.url.includes('stream')) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        return cachedResponse || fetch(e.request);
      })
    );
  }
});


