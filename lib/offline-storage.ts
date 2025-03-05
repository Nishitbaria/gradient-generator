// Add this type declaration at the top of the file
declare global {
  interface ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    }
  }

  interface Window {
    SyncManager: any;
  }
}

import type { GradientHistoryItem } from "./store"

// IndexedDB setup
const DB_NAME = "gradient-generator-db"
const DB_VERSION = 1
const GRADIENTS_STORE = "gradients"
const SYNC_QUEUE_STORE = "sync-queue"

// Open the database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = request.result

      // Create gradients store
      if (!db.objectStoreNames.contains(GRADIENTS_STORE)) {
        db.createObjectStore(GRADIENTS_STORE, { keyPath: "id" })
      }

      // Create sync queue store
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: "id", autoIncrement: true })
      }
    }
  })
}

// Save gradient to local storage
export async function saveGradientLocally(gradient: GradientHistoryItem): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(GRADIENTS_STORE, "readwrite")
    const store = tx.objectStore(GRADIENTS_STORE)

    await new Promise<void>((resolve, reject) => {
      const request = store.put(gradient)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    // Add to sync queue if we're offline
    if (!navigator.onLine) {
      await addToSyncQueue("save", gradient)
    }
  } catch (error) {
    console.error("Error saving gradient locally:", error)
  }
}

// Get all locally saved gradients
export async function getLocalGradients(): Promise<GradientHistoryItem[]> {
  try {
    const db = await openDB()
    const tx = db.transaction(GRADIENTS_STORE, "readonly")
    const store = tx.objectStore(GRADIENTS_STORE)

    return new Promise<GradientHistoryItem[]>((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error("Error getting local gradients:", error)
    return []
  }
}

// Delete gradient from local storage
export async function deleteLocalGradient(id: string): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(GRADIENTS_STORE, "readwrite")
    const store = tx.objectStore(GRADIENTS_STORE)

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    // Add to sync queue if we're offline
    if (!navigator.onLine) {
      await addToSyncQueue("delete", { id })
    }
  } catch (error) {
    console.error("Error deleting local gradient:", error)
  }
}

// Clear all gradients from local storage
export async function clearLocalGradients(): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(GRADIENTS_STORE, "readwrite")
    const store = tx.objectStore(GRADIENTS_STORE)

    await new Promise<void>((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    console.log("All gradients cleared from IndexedDB")
  } catch (error) {
    console.error("Error clearing local gradients:", error)
  }
}

// Add operation to sync queue
async function addToSyncQueue(operation: "save" | "delete", data: any): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(SYNC_QUEUE_STORE, "readwrite")
    const store = tx.objectStore(SYNC_QUEUE_STORE)

    await new Promise<void>((resolve, reject) => {
      const request = store.add({
        operation,
        data,
        timestamp: Date.now(),
      })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })

    // Register for background sync if supported
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register("sync-gradients")
    }
  } catch (error) {
    console.error("Error adding to sync queue:", error)
  }
}

// Process sync queue when online
export async function processSyncQueue(): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(SYNC_QUEUE_STORE, "readwrite")
    const store = tx.objectStore(SYNC_QUEUE_STORE)

    const items = await new Promise<any[]>((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    // Process each item in the queue
    for (const item of items) {
      try {
        // Here you would implement the actual sync with your server
        // For example:
        // if (item.operation === 'save') {
        //   await apiClient.saveGradient(item.data);
        // } else if (item.operation === 'delete') {
        //   await apiClient.deleteGradient(item.data.id);
        // }

        // For now, we'll just log it
        console.log("Synced item:", item)

        // Remove from queue after successful sync
        await new Promise<void>((resolve, reject) => {
          const request = store.delete(item.id)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      } catch (error) {
        console.error("Error syncing item:", item, error)
      }
    }
  } catch (error) {
    console.error("Error processing sync queue:", error)
  }
}

// Initialize offline storage and sync
export function initOfflineStorage(): void {
  // Process sync queue when coming online
  window.addEventListener("online", () => {
    processSyncQueue()
  })

  // Check if we're online at startup and process queue if needed
  if (navigator.onLine) {
    processSyncQueue()
  }
}

