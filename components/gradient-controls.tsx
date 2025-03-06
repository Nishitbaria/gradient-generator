"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    gradientType,
    setGradientType,
    gradientAngle,
    setGradientAngle
  } = useGradientStore()

  // Close history panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyPanelRef.current && !historyPanelRef.current.contains(event.target as Node)) {
        setShowHistory(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-app-muted/30 dark:bg-gray-900/30 rounded-2xl border border-app-card-border dark:border-white/5 p-4 md:p-6 space-y-6 relative">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-app-foreground dark:text-white">Customize Gradient</h2>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 text-app-foreground dark:text-white hover:bg-app-muted dark:hover:bg-[#1A2237]"
              onClick={generateRandomGradient}
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 text-app-foreground dark:text-white hover:bg-app-muted dark:hover:bg-[#1A2237] relative"
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

            <div className="flex items-center gap-2 ml-2">
              <Switch
                checked={useVia}
                onCheckedChange={setUseVia}
                className="data-[state=checked]:bg-app-accent dark:data-[state=checked]:bg-white/90"
              />
              <Label htmlFor="via-point" className="text-sm text-app-foreground dark:text-white">
                Add Via Color
              </Label>
            </div>
          </div>
        </div>

        {/* Gradient Type Selector */}
        <div className="space-y-2">
          <Label className="text-sm text-app-muted-foreground dark:text-gray-400">Gradient Type</Label>
          <Select value={gradientType} onValueChange={setGradientType}>
            <SelectTrigger className="w-full bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5">
              <SelectValue placeholder="Select gradient type" />
            </SelectTrigger>
            <SelectContent className="bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5">
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
              <SelectItem value="conic">Conic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Direction or Angle Control based on gradient type */}
        {gradientType === 'linear' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-app-muted-foreground dark:text-gray-400">Direction</Label>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-app-muted-foreground dark:text-gray-400">Use Angle</Label>
                <Switch
                  checked={direction === 'custom-angle'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDirection('custom-angle');
                    } else {
                      setDirection('bg-linear-to-r');
                    }
                  }}
                  className="data-[state=checked]:bg-app-accent dark:data-[state=checked]:bg-white/90"
                />
              </div>
            </div>

            {direction === 'custom-angle' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-app-foreground dark:text-white">{gradientAngle}°</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGradientAngle(45)}
                    className="h-7 text-xs bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5"
                  >
                    Reset
                  </Button>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[gradientAngle]}
                  onValueChange={(value) => setGradientAngle(value[0])}
                  className="w-full"
                />
              </div>
            ) : (
              <DirectionSelector value={direction} onChange={setDirection} directions={DIRECTIONS} />
            )}
          </div>
        )}

        {gradientType === 'radial' && (
          <div className="space-y-2">
            <Label className="text-sm text-app-muted-foreground dark:text-gray-400">Radial Position</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('radial-at-t')}
                className={`h-8 ${direction === 'radial-at-t' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Top
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('radial-at-c')}
                className={`h-8 ${direction === 'radial-at-c' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Center
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('radial-at-b')}
                className={`h-8 ${direction === 'radial-at-b' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Bottom
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('radial-at-l')}
                className={`h-8 ${direction === 'radial-at-l' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Left
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('radial-at-r')}
                className={`h-8 ${direction === 'radial-at-r' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Right
              </Button>
            </div>
          </div>
        )}

        {gradientType === 'conic' && (
          <div className="space-y-2">
            <Label className="text-sm text-app-muted-foreground dark:text-gray-400">Conic Position</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('conic-at-t')}
                className={`h-8 ${direction === 'conic-at-t' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Top
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('conic-at-c')}
                className={`h-8 ${direction === 'conic-at-c' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Center
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDirection('conic-at-b')}
                className={`h-8 ${direction === 'conic-at-b' ? 'bg-app-accent/10 border-app-accent dark:bg-white/10 dark:border-white' : 'bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5'}`}
              >
                Bottom
              </Button>
            </div>
          </div>
        )}

        {/* Color Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ColorSelector
            label="From"
            value={`gradient-from-${fromColor.color}-${fromColor.intensity}`}
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
                value={`gradient-via-${viaColor.color}-${viaColor.intensity}`}
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
            value={`gradient-to-${toColor.color}-${toColor.intensity}`}
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

