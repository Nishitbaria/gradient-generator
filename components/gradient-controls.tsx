"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shuffle, Clock } from "lucide-react"
import { ColorSelector } from "@/components/color-selector"
import { DirectionSelector } from "@/components/direction-selector"
import { motion } from "framer-motion"
import { DIRECTIONS, COLORS, INTENSITIES, useGradientStore } from "@/lib/store"
import { GradientHistory } from "@/components/gradient-history"
import { useIsMobile } from "@/lib/hooks/use-device-detection"

export function GradientControls() {
  const [showHistory, setShowHistory] = useState(false)
  const historyPanelRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const {
    direction,
    fromColor,
    viaColor,
    toColor,
    useVia,
    history,
    setDirection,
    setFromColor,
    setViaColor,
    setToColor,
    setUseVia,
    generateRandomGradient,
  } = useGradientStore()

  return (
    <div className="bg-app-card/70 dark:bg-[#0F1629]/70 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-lg border border-app-card-border dark:border-white/5 relative z-20">
      <div className="flex flex-col gap-6">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto">
            <motion.div whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
              <Button
                variant="outline"
                className="w-full md:w-auto bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 text-app-foreground dark:text-white hover:bg-app-muted dark:hover:bg-[#1A2237] hover:border-app-muted-foreground/30 dark:hover:border-white/10"
                onClick={generateRandomGradient}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
            </motion.div>

            <div className="flex items-center gap-2">
              <span className="text-app-foreground dark:text-white text-sm">Via</span>
              <Switch
                checked={useVia}
                onCheckedChange={setUseVia}
                className="data-[state=checked]:bg-app-muted-foreground dark:data-[state=checked]:bg-gray-600"
              />
            </div>

            <motion.div whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
              <Button
                variant="outline"
                className="w-full md:w-auto bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 text-app-foreground dark:text-white hover:bg-app-muted dark:hover:bg-[#1A2237] hover:border-app-muted-foreground/30 dark:hover:border-white/10 relative"
                onClick={() => setShowHistory(!showHistory)}
              >
                <Clock className="h-4 w-4 mr-2" />
                History
                {history.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-app-accent-foreground dark:bg-white text-app-accent dark:text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {history.length}
                  </span>
                )}
              </Button>
            </motion.div>
          </div>

          <div className="w-full md:w-auto md:ml-auto">
            <DirectionSelector value={direction} onChange={setDirection} directions={DIRECTIONS} />
          </div>
        </div>

        {/* Color Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorSelector
            label="From"
            value={`from-${fromColor.color}-${fromColor.intensity}`}
            color={fromColor.color}
            intensity={fromColor.intensity}
            onChange={(color, intensity) => setFromColor(color, intensity)}
            colors={COLORS}
            intensities={INTENSITIES}
          />

          {useVia && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ColorSelector
                label="Via"
                value={`via-${viaColor.color}-${viaColor.intensity}`}
                color={viaColor.color}
                intensity={viaColor.intensity}
                onChange={(color, intensity) => setViaColor(color, intensity)}
                colors={COLORS}
                intensities={INTENSITIES}
              />
            </motion.div>
          )}

          <ColorSelector
            label="To"
            value={`to-${toColor.color}-${toColor.intensity}`}
            color={toColor.color}
            intensity={toColor.intensity}
            onChange={(color, intensity) => setToColor(color, intensity)}
            colors={COLORS}
            intensities={INTENSITIES}
          />
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div
          ref={historyPanelRef}
          className="absolute top-full left-0 right-0 mt-2 bg-app-card dark:bg-gray-900/95 backdrop-blur-md rounded-xl border border-app-card-border dark:border-white/10 shadow-xl z-50 max-h-[70vh] overflow-hidden flex flex-col"
        >
          <GradientHistory onClose={() => setShowHistory(false)} />
        </div>
      )}
    </div>
  )
}

