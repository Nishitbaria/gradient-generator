"use client"
import { GradientControls } from "@/components/gradient-controls"
import { GradientPreviewTabs } from "@/components/gradient-preview-tabs"
import { AccessibilityChecker } from "@/components/accessibility-checker"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Palette, ChevronDown, ChevronUp } from "lucide-react"
import { useIsMobile } from "@/lib/hooks/use-device-detection"
import dynamic from "next/dynamic"
import { OptimizedMotion, OptimizedPresence } from "@/components/optimized-motion"

// Dynamically import the ImageColorExtractor component
const ImageColorExtractor = dynamic(
  () => import("@/components/image-color-extractor").then((mod) => mod.ImageColorExtractor),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-800/30 animate-pulse rounded-xl" />,
  },
)

export default function GradientGenerator() {
  const [showExtractor, setShowExtractor] = useState(false)
  const isMobile = useIsMobile()

  return (
    <OptimizedMotion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      mobileProps={{
        transition: { duration: 0.3 },
      }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-10 px-4 md:px-6 pb-16 md:pb-24"
    >
      {/* Title Section - Mobile Optimized */}
      <div className="text-center mb-6 md:mb-10 mt-6 md:mt-8">
        <h1
          className="text-3xl md:text-5xl font-heading font-bold mb-3 md:mb-4 bg-clip-text text-transparent animate-aurora"
          style={{
            background: "linear-gradient(to right, #86efac, #3b82f6, #a855f7)",
            WebkitBackgroundClip: "text",
          }}
        >
          Tailwind Gradient Generator
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto px-2 md:px-4 leading-relaxed">
          Create beautiful gradients for your next project with this interactive tool
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center md:justify-end w-full">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="w-full sm:w-auto bg-gray-800/60 border-gray-700 text-white hover:bg-gray-700/60 shadow-sm"
          onClick={() => setShowExtractor(!showExtractor)}
        >
          <Palette className="h-4 w-4 mr-2" />
          <span className="truncate">{showExtractor ? "Hide Color Extractor" : "Extract Colors from Image"}</span>
          {showExtractor ? (
            <ChevronUp className="h-4 w-4 ml-2 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
          )}
        </Button>
      </div>

      <OptimizedPresence
        show={showExtractor}
        presenceProps={{
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: "auto" },
          exit: { opacity: 0, height: 0 },
          transition: { duration: 0.3 },
        }}
        mobilePresenceProps={{
          transition: { duration: 0.2 },
        }}
        className="overflow-hidden w-full"
      >
        <div className="w-full">
          <ImageColorExtractor />
        </div>
      </OptimizedPresence>

      <div className="w-full">
        <GradientControls />
      </div>

      <div className="w-full mt-2 md:mt-4">
        <GradientPreviewTabs />
      </div>

      {/* Only render AccessibilityChecker on non-mobile devices */}
      {!isMobile && (
        <div className="w-full mt-2 md:mt-4">
          <AccessibilityChecker />
        </div>
      )}
    </OptimizedMotion>
  )
}

