"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeDisplay } from "@/components/code-display"
import { useGradientStore } from "@/lib/store"
import { Copy, Check, Download, Code, Image, FileCode, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
    Modal,
    ModalTrigger,
    ModalBody,
    ModalContent,
    ModalFooter
} from "@/components/ui/animated-modal"

type ExportFormat = "code" | "svg" | "image"

// Tailwind color mapping for canvas
const TAILWIND_COLORS: Record<string, Record<string, string>> = {
    slate: {
        "50": "#f8fafc", "100": "#f1f5f9", "200": "#e2e8f0", "300": "#cbd5e1",
        "400": "#94a3b8", "500": "#64748b", "600": "#475569", "700": "#334155",
        "800": "#1e293b", "900": "#0f172a"
    },
    gray: {
        "50": "#f9fafb", "100": "#f3f4f6", "200": "#e5e7eb", "300": "#d1d5db",
        "400": "#9ca3af", "500": "#6b7280", "600": "#4b5563", "700": "#374151",
        "800": "#1f2937", "900": "#111827"
    },
    zinc: {
        "50": "#fafafa", "100": "#f4f4f5", "200": "#e4e4e7", "300": "#d4d4d8",
        "400": "#a1a1aa", "500": "#71717a", "600": "#52525b", "700": "#3f3f46",
        "800": "#27272a", "900": "#18181b"
    },
    neutral: {
        "50": "#fafafa", "100": "#f5f5f5", "200": "#e5e5e5", "300": "#d4d4d4",
        "400": "#a3a3a3", "500": "#737373", "600": "#525252", "700": "#404040",
        "800": "#262626", "900": "#171717"
    },
    stone: {
        "50": "#fafaf9", "100": "#f5f5f4", "200": "#e7e5e4", "300": "#d6d3d1",
        "400": "#a8a29e", "500": "#78716c", "600": "#57534e", "700": "#44403c",
        "800": "#292524", "900": "#1c1917"
    },
    red: {
        "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5",
        "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c",
        "800": "#991b1b", "900": "#7f1d1d"
    },
    orange: {
        "50": "#fff7ed", "100": "#ffedd5", "200": "#fed7aa", "300": "#fdba74",
        "400": "#fb923c", "500": "#f97316", "600": "#ea580c", "700": "#c2410c",
        "800": "#9a3412", "900": "#7c2d12"
    },
    amber: {
        "50": "#fffbeb", "100": "#fef3c7", "200": "#fde68a", "300": "#fcd34d",
        "400": "#fbbf24", "500": "#f59e0b", "600": "#d97706", "700": "#b45309",
        "800": "#92400e", "900": "#78350f"
    },
    yellow: {
        "50": "#fefce8", "100": "#fef9c3", "200": "#fef08a", "300": "#fde047",
        "400": "#facc15", "500": "#eab308", "600": "#ca8a04", "700": "#a16207",
        "800": "#854d0e", "900": "#713f12"
    },
    lime: {
        "50": "#f7fee7", "100": "#ecfccb", "200": "#d9f99d", "300": "#bef264",
        "400": "#a3e635", "500": "#84cc16", "600": "#65a30d", "700": "#4d7c0f",
        "800": "#3f6212", "900": "#365314"
    },
    green: {
        "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac",
        "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d",
        "800": "#166534", "900": "#14532d"
    },
    emerald: {
        "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7",
        "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857",
        "800": "#065f46", "900": "#064e3b"
    },
    teal: {
        "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4",
        "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e",
        "800": "#115e59", "900": "#134e4a"
    },
    cyan: {
        "50": "#ecfeff", "100": "#cffafe", "200": "#a5f3fc", "300": "#67e8f9",
        "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490",
        "800": "#155e75", "900": "#164e63"
    },
    sky: {
        "50": "#f0f9ff", "100": "#e0f2fe", "200": "#bae6fd", "300": "#7dd3fc",
        "400": "#38bdf8", "500": "#0ea5e9", "600": "#0284c7", "700": "#0369a1",
        "800": "#075985", "900": "#0c4a6e"
    },
    blue: {
        "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd",
        "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8",
        "800": "#1e40af", "900": "#1e3a8a"
    },
    indigo: {
        "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc",
        "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca",
        "800": "#3730a3", "900": "#312e81"
    },
    violet: {
        "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe", "300": "#c4b5fd",
        "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9",
        "800": "#5b21b6", "900": "#4c1d95"
    },
    purple: {
        "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe",
        "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce",
        "800": "#6b21a8", "900": "#581c87"
    },
    fuchsia: {
        "50": "#fdf4ff", "100": "#fae8ff", "200": "#f5d0fe", "300": "#f0abfc",
        "400": "#e879f9", "500": "#d946ef", "600": "#c026d3", "700": "#a21caf",
        "800": "#86198f", "900": "#701a75"
    },
    pink: {
        "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4",
        "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d",
        "800": "#9d174d", "900": "#831843"
    },
    rose: {
        "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af",
        "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c",
        "800": "#9f1239", "900": "#881337"
    }
};

// Simple SVG code display component without tabs
function SVGCodeDisplay({ code }: { code: string }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(code).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                })
            } else {
                // Fallback for browsers that don't support the Clipboard API
                const textArea = document.createElement("textarea")
                textArea.value = code
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
        <div className="relative font-mono text-sm max-h-[280px] overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
                <motion.div
                    className="bg-black/70 backdrop-blur-xs rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={copyToClipboard}
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">{copied ? "Copied" : "Copy code"}</span>
                    </Button>
                </motion.div>
            </div>
            <pre className="p-4 rounded bg-black/50 text-white overflow-x-auto max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <code>{code}</code>
            </pre>
        </div>
    )
}

export function ExportDialog() {
    const [copied, setCopied] = useState(false)
    const [exportFormat, setExportFormat] = useState<ExportFormat>("code")
    const { gradientClass, cssGradient } = useGradientStore()

    // Copy gradient class to clipboard
    const copyToClipboard = () => {
        try {
            const contentToCopy = exportFormat === "code"
                ? gradientClass()
                : exportFormat === "svg"
                    ? generateSvgContent()
                    : cssGradient()

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(contentToCopy).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                })
            } else {
                // Fallback for browsers that don't support the Clipboard API
                const textArea = document.createElement("textarea")
                textArea.value = contentToCopy
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

    // Generate SVG content with the gradient
    const generateSvgContent = () => {
        const gradient = cssGradient()
        return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${gradient}" />
</svg>`
    }

    // Download content based on format
    const downloadContent = () => {
        let content = ""
        let filename = ""
        let type = ""

        if (exportFormat === "code") {
            content = gradientClass()
            filename = "gradient-code.txt"
            type = "text/plain"
        } else if (exportFormat === "svg") {
            content = generateSvgContent()
            filename = "gradient.svg"
            type = "image/svg+xml"
        } else {
            // For image format, we need to create a data URL from a canvas
            const canvas = document.createElement("canvas")
            canvas.width = 800
            canvas.height = 600
            const ctx = canvas.getContext("2d")

            if (ctx) {
                // Create a gradient on the canvas
                const gradient = ctx.createLinearGradient(0, 0, 800, 600)

                // Get actual color values for the gradient stops
                const fromColor = getTailwindColorValue(useGradientStore.getState().fromColor)
                const toColor = getTailwindColorValue(useGradientStore.getState().toColor)

                gradient.addColorStop(0, fromColor)

                if (useGradientStore.getState().useVia) {
                    const viaColor = getTailwindColorValue(useGradientStore.getState().viaColor)
                    gradient.addColorStop(0.5, viaColor)
                }

                gradient.addColorStop(1, toColor)

                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, 800, 600)

                content = canvas.toDataURL("image/png")
                filename = "gradient.png"
                type = "image/png"
            }
        }

        // Create download link
        const link = document.createElement("a")

        if (exportFormat === "image") {
            link.href = content
        } else {
            const blob = new Blob([content], { type })
            link.href = URL.createObjectURL(blob)
        }

        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Helper function to get actual color value from Tailwind color object
    const getTailwindColorValue = (colorObj: { color: string, intensity: string }): string => {
        if (colorObj.color === "white") return "#ffffff"
        if (colorObj.color === "transparent") return "transparent"
        if (colorObj.color === "black") return "#000000"

        // Get the actual color value from our Tailwind colors mapping
        return TAILWIND_COLORS[colorObj.color]?.[colorObj.intensity] || "#888888"
    }

    // Helper function to get color value for CSS variables
    const getColorValue = (colorObj: { color: string, intensity: string }) => {
        if (colorObj.color === "white") return "#ffffff"
        if (colorObj.color === "transparent") return "transparent"
        if (colorObj.color === "black") return "#000000"

        // This is for CSS variables
        return `var(--${colorObj.color}-${colorObj.intensity}, #888888)`
    }

    return (
        <Modal>
            <ModalTrigger className="bg-app-accent/20 dark:bg-white/20 backdrop-blur-md hover:bg-app-accent/30 dark:hover:bg-white/30 text-app-foreground dark:text-white py-2 px-4 rounded-md text-sm font-medium relative z-30 pointer-events-auto">
                Export
            </ModalTrigger>
            <ModalBody>
                <ModalContent>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Export Gradient</h2>
                        <p className="text-white/70">
                            Choose a format to export your gradient
                        </p>
                    </div>

                    <Tabs value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)} className="mt-4">
                        <TabsList className="grid grid-cols-3 mb-6 bg-white/10">
                            <TabsTrigger
                                value="code"
                                className="flex items-center gap-1.5 data-[state=active]:bg-white/20 text-white"
                            >
                                <Code className="h-4 w-4" />
                                <span>Code</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="svg"
                                className="flex items-center gap-1.5 data-[state=active]:bg-white/20 text-white"
                            >
                                <FileCode className="h-4 w-4" />
                                <span>SVG</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="image"
                                className="flex items-center gap-1.5 data-[state=active]:bg-white/20 text-white"
                            >
                                <Image className="h-4 w-4" />
                                <span>Image</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="code" className="mt-0">
                            <div className="bg-black/50 border border-white/10 rounded-md p-4 max-h-[300px] overflow-auto">
                                <CodeDisplay code={gradientClass()} />
                            </div>
                        </TabsContent>

                        <TabsContent value="svg" className="mt-0">
                            <div className="bg-black/50 border border-white/10 rounded-md p-4 max-h-[300px] overflow-auto">
                                <SVGCodeDisplay code={generateSvgContent()} />
                            </div>
                        </TabsContent>

                        <TabsContent value="image" className="mt-0">
                            <div
                                className="w-full h-[200px] rounded-md overflow-hidden border border-white/10"
                                style={{ background: cssGradient() }}
                            />
                        </TabsContent>
                    </Tabs>
                </ModalContent>
                <ModalFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={copyToClipboard}
                        className="bg-black border-white/20 text-white hover:bg-white/10"
                    >
                        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                        onClick={downloadContent}
                        className="bg-white text-black hover:bg-white/90"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                </ModalFooter>
            </ModalBody>
        </Modal>
    )
} 