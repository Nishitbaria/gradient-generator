"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shuffle } from "lucide-react"
import { ColorSelector } from "@/components/color-selector"
import { DirectionSelector } from "@/components/direction-selector"
import { DIRECTIONS, COLORS, INTENSITIES, useGradientStore } from "@/lib/store"
import { useIsMobile } from "@/lib/hooks/use-device-detection"

export function GradientControls() {
  const isMobile = useIsMobile()

  const {
    direction,
    fromColor,
    viaColor,
    toColor,
    useVia,
    setDirection,
    setFromColor,
    setViaColor,
    setToColor,
    setUseVia,
    generateRandomGradient,
    gradientType,
    setGradientType,
    gradientAngle,
    setGradientAngle,
  } = useGradientStore()

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

            <div className="flex items-center gap-2">
              <Switch checked={useVia} onCheckedChange={setUseVia} className="data-[state=checked]:bg-primary" />
              <Label htmlFor="via-point" className="text-sm text-app-foreground dark:text-white">
                Add Via Color
              </Label>
            </div>
          </div>
        </div>

        {/* Gradient Type Selector */}
        <div className="space-y-2 relative z-10">
          <Label className="text-sm text-app-muted-foreground dark:text-gray-400">Gradient Type</Label>
          <Select value={gradientType} onValueChange={setGradientType}>
            <SelectTrigger className="w-full bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5">
              <SelectValue placeholder="Select gradient type" />
            </SelectTrigger>
            <SelectContent className="bg-app-card dark:bg-[#0F1629] border-app-card-border dark:border-white/5 z-50">
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
              <SelectItem value="conic">Conic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Direction or Angle Control based on gradient type */}
        {gradientType === "linear" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-app-muted-foreground dark:text-gray-400">Direction</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="use-angle" className="text-sm text-app-foreground dark:text-white">
                  Use Angle
                </Label>
                <Switch
                  id="use-angle"
                  checked={direction === "custom-angle"}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDirection("custom-angle")
                    } else {
                      setDirection("bg-linear-to-r")
                    }
                  }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
            {direction === "custom-angle" ? (
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

        {/* Color Selectors */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-app-muted-foreground dark:text-gray-400 mb-2 block">From Color</Label>
            <ColorSelector
              selectedColor={fromColor.color}
              selectedIntensity={fromColor.intensity}
              onColorChange={(color, intensity) => setFromColor(color, intensity)}
              onIntensityChange={(intensity) => setFromColor(fromColor.color, intensity)}
              colors={COLORS}
              intensities={INTENSITIES}
            />
          </div>

          {useVia && (
            <div>
              <Label className="text-sm text-app-muted-foreground dark:text-gray-400 mb-2 block">Via Color</Label>
              <ColorSelector
                selectedColor={viaColor.color}
                selectedIntensity={viaColor.intensity}
                onColorChange={(color, intensity) => setViaColor(color, intensity)}
                onIntensityChange={(intensity) => setViaColor(viaColor.color, intensity)}
                colors={COLORS}
                intensities={INTENSITIES}
              />
            </div>
          )}

          <div>
            <Label className="text-sm text-app-muted-foreground dark:text-gray-400 mb-2 block">To Color</Label>
            <ColorSelector
              selectedColor={toColor.color}
              selectedIntensity={toColor.intensity}
              onColorChange={(color, intensity) => setToColor(color, intensity)}
              onIntensityChange={(intensity) => setToColor(toColor.color, intensity)}
              colors={COLORS}
              intensities={INTENSITIES}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

