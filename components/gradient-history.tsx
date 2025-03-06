"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Trash2, Clock, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useGradientStore, type GradientHistoryItem } from "@/lib/store"

interface GradientHistoryProps {
  onClose: () => void
}

export function GradientHistory({ onClose }: GradientHistoryProps) {
  const { history, clearHistory, removeFromHistory, applyFromHistory, generateRandomGradient } = useGradientStore()
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)

  // Group history items by date
  const groupHistoryByDate = () => {
    const groups: { [key: string]: GradientHistoryItem[] } = {}

    history.forEach((item) => {
      const date = new Date(item.timestamp)
      const dateKey = format(date, "yyyy-MM-dd")
      const dateLabel = isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy")

      if (!groups[dateLabel]) {
        groups[dateLabel] = []
      }

      groups[dateLabel].push(item)
    })

    return groups
  }

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if date is yesterday
  const isYesterday = (date: Date) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    )
  }

  // Format color class
  const formatColorClass = (prefix: string, colorObj: { color: string; intensity: string }) => {
    // In Tailwind v4, gradient color classes use the 'gradient-' prefix
    const gradientPrefix = `gradient-${prefix}`

    if (colorObj.color === "white") return `${gradientPrefix}-white`
    if (colorObj.color === "transparent") return `${gradientPrefix}-transparent`
    if (colorObj.color === "black") return `${gradientPrefix}-black`
    return `${gradientPrefix}-${colorObj.color}-${colorObj.intensity}`
  }

  // Group history items
  const groupedHistory = groupHistoryByDate()

  // Apply a gradient from history
  const handleApplyFromHistory = (historyItem: GradientHistoryItem) => {
    applyFromHistory(historyItem)
    setSelectedHistoryItem(historyItem.id)

    // Clear selection after a moment
    setTimeout(() => setSelectedHistoryItem(null), 1500)
  }

  // Generate CSS gradient string for a history item
  const getCssGradientForHistoryItem = (item: GradientHistoryItem): string => {
    // Get color values
    const getColorValue = (colorObj: { color: string; intensity: string }): string => {
      if (colorObj.color === "white") return "#ffffff"
      if (colorObj.color === "transparent") return "transparent"
      if (colorObj.color === "black") return "#000000"

      // Use a simplified approach for demo purposes
      // In a real app, you'd use a complete color mapping
      const intensityMap: Record<string, number> = {
        "50": 0.1, "100": 0.2, "200": 0.3, "300": 0.4, "400": 0.5,
        "500": 0.6, "600": 0.7, "700": 0.8, "800": 0.9, "900": 1.0
      }

      // Return a representative color based on the color name and intensity
      switch (colorObj.color) {
        case "red": return `rgba(220, 38, 38, ${intensityMap[colorObj.intensity]})`
        case "blue": return `rgba(37, 99, 235, ${intensityMap[colorObj.intensity]})`
        case "green": return `rgba(22, 163, 74, ${intensityMap[colorObj.intensity]})`
        case "purple": return `rgba(147, 51, 234, ${intensityMap[colorObj.intensity]})`
        case "pink": return `rgba(236, 72, 153, ${intensityMap[colorObj.intensity]})`
        case "yellow": return `rgba(234, 179, 8, ${intensityMap[colorObj.intensity]})`
        case "orange": return `rgba(249, 115, 22, ${intensityMap[colorObj.intensity]})`
        case "teal": return `rgba(20, 184, 166, ${intensityMap[colorObj.intensity]})`
        case "indigo": return `rgba(79, 70, 229, ${intensityMap[colorObj.intensity]})`
        case "gray": return `rgba(107, 114, 128, ${intensityMap[colorObj.intensity]})`
        default: return `rgba(100, 100, 100, ${intensityMap[colorObj.intensity]})`
      }
    }

    // Build the gradient string based on type
    let gradientString = ""

    // Handle different gradient types
    const gradientType = item.gradientType || "linear" // Default to linear for backward compatibility

    if (gradientType === "linear") {
      if (item.direction === "custom-angle") {
        // Use custom angle
        const angle = item.gradientAngle || 0
        gradientString = `linear-gradient(${angle}deg`
      } else {
        // Get the CSS direction from the Tailwind direction class
        const directionMap: Record<string, string> = {
          "bg-gradient-to-r": "to right",
          "bg-gradient-to-l": "to left",
          "bg-gradient-to-t": "to top",
          "bg-gradient-to-b": "to bottom",
          "bg-gradient-to-tr": "to top right",
          "bg-gradient-to-tl": "to top left",
          "bg-gradient-to-br": "to bottom right",
          "bg-gradient-to-bl": "to bottom left",
          "bg-linear-to-r": "to right",
          "bg-linear-to-l": "to left",
          "bg-linear-to-t": "to top",
          "bg-linear-to-b": "to bottom",
          "bg-linear-to-tr": "to top right",
          "bg-linear-to-tl": "to top left",
          "bg-linear-to-br": "to bottom right",
          "bg-linear-to-bl": "to bottom left",
        }
        const cssDirection = directionMap[item.direction] || "to right"
        gradientString = `linear-gradient(${cssDirection}`
      }
    } else if (gradientType === "radial") {
      // Handle radial gradient positions
      let position = "center"
      if (item.direction === "radial-at-t") position = "top"
      else if (item.direction === "radial-at-b") position = "bottom"
      else if (item.direction === "radial-at-l") position = "left"
      else if (item.direction === "radial-at-r") position = "right"
      else if (item.direction === "radial-at-c") position = "center"

      gradientString = `radial-gradient(circle at ${position}`
    } else if (gradientType === "conic") {
      // Handle conic gradient positions
      let position = "center"
      if (item.direction === "conic-at-t") position = "top center"
      else if (item.direction === "conic-at-b") position = "bottom center"
      else if (item.direction === "conic-at-c") position = "center"

      const angle = item.gradientAngle || 0
      gradientString = `conic-gradient(from ${angle}deg at ${position}`
    }

    // Add the colors
    gradientString += `, ${getColorValue(item.fromColor)}`
    if (item.useVia && item.viaColor) {
      gradientString += `, ${getColorValue(item.viaColor)}`
    }
    gradientString += `, ${getColorValue(item.toColor)})`

    return gradientString
  }

  // Remove a single item from history
  const handleRemoveFromHistory = (id: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the parent click
    removeFromHistory(id)
  }

  // Handle clearing all history
  const handleClearHistory = async () => {
    setIsClearing(true)
    try {
      await clearHistory()
      // Force a reload to ensure everything is cleared
      window.location.reload()
    } catch (error) {
      console.error("Error clearing history:", error)
      setIsClearing(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center p-3 border-b border-app-card-border dark:border-white/10 sticky top-0 bg-app-card/95 dark:bg-gray-900/95 z-10">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <h3 className="text-app-foreground dark:text-white font-medium">Gradient History</h3>
          <span className="text-xs text-app-muted-foreground dark:text-gray-400">Last {history.length} gradients</span>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white"
              onClick={handleClearHistory}
              disabled={isClearing}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isClearing ? "Clearing..." : "Clear All"}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(70vh-48px)]">
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-3 text-app-muted-foreground dark:text-gray-600" />
            <h4 className="text-app-foreground dark:text-white font-medium mb-2">No gradient history yet</h4>
            <p className="text-sm text-app-muted-foreground dark:text-gray-400 max-w-md mx-auto mb-4">
              Your gradient history will appear here as you create and modify gradients. We automatically save your last
              20 gradients.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-app-muted/50 dark:bg-gray-800/50 text-app-foreground dark:text-white border-app-card-border dark:border-gray-700 hover:bg-app-muted dark:hover:bg-gray-700/50"
              onClick={() => {
                generateRandomGradient()
                onClose()
              }}
            >
              <Shuffle className="h-3 w-3 mr-2" />
              Generate Random Gradient
            </Button>
          </div>
        ) : (
          <div className="p-3">
            {Object.entries(groupedHistory).map(([dateLabel, items]) => (
              <div key={dateLabel} className="mb-4">
                <h4 className="text-sm text-gray-400 mb-2 px-2">{dateLabel}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <div key={item.id} className="relative group">
                      <button
                        className={cn(
                          "w-full rounded-lg overflow-hidden h-20 cursor-pointer transition-all",
                          selectedHistoryItem === item.id ? "ring-2 ring-white" : "hover:ring-2 hover:ring-white/20",
                        )}
                        onClick={() => handleApplyFromHistory(item)}
                      >
                        <div
                          className="w-full h-full"
                          style={{ background: getCssGradientForHistoryItem(item) }}
                        />
                      </button>
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0 bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white"
                          onClick={(e) => handleRemoveFromHistory(item.id, e)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs bg-black/40 backdrop-blur-xs text-white px-1.5 py-0.5 rounded">
                          {format(new Date(item.timestamp), "h:mm a")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-3 border-t border-app-card-border dark:border-white/10 bg-app-card/80 dark:bg-gray-900/80">
          <p className="text-xs text-app-muted-foreground dark:text-gray-400 text-center">
            Click on any gradient to apply it to the editor
          </p>
        </div>
      )}
    </>
  )
}

