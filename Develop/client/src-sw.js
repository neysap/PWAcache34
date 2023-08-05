const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
const assetCache = new CacheFirst({
  cacheName: 'asset-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 50, // Limit number of entries
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});

registerRoute(
  ({ request }) => request.destination === 'script' ||
  request.destination === 'style' ||
  request.destination === 'image',
  assetCache
);

// Offline fallback
offlineFallback({
  precacheFallback: { 'offline.html': '/offline.html' },
  routeFallback: ({ event }) => {
    if (event.request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    return Response.error();
  },
});