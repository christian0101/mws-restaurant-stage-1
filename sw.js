const staticCacheName = 'mws-static-v1';
const contentImgsCache = 'mws-content-imgs';

const allCaches = [
staticCacheName,
contentImgsCache
];

/**
* Install service worker
*/
self.addEventListener('install', function(event) {
event.waitUntil(
  caches.open(staticCacheName).then(function(cache) {
    cache.addAll([
      '/',
      '/restaurant.html',
      '/css/styles.css',
      '/js/main.js',
      '/js/restaurant_info.js',
      '/js/private.js',
      '/js/dbhelper.js',
      '/data/restaurants.json',
      'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.css'
    ]);
  })
);
});

/**
*
*/
self.addEventListener('activate', function(event) {
event.waitUntil(
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.filter(function(cacheName) {
        return cacheName.startsWith('mws-') &&
               !allCaches.includes(cacheName);
      }).map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  })
);
});

/**
* Respond with existing responses from cache
*/
self.addEventListener('fetch', function(event) {
 var requestUrl = new URL(event.request.url);

 if (requestUrl.pathname === "/restaurant.html") {
   event.respondWith(serveRestuarantPage(event.request));
   return;
 }

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});

/**
* Return the retuarant html template
*/
function serveRestuarantPage(request) {
 var storageUrl = request.url.replace(/\?id=\d/, '');

 return caches.open(contentImgsCache).then(function(cache) {
   return cache.match(storageUrl).then(function(response) {
     var networkFetch = fetch(request).then(function(networkResponse) {
       cache.put(storageUrl, networkResponse.clone());
       return networkResponse;
     });
     return response || networkFetch;
   });
 });
}

/**
*  Respond to messages
*/
self.addEventListener('message', function(event) {
 if (event.data.action === 'skipWaiting') {
   self.skipWaiting();
 }
});
