/* 
   Killer Service Worker 
   This script replaces the old PWA caching service worker.
   It immediately deletes all caches and unregisters itself.
*/

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all caches
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Unregister itself
      self.registration.unregister().then(() => {
        console.log('Service Worker unregistered successfully.');
      });
    })
  );
});
