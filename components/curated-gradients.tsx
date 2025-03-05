"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, LayoutGrid, Palette, X, Check, Heart, Share2, BookmarkIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile, useDevicePerformance } from "@/lib/hooks/use-device-detection"
import { OptimizedMotion } from "@/components/optimized-motion"

// Update the GRADIENT_PRESETS array to include more gradients
const GRADIENT_PRESETS = [
  // Original gradients
  { from: "yellow-200", to: "yellow-500", colors: ["#fef08a", "#eab308"] },
  { from: "gray-900", to: "gray-600", colors: ["#111827", "#4b5563"] },
  { from: "emerald-300", to: "emerald-800", colors: ["#6ee7b7", "#065f46"] },
  { from: "pink-300", to: "pink-600", colors: ["#f9a8d4", "#db2777"] },
  { from: "rose-400", to: "purple-600", colors: ["#fb7185", "#9333ea"] },
  { from: "slate-900", via: "purple-900", to: "orange-500", colors: ["#0f172a", "#581c87", "#f97316"] },
  { from: "red-400", to: "red-700", colors: ["#f87171", "#b91c1c"] },
  { from: "blue-300", to: "blue-600", colors: ["#93c5fd", "#2563eb"] },
  { from: "green-200", to: "green-700", colors: ["#bbf7d0", "#15803d"] },
  { from: "indigo-400", to: "purple-500", colors: ["#818cf8", "#a855f7"] },
  { from: "amber-200", to: "orange-600", colors: ["#fde68a", "#ea580c"] },
  { from: "teal-300", to: "cyan-700", colors: ["#5eead4", "#0e7490"] },

  // New gradients
  { from: "blue-500", to: "purple-500", colors: ["#3b82f6", "#a855f7"] },
  { from: "green-400", to: "blue-500", colors: ["#4ade80", "#3b82f6"] },
  { from: "yellow-300", to: "red-500", colors: ["#fde047", "#ef4444"] },
  { from: "pink-500", to: "rose-500", colors: ["#ec4899", "#f43f5e"] },
  { from: "indigo-500", to: "cyan-400", colors: ["#6366f1", "#22d3ee"] },
  { from: "purple-600", via: "pink-500", to: "orange-400", colors: ["#9333ea", "#ec4899", "#fb923c"] },
  { from: "blue-700", via: "blue-400", to: "emerald-400", colors: ["#1d4ed8", "#60a5fa", "#34d399"] },
  { from: "red-500", via: "purple-500", to: "blue-500", colors: ["#ef4444", "#a855f7", "#3b82f6"] },
  { from: "slate-800", to: "slate-500", colors: ["#1e293b", "#64748b"] },
  { from: "zinc-800", to: "zinc-400", colors: ["#27272a", "#a1a1aa"] },
  { from: "stone-800", to: "amber-400", colors: ["#292524", "#fbbf24"] },
  { from: "sky-400", to: "indigo-900", colors: ["#38bdf8", "#312e81"] },
  { from: "violet-500", to: "fuchsia-500", colors: ["#8b5cf6", "#d946ef"] },
  { from: "lime-500", to: "emerald-500", colors: ["#84cc16", "#10b981"] },
  { from: "rose-500", to: "indigo-700", colors: ["#f43f5e", "#4338ca"] },
  { from: "amber-300", to: "pink-500", colors: ["#fcd34d", "#ec4899"] },
  { from: "cyan-500", to: "blue-900", colors: ["#06b6d4", "#1e3a8a"] },
  { from: "fuchsia-600", to: "pink-400", colors: ["#c026d3", "#f472b6"] },
  { from: "green-500", via: "cyan-400", to: "blue-500", colors: ["#22c55e", "#22d3ee", "#3b82f6"] },
  { from: "purple-500", via: "pink-500", to: "red-500", colors: ["#a855f7", "#ec4899", "#ef4444"] },
  { from: "yellow-400", via: "orange-500", to: "red-600", colors: ["#facc15", "#f97316", "#dc2626"] },
  { from: "blue-600", via: "indigo-600", to: "purple-600", colors: ["#2563eb", "#4f46e5", "#9333ea"] },
  { from: "emerald-500", via: "teal-500", to: "cyan-500", colors: ["#10b981", "#14b8a6", "#06b6d4"] },
  { from: "slate-900", via: "slate-700", to: "slate-500", colors: ["#0f172a", "#334155", "#64748b"] },
]

// Add a function to filter gradients based on selected color
const filterGradientsByColor = (gradients, selectedColor) => {
  if (!selectedColor) return gradients

  return gradients.filter((gradient) => {
    // Check if any of the gradient's colors are similar to the selected color
    return gradient.colors.some((color) => {
      return isSimilarColor(color, selectedColor)
    })
  })
}

// Add a function to check if colors are similar
const isSimilarColor = (color1, color2) => {
  // Convert hex to RGB
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return false

  // Calculate color distance (simple Euclidean distance)
  const distance = Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2))

  // Colors are similar if distance is below threshold
  return distance < 100 // Adjust threshold as needed
}

// Add a function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

// Color palette for filter
const COLOR_PALETTE = [
  "#E2E2E2", // white
  "#FF1493", // deep pink
  "#FFA500", // orange
  "#FFD700", // gold
  "#32CD32", // lime green
  "#00BFFF", // deep sky blue
  "#8A2BE2", // blue violet
  "#000000", // black
  "#4B0082", // indigo
  "#DC143C", // crimson
  "#2E8B57", // sea green
  "#8B4513", // saddle brown
  "#4682B4", // steel blue
  "#FFC0CB", // pink
  "#98FB98", // pale green
  "#DEB887", // burlywood
  "#FF6347", // tomato
  "#DAA520", // goldenrod
  "#FF4500", // orange red
  "#7FFFD4", // aquamarine
  "#9370DB", // medium purple
  "#800080", // purple
  "#FF0000", // red
  "#1E90FF", // dodger blue
  "#FFFF00", // yellow
  "#008080", // teal
  "#556B2F", // dark olive green
  "#F4A460", // sandy brown
  "#CD5C5C", // indian red
  "#40E0D0", // turquoise
]

type LayoutType = "2" | "3" | "4"

// Update the CuratedGradients component to use the filtering logic
export function CuratedGradients() {
  // Favorites system
  const [favorites, setFavorites] = useState<typeof GRADIENT_PRESETS>([])
  const [activeTab, setActiveTab] = useState("all") // "all" or "favorites"
  const isMobile = useIsMobile()
  const devicePerformance = useDevicePerformance()

  // Add state for pagination
  const [displayCount, setDisplayCount] = useState(15)
  const [isLoading, setIsLoading] = useState(false)

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("gradient-favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (e) {
        console.error("Failed to parse favorites:", e)
      }
    }
  }, [])

  // Check if a gradient is in favorites
  const isFavorite = (gradient) => {
    return favorites.some((fav) => fav.from === gradient.from && fav.to === gradient.to && fav.via === gradient.via)
  }

  // Toggle favorite status
  const toggleFavorite = (gradient) => {
    let newFavorites

    if (isFavorite(gradient)) {
      // Remove from favorites
      newFavorites = favorites.filter(
        (fav) => !(fav.from === gradient.from && fav.to === gradient.to && fav.via === gradient.via),
      )
    } else {
      // Add to favorites
      newFavorites = [...favorites, gradient]
    }

    setFavorites(newFavorites)
    localStorage.setItem("gradient-favorites", JSON.stringify(newFavorites))
  }

  const [layout, setLayout] = useState<LayoutType>(isMobile ? "2" : "3")
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const layoutMenuRef = useRef<HTMLDivElement>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedShareIndex, setCopiedShareIndex] = useState<number | null>(null)

  // Update layout when mobile status changes
  useEffect(() => {
    setLayout(isMobile ? "2" : "3")
  }, [isMobile])

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false)
      }
      if (layoutMenuRef.current && !layoutMenuRef.current.contains(event.target as Node)) {
        setIsLayoutMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const copyGradient = (gradient: string, index: number) => {
    try {
      navigator.clipboard.writeText(gradient)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err)
      // Could add error feedback here
    }
  }

  // Generate shareable link
  const shareGradient = (gradient, index) => {
    const params = new URLSearchParams()
    params.set("dir", "br") // Default to bottom-right
    params.set("from", gradient.from)
    if (gradient.via) params.set("via", gradient.via)
    params.set("to", gradient.to)

    const shareableUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`

    // Use Web Share API on mobile if available
    if (isMobile && navigator.share) {
      navigator
        .share({
          title: "Tailwind Gradient",
          text: "Check out this gradient I created!",
          url: shareableUrl,
        })
        .catch((err) => {
          // Fallback to clipboard if share fails
          navigator.clipboard.writeText(shareableUrl).then(() => {
            setCopiedShareIndex(index)
            setTimeout(() => setCopiedShareIndex(null), 2000)
          })
        })
      return
    }

    // Default clipboard behavior
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        // Show feedback that URL was copied
        setCopiedShareIndex(index)
        setTimeout(() => setCopiedShareIndex(null), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err)
        alert("Failed to copy link. Please try again.")
      })
  }

  // Filter gradients based on selected color
  const filteredGradients = filterGradientsByColor(activeTab === "all" ? GRADIENT_PRESETS : favorites, selectedColor)

  // Get the gradients to display based on the current display count
  const displayedGradients = filteredGradients.slice(0, displayCount)

  // Check if there are more gradients to load
  const hasMoreGradients = displayedGradients.length < filteredGradients.length

  // Function to load more gradients
  const loadMoreGradients = () => {
    setIsLoading(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayCount((prevCount) => prevCount + 12)
      setIsLoading(false)
    }, 500)
  }

  // Determine animation delay factor based on device performance
  const getAnimationDelay = (index: number) => {
    if (devicePerformance === "low" || isMobile) {
      return 0.03 * Math.min(index, 5) // Limit delay on mobile/low-end devices
    }
    return 0.1 * index // Full animation on desktop
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4 animate-sparkles">Curated Gradients</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our collection of carefully crafted gradients, from subtle transitions to vibrant color combinations.
        </p>
      </div>

      {/* Tabs for All/Favorites */}
      <div className="flex justify-center mb-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              All Gradients
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <BookmarkIcon className="h-4 w-4" />
              My Favorites
              {favorites.length > 0 && (
                <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{favorites.length}</span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative" ref={colorPickerRef}>
          <Button
            variant="outline"
            className={`bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 text-app-foreground dark:text-white hover:text-app-foreground dark:hover:text-white hover:bg-app-muted dark:hover:bg-[#1A2237] hover:border-app-muted-foreground/30 dark:hover:border-white/10 ${selectedColor ? "ring-2 ring-app-accent dark:ring-white/20" : ""}`}
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          >
            <Palette className="h-4 w-4 mr-2" />
            {selectedColor ? "Filtered by Color" : "Filter by Color"}
          </Button>

          {isColorPickerOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-app-card dark:bg-[#0F1629] border border-app-card-border dark:border-white/5 rounded-lg p-4 shadow-xl z-50">
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PALETTE.map((color, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 ${selectedColor === color ? "ring-2 ring-white" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color === selectedColor ? null : color)
                    }}
                  />
                ))}
              </div>
              {selectedColor && (
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white"
                    onClick={() => {
                      setSelectedColor(null)
                    }}
                  >
                    Clear Filter
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={layoutMenuRef}>
          <Button
            variant="outline"
            className="bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 text-app-foreground dark:text-white hover:text-app-foreground dark:hover:text-white hover:bg-app-muted dark:hover:bg-[#1A2237] hover:border-app-muted-foreground/30 dark:hover:border-white/10"
            onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Layout
          </Button>

          {isLayoutMenuOpen && (
            <div className="absolute top-full left-0 mt-2 bg-app-card dark:bg-[#0F1629] border border-app-card-border dark:border-white/5 rounded-lg shadow-xl z-50">
              {["2", "3", "4"].map((cols) => (
                <button
                  key={cols}
                  className={`block w-full px-4 py-2 text-sm text-app-foreground dark:text-white hover:bg-app-muted dark:hover:bg-[#1A2237] text-left ${layout === cols ? "bg-app-muted dark:bg-[#1A2237]" : ""}`}
                  onClick={() => {
                    setLayout(cols as LayoutType)
                    setIsLayoutMenuOpen(false)
                  }}
                >
                  {cols} Columns
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtered Status */}
      {selectedColor && (
        <div className="mb-6 flex items-center justify-between bg-app-muted/50 dark:bg-[#0F1629]/50 p-3 rounded-lg border border-app-card-border dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }}></div>
            <p className="text-app-foreground/80 dark:text-white/80 text-sm">Showing gradients with similar colors</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white p-0 h-8 w-8"
            onClick={() => setSelectedColor(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty Favorites Message */}
      {activeTab === "favorites" && favorites.length === 0 && (
        <div className="text-center py-12 bg-app-muted/30 dark:bg-gray-900/30 rounded-xl border border-app-card-border dark:border-white/5">
          <BookmarkIcon className="h-12 w-12 text-app-muted-foreground dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-app-foreground dark:text-white mb-2">No favorites yet</h3>
          <p className="text-app-muted-foreground dark:text-gray-400 max-w-md mx-auto mb-6">
            Click the heart icon on any gradient to add it to your favorites for quick access.
          </p>
          <Button
            variant="outline"
            className="bg-app-muted/50 dark:bg-gray-800/50 text-app-foreground dark:text-white border-app-card-border dark:border-gray-700 hover:bg-app-muted dark:hover:bg-gray-700/50"
            onClick={() => setActiveTab("all")}
          >
            Browse All Gradients
          </Button>
        </div>
      )}

      {/* Gradient Grid */}
      {(activeTab !== "favorites" || favorites.length > 0) && (
        <>
          <div
            className={cn("grid gap-6", {
              "grid-cols-1 md:grid-cols-2": layout === "2",
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": layout === "3",
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": layout === "4",
            })}
          >
            {displayedGradients.length > 0 ? (
              displayedGradients.map((gradient, index) => (
                <OptimizedMotion
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: getAnimationDelay(index) }}
                  // Mobile-specific props
                  mobileProps={{
                    transition: { delay: getAnimationDelay(index), duration: 0.2 },
                  }}
                  // Low-performance props
                  lowPerformanceProps={{
                    transition: { delay: index < 6 ? 0.05 * index : 0, duration: 0.2 },
                  }}
                  className="group relative aspect-video rounded-xl overflow-hidden"
                >
                  <div
                    className={cn(
                      "w-full h-full bg-gradient-to-br",
                      `from-${gradient.from}`,
                      gradient.via && `via-${gradient.via}`,
                      `to-${gradient.to}`,
                    )}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white hover:text-white"
                      onClick={() =>
                        copyGradient(
                          `bg-gradient-to-br ${gradient.via ? `from-${gradient.from} via-${gradient.via} to-${gradient.to}` : `from-${gradient.from} to-${gradient.to}`` via-${gradient.via} to-${gradient.to}\` : \`from-${gradient.from} to-${gradient.to}`}`,
                          index,
                        )
                      }
                    >
                      {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                      onClick={() => toggleFavorite(gradient)}
                    >
                      {isFavorite(gradient) ? <Heart className="h-4 w-4 fill-white" /> : <Heart className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                      onClick={() => shareGradient(gradient, index)}
                    >
                      {copiedShareIndex === index ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </OptimizedMotion>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-white/70 text-lg">No gradients match the selected color filter.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50"
                  onClick={() => setSelectedColor(null)}
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMoreGradients && (
            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 text-app-foreground dark:text-white hover:text-app-foreground dark:hover:text-white hover:bg-app-muted dark:hover:bg-[#1A2237] hover:border-app-muted-foreground/30 dark:hover:border-white/10"
                onClick={loadMoreGradients}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-5 w-5 mr-2" />
                    Load More Gradients
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

