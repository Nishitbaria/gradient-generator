"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine)

    // Add event listeners
    const handleOnline = () => {
      setIsOnline(true)
      // Show a brief "back online" message
      setShowOfflineMessage(true)
      setTimeout(() => setShowOfflineMessage(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {showOfflineMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            isOnline ? "bg-green-500/90 text-white" : "bg-yellow-500/90 text-white"
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="h-5 w-5" />
              <span>You're back online! Changes will sync automatically.</span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5" />
              <span>You're offline. Your changes will be saved locally and synced when you're back online.</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

