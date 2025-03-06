"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/lib/hooks/use-device-detection"

interface ColorSelectorProps {
  selectedColor: string
  selectedIntensity: string
  onColorChange: (color: string, intensity: string) => void
  onIntensityChange: (intensity: string) => void
  colors: string[]
  intensities: string[]
}

export function ColorSelector({
  selectedColor,
  selectedIntensity,
  onColorChange,
  onIntensityChange,
  colors,
  intensities
}: ColorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Get background color class for the color preview
  const getColorClass = (colorName: string, colorIntensity: string) => {
    if (colorName === "transparent") return "bg-transparent"
    if (colorName === "white") return "bg-white"
    if (colorName === "black") return "bg-black"

    // Use inline style for color preview instead of Tailwind classes
    // This ensures compatibility with Tailwind v4
    return `bg-${colorName}-${colorIntensity}`
  }

  // Helper function to get the actual color value for the preview
  const getColorValue = (colorName: string, colorIntensity: string): string => {
    // Basic color mapping for common colors
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
      red: {
        "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5",
        "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c",
        "800": "#991b1b", "900": "#7f1d1d"
      },
      blue: {
        "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd",
        "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8",
        "800": "#1e40af", "900": "#1e3a8a"
      },
      green: {
        "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac",
        "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d",
        "800": "#166534", "900": "#14532d"
      },
      yellow: {
        "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047",
        "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207",
        "800": "#854d0e", "900": "#713f12"
      },
      purple: {
        "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe",
        "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce",
        "800": "#6b21a8", "900": "#581c87"
      },
      pink: {
        "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4",
        "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d",
        "800": "#9d174d", "900": "#831843"
      },
      orange: {
        "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74",
        "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c",
        "800": "#9a3412", "900": "#7c2d12"
      },
      // Add more colors as needed
    }

    if (colorName === "transparent") return "transparent"
    if (colorName === "white") return "#ffffff"
    if (colorName === "black") return "#000000"

    return colorMap[colorName]?.[colorIntensity] || "#64748b" // Default to slate-500 if not found
  }

  // Generate all available color options
  const generateColorOptions = () => {
    const options = []

    // Add special colors
    options.push({ label: `gradient-white`, value: "white", intensity: "" })
    options.push({ label: `gradient-transparent`, value: "transparent", intensity: "" })
    options.push({ label: `gradient-black`, value: "black", intensity: "" })

    // Add all color-intensity combinations
    for (const c of colors) {
      for (const i of intensities) {
        options.push({
          label: `gradient-${c}-${i}`,
          value: c,
          intensity: i,
        })
      }
    }

    // Filter by search query if present
    if (searchQuery) {
      return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return options
  }

  const colorOptions = generateColorOptions()

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="text-sm font-medium text-white/80 mb-2">Color</div>
      <motion.button
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-app-card-border dark:border-white/5 bg-app-card dark:bg-[#0F1629] hover:bg-app-muted dark:hover:bg-[#1A2237] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-4 md:w-5 h-4 md:h-5 rounded-full"
            style={{
              backgroundColor: selectedColor === "transparent"
                ? "transparent"
                : getColorValue(selectedColor, selectedIntensity),
              border: selectedColor === "transparent" ? "1px solid rgba(156, 163, 175, 0.5)" : "none"
            }}
          />
          <span className="font-medium text-sm md:text-base">
            {`gradient-${selectedColor}${selectedIntensity ? `-${selectedIntensity}` : ''}`}
          </span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-100 mt-2 w-full bg-app-card dark:bg-[#0F1629] border border-app-card-border dark:border-white/5 rounded-lg md:rounded-xl shadow-xl overflow-hidden"
            style={{ maxHeight: isMobile ? "50vh" : "70vh" }}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 border-b border-app-card-border dark:border-white/5 sticky top-0 bg-app-card dark:bg-[#0F1629] z-10">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search colors..."
                  className="w-full pl-9 pr-4 py-2 bg-app-muted dark:bg-[#1A2237] border border-app-card-border dark:border-white/5 rounded-lg text-app-foreground dark:text-white text-sm focus:outline-hidden focus:ring-1 focus:ring-app-accent dark:focus:ring-white/20 focus:border-transparent placeholder-app-muted-foreground dark:placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] md:max-h-[60vh] py-1 overscroll-contain">
              {colorOptions.map((option, index) => {
                const isSelected =
                  option.value === selectedColor &&
                  (option.intensity === selectedIntensity ||
                    (option.value === "white" && selectedColor === "white") ||
                    (option.value === "black" && selectedColor === "black") ||
                    (option.value === "transparent" && selectedColor === "transparent"))

                return (
                  <motion.button
                    key={index}
                    className={cn(
                      "w-full text-left px-3 py-2 flex items-center hover:bg-app-muted dark:hover:bg-[#1A2237] transition-colors",
                      isSelected && "bg-app-muted dark:bg-[#1A2237]",
                    )}
                    onClick={() => {
                      onColorChange(option.value, option.intensity)
                      setIsOpen(false)
                      setSearchQuery("")
                    }}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.01 }}
                  >
                    <div
                      className="w-4 md:w-5 h-4 md:h-5 rounded-full mr-3"
                      style={{
                        backgroundColor: option.value === "transparent"
                          ? "transparent"
                          : getColorValue(option.value, option.intensity),
                        border: option.value === "transparent" ? "1px solid rgba(156, 163, 175, 0.5)" : "none"
                      }}
                    />
                    <span className="text-sm text-app-foreground/90 dark:text-white/90">{option.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

