"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Layers } from "lucide-react"
import { RawGradientPreview } from "@/components/raw-gradient-preview"
import { ComponentPreview } from "@/components/component-preview"
import { motion } from "framer-motion"
import { useGradientStore } from "@/lib/store"
import { useIsMobile } from "@/lib/hooks/use-device-detection"

export function GradientPreviewTabs() {
  const { previewMode, setPreviewMode } = useGradientStore()
  const isMobile = useIsMobile()
  const isVerySmallScreen = typeof window !== "undefined" && window.innerWidth < 360

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs
        value={previewMode}
        onValueChange={(value) => setPreviewMode(value as "raw" | "component")}
        className="mb-4"
      >
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 md:gap-0 mb-4">
          <h3 className="text-app-foreground dark:text-white font-heading font-semibold text-lg px-1">Preview</h3>
          <TabsList className="bg-app-muted/70 dark:bg-gray-800/80 p-1 w-full md:w-auto shadow-sm border border-app-card-border/40 dark:border-white/5">
            <TabsTrigger
              value="raw"
              className="flex items-center justify-center gap-1.5 md:gap-2 data-[state=active]:bg-app-accent dark:data-[state=active]:bg-gray-700/90 data-[state=active]:shadow-sm flex-1 md:flex-none text-xs md:text-sm font-medium"
            >
              <Palette className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Raw Gradient</span>
            </TabsTrigger>
            <TabsTrigger
              value="component"
              className="flex items-center justify-center gap-1.5 md:gap-2 data-[state=active]:bg-app-accent dark:data-[state=active]:bg-gray-700/90 data-[state=active]:shadow-sm flex-1 md:flex-none text-xs md:text-sm font-medium"
            >
              <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="truncate">Component</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="raw" className="mt-0">
          <div className="border border-app-card-border/40 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
            <RawGradientPreview />
          </div>
        </TabsContent>

        <TabsContent value="component" className="mt-0">
          <div className="border border-app-card-border/40 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
            <ComponentPreview />
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

