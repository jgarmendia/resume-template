/*****************************************************************************
   *
   * Service worker
   *
   ****************************************************************************/

// nombre del cache actual
// IMPORTANTE !!!  (se debe cambiar el nombre por cada cambio)
var cacheName = 'resume-temp-01';

// lista de archivos necesarios para la shell app (index, js, imagenes,css, etc)
// para github pages, se mepieza con el nombre del repositorio
var filesToCache = [
    '/',
    '/index.html',
    '/style.css'
];

// Instalación
// se abre cache y se da un nombre con caches.open()
// cache.addAll() toma una lista de URL, las obtiene del servidor y agrega la respuesta al cache.
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

// Activación
// se inicia, cuando se inicia el service worker.
// se actualiza el cache cada vez que se cambie el cacheName
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });

// Fetch
// intercepta las solicitudes de la PWA para controlarlas con el service worker.
// caches.match() responde con la versión almacenada del cache o usa fetch para obtener una copia de la red.
// e.respondWith() devuelve la response.
  self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  });