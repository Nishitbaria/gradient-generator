"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGradientStore } from "@/lib/store"
import { ExportDialog } from "@/components/export-dialog"
import { useIsMobile } from "@/lib/hooks/use-device-detection"

export function RawGradientPreview() {
  const [isHovering, setIsHovering] = useState(false)
  const { cssGradient } = useGradientStore()
  const isMobile = useIsMobile()

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-xl shadow-lg"
      initial={{ height: 240 }}
      animate={{ height: 240 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => !isMobile && setIsHovering(true)}
      onTouchEnd={() => !isMobile && setIsHovering(false)}
    >
      <motion.div
        className="w-full h-full transition-all duration-500 relative z-0"
        style={{ background: cssGradient() }}
        layoutId="gradient-preview"
        initial={{ scale: 1 }}
        animate={{
          scale: isHovering ? 1.03 : 1,
          transition: { duration: 0.5 },
        }}
      />

      <AnimatePresence>
        {(isHovering || isMobile) && (
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

      {/* Add a subtle overlay to indicate interactivity */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />
    </motion.div>
  )
}

