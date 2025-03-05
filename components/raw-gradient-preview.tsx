"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { CodeDisplay } from "@/components/code-display"
import { useGradientStore } from "@/lib/store"

export function RawGradientPreview() {
  const [copied, setCopied] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const { gradientClass } = useGradientStore()

  // Copy gradient class to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(gradientClass())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl shadow-lg"
      initial={{ height: 200 }}
      animate={{ height: showCode ? 320 : 200 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className={cn("w-full h-full transition-all duration-500 relative z-0", gradientClass())}
        layoutId="gradient-preview"
        initial={{ scale: 1 }}
        animate={{
          scale: isHovering ? 1.05 : 1,
          transition: { duration: 0.5 },
        }}
      />

      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="absolute bottom-4 right-4 flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="sm"
              variant="secondary"
              className="bg-app-accent/20 dark:bg-white/20 backdrop-blur-md hover:bg-app-accent/30 dark:hover:bg-white/30 text-app-foreground dark:text-white"
              onClick={() => setShowCode(!showCode)}
            >
              <Code className="h-4 w-4 mr-2" />
              {showCode ? "Hide Code" : "Show Code"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-app-accent/20 dark:bg-white/20 backdrop-blur-md hover:bg-app-accent/30 dark:hover:bg-white/30 text-app-foreground dark:text-white"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCode && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CodeDisplay code={gradientClass()} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

