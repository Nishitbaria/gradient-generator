"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MonitorPlay, Layers, Palette, MousePointerIcon as MousePointerSquare } from "lucide-react"
import { GradientPreview } from "@/components/gradient-preview"
import { useGradientStore } from "@/lib/store"

export function ComponentPreview() {
  const [copied, setCopied] = useState(false)

  const { componentType, setComponentType, gradientClass, cssGradient } = useGradientStore()

  // Copy gradient class to clipboard
  const copyToClipboard = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(gradientClass()).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      } else {
        // Fallback for browsers that don't support the Clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = gradientClass()
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          console.error('Failed to copy text: ', err)
        }
        textArea.remove()
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

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
        <Button
          size="sm"
          variant="secondary"
          className="bg-app-accent/20 dark:bg-white/20 backdrop-blur-md hover:bg-app-accent/30 dark:hover:bg-white/30 text-app-foreground dark:text-white"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied Class" : "Copy Class"}
        </Button>
      </div>
    </div>
  )
}

