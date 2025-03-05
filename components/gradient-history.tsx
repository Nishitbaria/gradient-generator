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
    if (colorObj.color === "white") return `${prefix}-white`
    if (colorObj.color === "transparent") return `${prefix}-transparent`
    if (colorObj.color === "black") return `${prefix}-black`
    return `${prefix}-${colorObj.color}-${colorObj.intensity}`
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

  // Remove a single item from history
  const handleRemoveFromHistory = (id: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the parent click
    removeFromHistory(id)
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
              onClick={clearHistory}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
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
                          className={cn(
                            "w-full h-full",
                            item.direction,
                            formatColorClass("from", item.fromColor),
                            item.useVia && item.viaColor ? formatColorClass("via", item.viaColor) : "",
                            formatColorClass("to", item.toColor),
                          )}
                        />
                      </button>
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white"
                          onClick={(e) => handleRemoveFromHistory(item.id, e)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs bg-black/40 backdrop-blur-sm text-white px-1.5 py-0.5 rounded">
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

