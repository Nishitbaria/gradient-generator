"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/lib/hooks/use-device-detection"

interface ColorSelectorProps {
  label: string
  value: string
  color: string
  intensity: string
  onChange: (color: string, intensity: string) => void
  colors: string[]
  intensities: string[]
}

export function ColorSelector({ label, value, color, intensity, onChange, colors, intensities }: ColorSelectorProps) {
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
    return `bg-${colorName}-${colorIntensity}`
  }

  // Generate all available color options
  const generateColorOptions = () => {
    const options = []

    // Add special colors
    options.push({ label: `${label.toLowerCase()}-white`, value: "white", intensity: "" })
    options.push({ label: `${label.toLowerCase()}-transparent`, value: "transparent", intensity: "" })
    options.push({ label: `${label.toLowerCase()}-black`, value: "black", intensity: "" })

    // Add all color-intensity combinations
    for (const c of colors) {
      for (const i of intensities) {
        options.push({
          label: `${label.toLowerCase()}-${c}-${i}`,
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
      <div className="text-sm font-medium text-white/80 mb-2">{label}</div>
      <motion.button
        whileHover={{ scale: isMobile ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-3",
          "bg-app-card dark:bg-[#0F1629] hover:bg-app-muted dark:hover:bg-[#1A2237] text-app-foreground dark:text-white rounded-xl",
          "border border-app-card-border dark:border-white/5 hover:border-app-muted-foreground/30 dark:hover:border-white/10 transition-all duration-200",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-4 md:w-5 h-4 md:h-5 rounded-full",
              color === "transparent"
                ? "bg-transparent border border-app-muted-foreground dark:border-gray-400"
                : color === "white"
                  ? "bg-white"
                  : color === "black"
                    ? "bg-black"
                    : getColorClass(color, intensity),
            )}
          />
          <span className="font-medium text-sm md:text-base">{value}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-[100] mt-2 w-full bg-app-card dark:bg-[#0F1629] border border-app-card-border dark:border-white/5 rounded-lg md:rounded-xl shadow-xl overflow-hidden"
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
                  className="w-full pl-9 pr-4 py-2 bg-app-muted dark:bg-[#1A2237] border border-app-card-border dark:border-white/5 rounded-lg text-app-foreground dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-app-accent dark:focus:ring-white/20 focus:border-transparent placeholder-app-muted-foreground dark:placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] md:max-h-[60vh] py-1 overscroll-contain">
              {colorOptions.map((option, index) => {
                const isSelected =
                  option.value === color &&
                  (option.intensity === intensity ||
                    (option.value === "white" && color === "white") ||
                    (option.value === "black" && color === "black") ||
                    (option.value === "transparent" && color === "transparent"))

                return (
                  <motion.button
                    key={index}
                    className={cn(
                      "w-full text-left px-3 py-2 flex items-center hover:bg-app-muted dark:hover:bg-[#1A2237] transition-colors",
                      isSelected && "bg-app-muted dark:bg-[#1A2237]",
                    )}
                    onClick={() => {
                      onChange(option.value, option.intensity)
                      setIsOpen(false)
                      setSearchQuery("")
                    }}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.01 }}
                  >
                    <div
                      className={cn(
                        "w-4 md:w-5 h-4 md:h-5 rounded-full mr-3",
                        option.value === "transparent"
                          ? "bg-transparent border border-gray-400"
                          : option.value === "white"
                            ? "bg-white"
                            : option.value === "black"
                              ? "bg-black"
                              : getColorClass(option.value, option.intensity),
                      )}
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

