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
    loading: () => <div className="h-64 bg-gray-800/30 animate-pulse rounded-xl" />,
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
      className="w-full max-w-4xl flex flex-col gap-4 md:gap-8 px-4 md:px-6"
    >
      {/* Title Section - Mobile Optimized */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 animate-aurora">
          Gradient Generator
        </h1>
        <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto px-4">
          Create beautiful gradients for your next project with this interactive tool
        </p>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 justify-end">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="w-full md:w-auto bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
          onClick={() => setShowExtractor(!showExtractor)}
        >
          <Palette className="h-4 w-4 mr-2" />
          {showExtractor ? "Hide Color Extractor" : "Extract Colors from Image"}
          {showExtractor ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
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
        className="overflow-hidden"
      >
        <ImageColorExtractor />
      </OptimizedPresence>

      <GradientControls />
      <GradientPreviewTabs />
      <AccessibilityChecker />
    </OptimizedMotion>
  )
}

