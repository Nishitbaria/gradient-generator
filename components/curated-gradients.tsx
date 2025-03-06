"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, LayoutGrid, Palette, X, Check, Heart, BookmarkIcon, ChevronDown } from "lucide-react"
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

  // Popular trending gradients
  // Instagram-inspired gradient
  { from: "purple-500", via: "pink-500", to: "yellow-500", colors: ["#a855f7", "#ec4899", "#eab308"] },

  // Spotify-inspired gradient
  { from: "green-400", to: "black", colors: ["#4ade80", "#000000"] },

  // Discord-inspired gradient
  { from: "indigo-500", to: "purple-600", colors: ["#6366f1", "#9333ea"] },

  // Sunset gradient
  { from: "orange-400", via: "pink-500", to: "purple-600", colors: ["#fb923c", "#ec4899", "#9333ea"] },

  // Ocean gradient
  { from: "cyan-400", via: "blue-500", to: "blue-800", colors: ["#22d3ee", "#3b82f6", "#1e40af"] },

  // Forest gradient
  { from: "green-300", via: "emerald-500", to: "teal-700", colors: ["#86efac", "#10b981", "#0f766e"] },

  // Midnight gradient
  { from: "blue-900", via: "indigo-800", to: "purple-900", colors: ["#1e3a8a", "#3730a3", "#581c87"] },

  // Sunrise gradient
  { from: "yellow-300", via: "orange-400", to: "red-500", colors: ["#fde047", "#fb923c", "#ef4444"] },

  // Cotton candy gradient
  { from: "pink-300", via: "purple-300", to: "indigo-400", colors: ["#f9a8d4", "#d8b4fe", "#818cf8"] },

  // Mojito gradient
  { from: "lime-300", via: "green-400", to: "emerald-600", colors: ["#bef264", "#4ade80", "#059669"] },

  // Twilight gradient
  { from: "purple-800", via: "pink-700", to: "rose-600", colors: ["#6b21a8", "#be185d", "#e11d48"] },

  // Northern Lights gradient
  { from: "teal-300", via: "blue-500", to: "purple-600", colors: ["#5eead4", "#3b82f6", "#9333ea"] },

  // Peach gradient
  { from: "red-200", via: "orange-200", to: "yellow-200", colors: ["#fecaca", "#fed7aa", "#fef08a"] },

  // Blueberry gradient
  { from: "blue-400", via: "indigo-500", to: "purple-700", colors: ["#60a5fa", "#6366f1", "#7e22ce"] },

  // Mint gradient
  { from: "green-200", via: "emerald-300", to: "teal-400", colors: ["#bbf7d0", "#6ee7b7", "#2dd4bf"] },

  // Flamingo gradient
  { from: "pink-400", via: "rose-500", to: "orange-500", colors: ["#f472b6", "#f43f5e", "#f97316"] },

  // Cyberpunk gradient
  { from: "fuchsia-500", via: "purple-600", to: "blue-700", colors: ["#d946ef", "#9333ea", "#1d4ed8"] },

  // Retro wave gradient
  { from: "indigo-600", via: "purple-600", to: "pink-600", colors: ["#4f46e5", "#9333ea", "#db2777"] },

  // Pastel dream gradient
  { from: "blue-200", via: "pink-200", to: "yellow-200", colors: ["#bfdbfe", "#fbcfe8", "#fef08a"] },
]

// Define a type for the gradient object
type Gradient = {
  from: string;
  via?: string;
  to: string;
  colors: string[];
};

// Add a function to filter gradients based on selected color
const filterGradientsByColor = (gradients: Gradient[], selectedColor: string | null) => {
  if (!selectedColor) return gradients

  return gradients.filter((gradient: Gradient) => {
    // Check if any of the gradient's colors are similar to the selected color
    return gradient.colors.some((color: string) => {
      return isSimilarColor(color, selectedColor)
    })
  })
}

// Add a function to check if colors are similar
const isSimilarColor = (color1: string, color2: string) => {
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
const hexToRgb = (hex: string) => {
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

// Helper function to convert Tailwind color names to hex values
const getTailwindColor = (colorName: string) => {
  // Parse the color name format like "blue-500"
  const [color, intensity] = colorName.split('-');

  // Tailwind color mapping
  const colorMap: Record<string, Record<string, string>> = {
    slate: {
      "50": "#f8fafc", "100": "#f1f5f9", "200": "#e2e8f0", "300": "#cbd5e1",
      "400": "#94a3b8", "500": "#64748b", "600": "#475569", "700": "#334155",
      "800": "#1e293b", "900": "#0f172a"
    },
    gray: {
      "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db",
      "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151",
      "800": "#1f2937", "900": "#111827"
    },
    zinc: {
      "50": "#fafafa", "100": "#f4f4f5", "200": "#e4e4e7", "300": "#d4d4d8",
      "400": "#a1a1aa", "500": "#71717a", "600": "#52525b", "700": "#3f3f46",
      "800": "#27272a", "900": "#18181b"
    },
    red: {
      "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5",
      "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c",
      "800": "#991b1b", "900": "#7f1d1d"
    },
    orange: {
      "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74",
      "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c",
      "800": "#9a3412", "900": "#7c2d12"
    },
    amber: {
      "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d",
      "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309",
      "800": "#92400e", "900": "#78350f"
    },
    yellow: {
      "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047",
      "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207",
      "800": "#854d0e", "900": "#713f12"
    },
    lime: {
      "50": "#f7fee7", "100": "#ecfccb", "200": "#d9f99d", "300": "#bef264",
      "400": "#a3e635", "500": "#84cc16", "600": "#65a30d", "700": "#4d7c0f",
      "800": "#3f6212", "900": "#365314"
    },
    green: {
      "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac",
      "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d",
      "800": "#166534", "900": "#14532d"
    },
    emerald: {
      "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7",
      "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857",
      "800": "#065f46", "900": "#064e3b"
    },
    teal: {
      "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4",
      "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e",
      "800": "#115e59", "900": "#134e4a"
    },
    cyan: {
      "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9",
      "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490",
      "800": "#155e75", "900": "#164e63"
    },
    sky: {
      "50": "#f0f9ff", "100": "#e0f2fe", "200": "#bae6fd", "300": "#7dd3fc",
      "400": "#38bdf8", "500": "#0ea5e9", "600": "#0284c7", "700": "#0369a1",
      "800": "#075985", "900": "#0c4a6e"
    },
    blue: {
      "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd",
      "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8",
      "800": "#1e40af", "900": "#1e3a8a"
    },
    indigo: {
      "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc",
      "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca",
      "800": "#3730a3", "900": "#312e81"
    },
    violet: {
      "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe", "300": "#c4b5fd",
      "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9",
      "800": "#5b21b6", "900": "#4c1d95"
    },
    purple: {
      "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe",
      "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce",
      "800": "#6b21a8", "900": "#581c87"
    },
    fuchsia: {
      "50": "#fdf4ff", "100": "#fae8ff", "200": "#f5d0fe", "300": "#f0abfc",
      "400": "#e879f9", "500": "#d946ef", "600": "#c026d3", "700": "#a21caf",
      "800": "#86198f", "900": "#701a75"
    },
    pink: {
      "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4",
      "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d",
      "800": "#9d174d", "900": "#831843"
    },
    rose: {
      "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af",
      "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c",
      "800": "#9f1239", "900": "#881337"
    },
    white: { "DEFAULT": "#ffffff" },
    black: { "DEFAULT": "#000000" }
  };

  // Handle special cases
  if (color === "white") return "#ffffff";
  if (color === "black") return "#000000";
  if (color === "transparent") return "transparent";

  // Return the hex color or a fallback
  return colorMap[color]?.[intensity] || "#888888";
}

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
  const isFavorite = (gradient: Gradient) => {
    return favorites.some((fav) => fav.from === gradient.from && fav.to === gradient.to && fav.via === gradient.via)
  }

  // Toggle favorite status
  const toggleFavorite = (gradient: Gradient) => {
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
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(gradient).then(() => {
          setCopiedIndex(index)
          setTimeout(() => setCopiedIndex(null), 2000)
        })
      } else {
        // Fallback for browsers that don't support the Clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = gradient
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          setCopiedIndex(index)
          setTimeout(() => setCopiedIndex(null), 2000)
        } catch (err) {
          console.error('Failed to copy text: ', err)
        }
        textArea.remove()
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
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
                    className={`w-10 h-10 rounded-full focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-white/20 ${selectedColor === color ? "ring-2 ring-white" : ""}`}
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
              displayedGradients.map((gradient: Gradient, index: number) => (
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
                    style={{
                      width: '100%',
                      height: '100%',
                      background: gradient.via
                        ? `linear-gradient(to bottom right, ${getTailwindColor(gradient.from)}, ${getTailwindColor(gradient.via)}, ${getTailwindColor(gradient.to)})`
                        : `linear-gradient(to bottom right, ${getTailwindColor(gradient.from)}, ${getTailwindColor(gradient.to)})`
                    }}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white hover:text-white"
                      onClick={() =>
                        copyGradient(
                          gradient.via
                            ? `bg-linear-to-br gradient-from-${gradient.from} gradient-via-${gradient.via} gradient-to-${gradient.to}`
                            : `bg-linear-to-br gradient-from-${gradient.from} gradient-to-${gradient.to}`,
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

