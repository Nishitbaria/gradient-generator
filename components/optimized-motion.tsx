"use client"

import type { ReactNode } from "react"
import { motion, type MotionProps, AnimatePresence } from "framer-motion"
import { useIsMobile, useReducedMotion, useDevicePerformance } from "@/lib/hooks/use-device-detection"

interface OptimizedMotionProps extends MotionProps {
  children: ReactNode
  className?: string
  mobileProps?: Partial<MotionProps>
  lowPerformanceProps?: Partial<MotionProps>
}

export function OptimizedMotion({
  children,
  className,
  mobileProps,
  lowPerformanceProps,
  ...props
}: OptimizedMotionProps) {
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const devicePerformance = useDevicePerformance()

  // Determine which props to use based on device and preferences
  let finalProps = { ...props }

  // Apply mobile-specific props if on mobile
  if (isMobile && mobileProps) {
    finalProps = { ...finalProps, ...mobileProps }
  }

  // Apply low-performance props if device has low performance
  if (devicePerformance === "low" && lowPerformanceProps) {
    finalProps = { ...finalProps, ...lowPerformanceProps }
  }

  // If user prefers reduced motion, simplify animations
  if (prefersReducedMotion) {
    // Override transition for reduced motion
    finalProps.transition = { duration: 0.1 }

    // Simplify animations
    if (finalProps.animate && typeof finalProps.animate === "object") {
      // Keep only opacity transitions for reduced motion
      const simplifiedAnimate = { opacity: finalProps.animate.opacity || 1 }
      finalProps.animate = simplifiedAnimate
    }

    if (finalProps.initial && typeof finalProps.initial === "object") {
      // Keep only opacity transitions for reduced motion
      const simplifiedInitial = { opacity: finalProps.initial.opacity || 0 }
      finalProps.initial = simplifiedInitial
    }
  }

  return (
    <motion.div className={className} {...finalProps}>
      {children}
    </motion.div>
  )
}

interface OptimizedPresenceProps {
  children: ReactNode
  show: boolean
  className?: string
  presenceProps?: {
    initial?: any
    animate?: any
    exit?: any
    transition?: any
  }
  mobilePresenceProps?: {
    initial?: any
    animate?: any
    exit?: any
    transition?: any
  }
}

export function OptimizedPresence({
  children,
  show,
  className,
  presenceProps,
  mobilePresenceProps,
}: OptimizedPresenceProps) {
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const devicePerformance = useDevicePerformance()

  // Determine which props to use
  let finalProps = presenceProps || {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  }

  // Apply mobile-specific props if on mobile
  if (isMobile && mobilePresenceProps) {
    finalProps = { ...finalProps, ...mobilePresenceProps }
  }

  // For low performance devices or reduced motion, simplify animations
  if (prefersReducedMotion || devicePerformance === "low") {
    finalProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          initial={finalProps.initial}
          animate={finalProps.animate}
          exit={finalProps.exit}
          transition={finalProps.transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

