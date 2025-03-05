// Service Worker for Tailwind Gradient Generator
const CACHE_NAME = "gradient-generator-v1"

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/favicon.ico",
  // Add paths to your CSS, JS, and other static assets
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response - one to return, one to cache
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If both cache and network fail, serve a fallback
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/offline.html")
          }
        })
    }),
  )
})

// Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-gradients") {
    event.waitUntil(syncGradients())
  }
})

// Function to sync gradients
async function syncGradients() {
  try {
    const db = await openDB()
    const tx = db.transaction("sync-queue", "readwrite")
    const store = tx.objectStore("sync-queue")

    const items = await new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    // Process each item in the queue
    for (const item of items) {
      try {
        // Here you would implement the actual sync with your server
        // For example, using fetch to send data to your API

        // Remove from queue after successful sync
        await new Promise((resolve, reject) => {
          const request = store.delete(item.id)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      } catch (error) {
        console.error("Error syncing item in service worker:", item, error)
      }
    }

    return true
  } catch (error) {
    console.error("Error in syncGradients:", error)
    return false
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("gradient-generator-db", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

