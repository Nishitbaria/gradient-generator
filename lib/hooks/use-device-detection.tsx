"use client"

import { useState, useEffect } from "react"

// Hook to detect if the user is on a mobile device
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Hook to detect if the user prefers reduced motion
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if the user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    // Add event listener for changes
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    // Clean up
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

// Hook to detect device performance capabilities
export function useDevicePerformance() {
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("high")

  useEffect(() => {
    // Simple heuristic to estimate device performance
    const estimatePerformance = () => {
      // Check for low-end device indicators
      const isLowEnd =
        navigator.hardwareConcurrency <= 2 || // Low CPU cores
        (navigator.deviceMemory && navigator.deviceMemory <= 2) // Low RAM (if available)

      // Check for mid-range device indicators
      const isMidRange =
        (navigator.hardwareConcurrency > 2 && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory > 2 && navigator.deviceMemory <= 4)

      if (isLowEnd) return "low"
      if (isMidRange) return "medium"
      return "high"
    }

    try {
      setPerformanceLevel(estimatePerformance())
    } catch (e) {
      // Fallback to high if we can't detect
      console.error("Error detecting device performance:", e)
    }
  }, [])

  return performanceLevel
}

// Hook to detect network conditions
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<{
    online: boolean
    effectiveType?: "slow-2g" | "2g" | "3g" | "4g"
    saveData?: boolean
  }>({
    online: true,
  })

  useEffect(() => {
    // Update network status
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection

      setNetworkStatus({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType,
        saveData: connection?.saveData,
      })
    }

    // Initial check
    updateNetworkStatus()

    // Add event listeners
    window.addEventListener("online", updateNetworkStatus)
    window.addEventListener("offline", updateNetworkStatus)

    // Add connection change listener if available
    if ((navigator as any).connection) {
      ;(navigator as any).connection.addEventListener("change", updateNetworkStatus)
    }

    // Clean up
    return () => {
      window.removeEventListener("online", updateNetworkStatus)
      window.removeEventListener("offline", updateNetworkStatus)

      if ((navigator as any).connection) {
        ;(navigator as any).connection.removeEventListener("change", updateNetworkStatus)
      }
    }
  }, [])

  return networkStatus
}

