"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MonitorPlay, Layers, Palette, MousePointerIcon as MousePointerSquare } from "lucide-react"
import { GradientPreview } from "@/components/gradient-preview"
import { useGradientStore } from "@/lib/store"
import { ExportDialog } from "@/components/export-dialog"

export function ComponentPreview() {
  const { componentType, setComponentType, gradientClass, cssGradient } = useGradientStore()

  return (
    <div className="bg-app-muted/30 dark:bg-gray-900/30 rounded-2xl border border-app-card-border dark:border-white/5 p-4">
      <div className="flex gap-3 mb-5 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { value: "card", label: "Card", icon: <Layers className="h-4 w-4" /> },
          { value: "button", label: "Button", icon: <MousePointerSquare className="h-4 w-4" /> },
          { value: "navbar", label: "Navbar", icon: <Palette className="h-4 w-4" /> },
          { value: "hero", label: "Hero Section", icon: <MonitorPlay className="h-4 w-4" /> },
        ].map((item) => (
          <motion.button
            key={item.value}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap",
              componentType === item.value
                ? "bg-app-muted dark:bg-gray-800 text-app-foreground dark:text-white"
                : "bg-app-muted/50 dark:bg-gray-800/50 text-app-muted-foreground dark:text-gray-400 hover:bg-app-muted/80 dark:hover:bg-gray-800/80 hover:text-app-foreground/80 dark:hover:text-white/80",
            )}
            onClick={() => setComponentType(item.value as "card" | "button" | "navbar" | "hero")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {item.icon}
            {item.label}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={`${componentType}-${gradientClass()}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <GradientPreview type={componentType} gradientClass={gradientClass()} cssGradient={cssGradient()} />
      </motion.div>

      <div className="flex justify-end mt-4">
        <ExportDialog />
      </div>
    </div>
  )
}

