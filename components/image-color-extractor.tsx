"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, X, Check, RefreshCw, Palette } from "lucide-react"
import { motion } from "framer-motion"
import { useGradientStore } from "@/lib/store"
import { extractDominantColors, ensureColorContrast, findClosestTailwindColor } from "@/lib/color-utils"

export function ImageColorExtractor() {
  const [image, setImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionComplete, setExtractionComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setFromColor, setViaColor, setToColor, setUseVia } = useGradientStore()

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setExtractedColors([])
        setExtractionComplete(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // Extract colors from the image
  const extractColors = async () => {
    if (!image) return

    setIsExtracting(true)

    // Create a canvas to analyze the image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw image on canvas
      ctx?.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)

      if (imageData) {
        // Extract colors using our utility function
        const colors = extractDominantColors(imageData.data, 3)

        // Ensure colors have good contrast
        const contrastedColors = ensureColorContrast(colors)

        setExtractedColors(contrastedColors)
        setExtractionComplete(true)
        setIsExtracting(false)
      }
    }
  }

  // Apply extracted colors to the gradient
  const applyColors = () => {
    if (extractedColors.length >= 2) {
      // Convert hex to closest Tailwind color
      const tailwindColors = extractedColors.map(findClosestTailwindColor)

      // Apply colors to gradient
      setFromColor(tailwindColors[0].color, tailwindColors[0].intensity)

      if (tailwindColors.length >= 3) {
        setViaColor(tailwindColors[1].color, tailwindColors[1].intensity)
        setToColor(tailwindColors[2].color, tailwindColors[2].intensity)
        setUseVia(true)
      } else {
        setToColor(tailwindColors[1].color, tailwindColors[1].intensity)
        setUseVia(false)
      }
    }
  }

  // Reset the extractor
  const resetExtractor = () => {
    setImage(null)
    setExtractedColors([])
    setExtractionComplete(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="bg-app-card/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-app-card-border dark:border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-app-foreground dark:text-white font-medium flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-400" />
          Image Color Extraction
        </h3>

        {image && (
          <Button
            variant="ghost"
            size="sm"
            className="text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white"
            onClick={resetExtractor}
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {!image ? (
          <div className="border-2 border-dashed border-app-muted-foreground/30 dark:border-gray-700 rounded-xl p-8 text-center">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} />

            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-app-muted-foreground dark:text-gray-600" />

            <h4 className="text-app-foreground dark:text-white font-medium mb-2">Upload an image</h4>
            <p className="text-app-muted-foreground dark:text-gray-400 text-sm mb-4">
              We'll extract colors from your image to create a beautiful gradient
            </p>

            <Button
              variant="outline"
              className="bg-app-muted/50 dark:bg-gray-800/50 border-app-muted-foreground/30 dark:border-gray-700 text-app-foreground dark:text-white hover:bg-app-muted dark:hover:bg-gray-700/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden aspect-video bg-app-muted dark:bg-gray-800">
              <img src={image || "/placeholder.svg"} alt="Uploaded image" className="w-full h-full object-contain" />
            </div>

            {!extractionComplete ? (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={extractColors}
                disabled={isExtracting}
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Extracting Colors...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Extract Colors
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {extractedColors.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex-1 h-16 rounded-lg"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={applyColors}>
                  <Check className="h-4 w-4 mr-2" />
                  Apply Colors to Gradient
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

