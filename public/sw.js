const CACHE_NAME = 'waqt-v1'
const PRAYER_CACHE = 'waqt-prayer-times-v1'

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon.png',
  '/favicon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== PRAYER_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/api/diyanet') || url.hostname === 'api.aladhan.com') {
    event.respondWith(
      caches.open(PRAYER_CACHE).then(async (cache) => {
        try {
          const response = await fetch(event.request)
          if (response.ok) {
            cache.put(event.request, response.clone())
          }
          return response
        } catch (error) {
          const cached = await cache.match(event.request)
          if (cached) {
            return cached
          }
          throw error
        }
      })
    )
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/') || new Response('Offline', { status: 503 })
      })
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached
      }
      return fetch(event.request).then((response) => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })
        }
        return response
      })
    })
  )
})
