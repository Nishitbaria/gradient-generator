"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface SparklesTextProps {
  text: string
  className?: string
  sparklesCount?: number
  colors?: {
    first: string
    second: string
  }
}

export function SparklesText({
  text,
  className,
  sparklesCount = 10,
  colors = { first: "#A07CFE", second: "#FE8FB5" },
}: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([])

  useEffect(() => {
    // Generate initial sparkles
    const initialSparkles = Array.from({ length: sparklesCount }).map((_, i) => createSparkle(i, colors))
    setSparkles(initialSparkles)

    // Set up interval to regenerate sparkles
    const interval = setInterval(() => {
      setSparkles((currentSparkles) => {
        // Remove one random sparkle
        const sparkleToRemove = Math.floor(Math.random() * currentSparkles.length)
        const newSparkles = [...currentSparkles]
        newSparkles.splice(sparkleToRemove, 1)

        // Add a new sparkle
        const newSparkle = createSparkle(Date.now(), colors)
        return [...newSparkles, newSparkle]
      })
    }, 500)

    return () => clearInterval(interval)
  }, [sparklesCount, colors])

  return (
    <div className="relative inline-block">
      <h2 className={cn("relative z-10", className)}>{text}</h2>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              width={sparkle.size}
              height={sparkle.size}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={sparkle.color} />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function createSparkle(id: number, colors: { first: string; second: string }) {
  return {
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 10,
    color: Math.random() > 0.5 ? colors.first : colors.second,
  }
}

