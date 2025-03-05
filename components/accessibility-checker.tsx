"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Info, RefreshCw, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useGradientStore } from "@/lib/store"
import {
  calculateContrastRatio,
  getTextColorSuggestions,
  getDefaultTextColor,
  extractRepresentativeColor,
  areColorsTooSimilar,
} from "@/lib/accessibility-utils"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert } from "@/components/ui/alert"

export function AccessibilityChecker() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [textColor, setTextColor] = useState("#FFFFFF") // Default white text
  const [fontSize, setFontSize] = useState(16) // Default 16px
  const [fontWeight, setFontWeight] = useState("normal") // Default normal weight
  const [activeTab, setActiveTab] = useState("normal")
  const [isChecking, setIsChecking] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showInitialHint, setShowInitialHint] = useState(true)
  const [colorsAreTooSimilar, setColorsAreTooSimilar] = useState(false)

  const { gradientClass, cssGradient } = useGradientStore()

  // Calculate contrast ratio
  const [contrastRatio, setContrastRatio] = useState(0)
  const [wcagAA, setWcagAA] = useState(false)
  const [wcagAAA, setWcagAAA] = useState(false)

  // Auto-suggest initial text color based on gradient
  useEffect(() => {
    if (cssGradient) {
      const suggestedColor = getDefaultTextColor(cssGradient())
      setTextColor(suggestedColor)
    }
  }, [cssGradient])

  // Check accessibility when gradient or text color changes
  const checkAccessibility = useCallback(() => {
    setIsChecking(true)

    // Use a slight delay to make the loading state visible to users
    setTimeout(() => {
      try {
        // Extract representative color from gradient for similarity check
        const bgColor = extractRepresentativeColor(cssGradient())

        // Check if colors are too similar
        const similarityCheck = areColorsTooSimilar(textColor, bgColor)
        setColorsAreTooSimilar(similarityCheck)

        const ratio = calculateContrastRatio(textColor, cssGradient())
        setContrastRatio(ratio)

        // Check WCAG compliance
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight === "bold")

        // If colors are too similar, automatically fail the checks
        if (similarityCheck) {
          setWcagAA(false)
          setWcagAAA(false)
        } else {
          // WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text
          // and 3:1 for large text
          setWcagAA(isLargeText ? ratio >= 3 : ratio >= 4.5)

          // WCAG 2.1 Level AAA requires a contrast ratio of at least 7:1 for normal text
          // and 4.5:1 for large text
          setWcagAAA(isLargeText ? ratio >= 4.5 : ratio >= 7)
        }
      } catch (error) {
        console.error("Error calculating contrast ratio:", error)
        setContrastRatio(0)
        setWcagAA(false)
        setWcagAAA(false)
      }

      setIsChecking(false)
    }, 800) // Increased from 500ms to 800ms to make the loading state more noticeable
  }, [textColor, cssGradient, fontSize, fontWeight])

  useEffect(() => {
    checkAccessibility()
  }, [checkAccessibility])

  const getContrastRatioColor = () => {
    if (contrastRatio >= 7) return "text-green-400"
    if (contrastRatio >= 4.5) return "text-green-500"
    if (contrastRatio >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const handleGetSuggestions = () => {
    setShowSuggestions(true)
    const textSuggestions = getTextColorSuggestions(cssGradient())
    setSuggestions(textSuggestions)
  }

  const applyTextColor = (color: string) => {
    setTextColor(color)
    setShowSuggestions(false)
  }

  // Auto-expand the checker if contrast is poor
  useEffect(() => {
    if (contrastRatio < 3 && !isExpanded && !showInitialHint) {
      setIsExpanded(true)
    }
  }, [contrastRatio, isExpanded, showInitialHint])

  return (
    <div className="bg-app-card/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-app-card-border dark:border-white/5 mt-6">
      {/* Header with Status Indicator */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => {
          setIsExpanded(!isExpanded)
          setShowInitialHint(false)
        }}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-app-foreground dark:text-white font-medium flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-400" />
            Accessibility Checker
          </h3>
          <div
            className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              wcagAA
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30",
            )}
          >
            {wcagAA ? "Accessible" : "Needs Review"}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Initial Hint Message */}
      {showInitialHint && !isExpanded && !wcagAA && (
        <Alert className="mt-4 bg-yellow-500/10 border-yellow-500/30 text-yellow-300">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">
            Your gradient might have accessibility issues. Click to check and improve text readability.
          </p>
        </Alert>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-6">
              {/* Preview Section */}
              <div className="relative rounded-xl overflow-hidden">
                <div
                  className="p-8 flex items-center justify-center w-full h-full"
                  style={{
                    minHeight: "120px",
                    background: cssGradient()
                  }}
                >
                  <p
                    className="text-center max-w-md transition-all duration-300"
                    style={{
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      fontWeight: fontWeight,
                    }}
                  >
                    {activeTab === "normal"
                      ? "This is example text on your gradient background."
                      : "The quick brown fox jumps over the lazy dog."}
                  </p>
                </div>
              </div>

              {/* Controls Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-app-card/80 dark:bg-gray-800/30 p-4 rounded-lg border border-app-card-border dark:border-gray-700/30">
                  <h4 className="text-app-foreground dark:text-white text-sm font-medium">Text Properties</h4>

                  {/* Text Type Tabs */}
                  <Tabs defaultValue="normal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="normal">Normal Text</TabsTrigger>
                      <TabsTrigger value="sample">Sample Text</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Text Color */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-app-foreground dark:text-gray-400">Text Color</label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border border-app-card-border dark:border-white/10"
                        style={{ backgroundColor: textColor }}
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 bg-app-muted dark:bg-gray-800 border border-app-card-border dark:border-gray-700 rounded-md px-3 text-app-foreground dark:text-white"
                      />
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-10 w-10 rounded-md bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-400">Font Size</label>
                      <span className="text-sm text-gray-700 dark:text-gray-400">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      min={12}
                      max={32}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                  </div>

                  {/* Font Weight */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-app-foreground dark:text-gray-400">Font Weight</label>
                    <div className="flex gap-2">
                      <Button
                        variant={fontWeight === "normal" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "flex-1",
                          fontWeight === "normal"
                            ? "bg-app-accent dark:bg-gray-700 hover:bg-app-accent/90 dark:hover:bg-gray-600"
                            : "bg-app-muted dark:bg-gray-800 hover:bg-app-muted/90 dark:hover:bg-gray-700",
                        )}
                        onClick={() => setFontWeight("normal")}
                      >
                        Normal
                      </Button>
                      <Button
                        variant={fontWeight === "bold" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "flex-1",
                          fontWeight === "bold"
                            ? "bg-app-accent dark:bg-gray-700 hover:bg-app-accent/90 dark:hover:bg-gray-600"
                            : "bg-app-muted dark:bg-gray-800 hover:bg-app-muted/90 dark:hover:bg-gray-700",
                        )}
                        onClick={() => setFontWeight("bold")}
                      >
                        Bold
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-app-card/80 dark:bg-gray-800/30 p-4 rounded-lg border border-app-card-border dark:border-gray-700/30">
                  <h4 className="text-app-foreground dark:text-white text-sm font-medium">Accessibility Results</h4>

                  {/* Results Card */}
                  <div className="bg-app-muted/50 dark:bg-gray-800/50 rounded-lg border border-app-card-border dark:border-gray-700 p-4 space-y-4">
                    {isChecking ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                      </div>
                    ) : (
                      <>
                        {/* Contrast Ratio */}
                        <div className="flex justify-between items-center">
                          <span className="text-app-foreground dark:text-gray-300">Contrast Ratio:</span>
                          <span className={cn("font-bold text-lg", getContrastRatioColor())}>
                            {contrastRatio.toFixed(2)}:1
                          </span>
                        </div>

                        {/* Recheck Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-app-muted/70 dark:bg-gray-700/50 hover:bg-app-muted dark:hover:bg-gray-700 text-app-foreground dark:text-white flex items-center justify-center gap-2"
                          onClick={checkAccessibility}
                          disabled={isChecking}
                        >
                          {isChecking ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4" />
                              Recheck Accessibility
                            </>
                          )}
                        </Button>

                        {colorsAreTooSimilar && (
                          <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-md">
                            <p className="text-red-600 dark:text-red-300 text-sm flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Warning: Text and background colors are too similar
                            </p>
                          </div>
                        )}

                        {/* WCAG Compliance */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-app-foreground dark:text-gray-300 flex items-center gap-1">
                              <span>WCAG AA</span>
                              <Info className="h-3 w-3 text-app-muted-foreground dark:text-gray-500" />
                            </span>
                            <span>
                              {wcagAA ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-app-foreground dark:text-gray-300 flex items-center gap-1">
                              <span>WCAG AAA</span>
                              <Info className="h-3 w-3 text-app-muted-foreground dark:text-gray-500" />
                            </span>
                            <span>
                              {wcagAAA ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Suggestions */}
                        {!wcagAA && (
                          <div className="pt-2">
                            {!showSuggestions ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-app-muted/70 dark:bg-gray-700/50 hover:bg-app-muted dark:hover:bg-gray-700 text-app-foreground dark:text-white"
                                onClick={handleGetSuggestions}
                              >
                                Get Accessible Text Colors
                              </Button>
                            ) : (
                              <div className="space-y-2">
                                <h5 className="text-sm text-app-foreground dark:text-gray-300">Suggested Colors:</h5>
                                <div className="grid grid-cols-4 gap-2">
                                  {suggestions.map((color, index) => (
                                    <button
                                      key={index}
                                      className="h-8 rounded-md border border-app-card-border dark:border-white/10 transition-transform hover:scale-105"
                                      style={{ backgroundColor: color }}
                                      onClick={() => applyTextColor(color)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Explanation */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-3">
                    <h5 className="text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center gap-1 mb-1">
                      <Info className="h-4 w-4" />
                      Accessibility Guidelines
                    </h5>
                    <p className="text-blue-600 dark:text-gray-300 text-xs">
                      WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large
                      text (18pt+ or 14pt+ bold). Level AAA requires 7:1 for normal text and 4.5:1 for large text.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

