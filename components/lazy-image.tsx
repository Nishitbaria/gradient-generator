"use client"

import { useState, useEffect, useRef } from "react"
import { useIsMobile } from "@/lib/hooks/use-device-detection"
import { getOptimizedImageSrc } from "@/lib/performance-utils"

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholderColor?: string
}

export function LazyImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = "",
  placeholderColor = "#1f2937",
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const isMobile = useIsMobile()

  // Determine optimized image source
  const optimizedSrc = getOptimizedImageSrc(src, isMobile ? Math.min(width, 500) : width)

  useEffect(() => {
    // Use IntersectionObserver for lazy loading
    if (!("IntersectionObserver" in window)) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "200px" }, // Start loading when image is 200px from viewport
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "auto" }}
      ref={imgRef}
    >
      {/* Placeholder */}
      {!isLoaded && <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: placeholderColor }} />}

      {/* Actual image */}
      {isInView && (
        <img
          src={optimizedSrc || "/placeholder.svg"}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          width={width}
          height={height}
        />
      )}
    </div>
  )
}

