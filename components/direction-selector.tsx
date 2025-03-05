"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Direction {
  value: string
  label: string
  icon: string
}

interface DirectionSelectorProps {
  value: string
  onChange: (value: string) => void
  directions: Direction[]
}

export function DirectionSelector({ value, onChange, directions }: DirectionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Get current direction
  const currentDirection = directions.find((dir) => dir.value === value) || directions[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center justify-between gap-2 px-4 py-3",
          "bg-app-card dark:bg-gray-800/70 hover:bg-app-muted dark:hover:bg-gray-800 text-app-foreground dark:text-white rounded-xl",
          "border border-app-card-border dark:border-white/5 hover:border-app-muted-foreground/30 dark:hover:border-white/10 transition-all duration-200",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5 bg-app-muted dark:bg-gray-700 rounded-md text-app-foreground dark:text-gray-300">
            <span>{currentDirection.icon}</span>
          </div>
          <span className="font-medium">{currentDirection.label}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-100 mt-2 w-64 bg-app-card dark:bg-gray-900 border border-app-card-border dark:border-gray-800 rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-1 p-2">
              {directions.map((direction, index) => {
                const isSelected = direction.value === value

                return (
                  <motion.button
                    key={index}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg",
                      isSelected
                        ? "bg-app-muted dark:bg-gray-700 text-app-foreground dark:text-white"
                        : "hover:bg-app-muted/70 dark:hover:bg-gray-800/70 text-app-foreground dark:text-white",
                    )}
                    onClick={() => {
                      onChange(direction.value)
                      setIsOpen(false)
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-md",
                        isSelected ? "bg-app-accent dark:bg-gray-600" : "bg-app-muted dark:bg-gray-800",
                      )}
                    >
                      <span>{direction.icon}</span>
                    </div>
                    <span className="text-sm">{direction.label}</span>
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

