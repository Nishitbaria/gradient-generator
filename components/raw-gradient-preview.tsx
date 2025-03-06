"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGradientStore } from "@/lib/store"
import { ExportDialog } from "@/components/export-dialog"

export function RawGradientPreview() {
  const [isHovering, setIsHovering] = useState(false)
  const { cssGradient } = useGradientStore()

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl shadow-lg"
      initial={{ height: 200 }}
      animate={{ height: 200 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="w-full h-full transition-all duration-500 relative z-0"
        style={{ background: cssGradient() }}
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
            <ExportDialog />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

