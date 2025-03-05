/**
 * Utility functions for performance optimization
 */

// Function to detect if the browser supports certain features
export function detectBrowserFeatures() {
  if (typeof window === "undefined") return {}

  return {
    // Check for IntersectionObserver support (for lazy loading)
    supportsIntersectionObserver: "IntersectionObserver" in window,

    // Check for WebP support
    supportsWebP: false, // Will be updated by checkWebPSupport

    // Check for Share API
    supportsShareApi: "share" in navigator,

    // Check for Service Worker
    supportsServiceWorker: "serviceWorker" in navigator,

    // Check for Background Sync
    supportsBackgroundSync: "serviceWorker" in navigator && "SyncManager" in window,

    // Check for IndexedDB
    supportsIndexedDB: "indexedDB" in window,

    // Check for Web Animation API
    supportsWebAnimations: "animate" in document.createElement("div"),
  }
}

// Function to check WebP support
export function checkWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 1)
    }
  })
}

// Function to optimize image loading
export function getOptimizedImageSrc(src: string, width: number, quality = 75): string {
  // If we're using a placeholder, adjust the size
  if (src.startsWith("/placeholder.svg")) {
    return `/placeholder.svg?height=${width}&width=${width}`
  }

  // For real images, we could implement responsive image logic here
  return src
}

// Function to defer non-critical operations
export function deferOperation(operation: () => void, delay = 1000): void {
  if (typeof window === "undefined") return

  if ("requestIdleCallback" in window) {
    ;(window as any).requestIdleCallback(() => operation())
  } else {
    setTimeout(operation, delay)
  }
}

// Function to measure component render time (for development)
export function measureRenderTime(componentName: string): () => void {
  if (process.env.NODE_ENV !== "development") {
    return () => {}
  }

  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`)
  }
}

