"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Tailwind color mapping to hex values
const TAILWIND_COLORS: { [key: string]: string } = {
  // Slate
  "slate-50": "#f8fafc",
  "slate-100": "#f1f5f9",
  "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8",
  "slate-500": "#64748b",
  "slate-600": "#475569",
  "slate-700": "#334155",
  "slate-800": "#1e293b",
  "slate-900": "#0f172a",

  // Gray
  "gray-50": "#f9fafb",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",

  // Zinc
  "zinc-50": "#fafafa",
  "zinc-100": "#f4f4f5",
  "zinc-200": "#e4e4e7",
  "zinc-300": "#d4d4d8",
  "zinc-400": "#a1a1aa",
  "zinc-500": "#71717a",
  "zinc-600": "#52525b",
  "zinc-700": "#3f3f46",
  "zinc-800": "#27272a",
  "zinc-900": "#18181b",

  // Neutral
  "neutral-50": "#fafafa",
  "neutral-100": "#f5f5f5",
  "neutral-200": "#e5e5e5",
  "neutral-300": "#d4d4d4",
  "neutral-400": "#a3a3a3",
  "neutral-500": "#737373",
  "neutral-600": "#525252",
  "neutral-700": "#404040",
  "neutral-800": "#262626",
  "neutral-900": "#171717",

  // Stone
  "stone-50": "#fafaf9",
  "stone-100": "#f5f5f4",
  "stone-200": "#e7e5e4",
  "stone-300": "#d6d3d1",
  "stone-400": "#a8a29e",
  "stone-500": "#78716c",
  "stone-600": "#57534e",
  "stone-700": "#44403c",
  "stone-800": "#292524",
  "stone-900": "#1c1917",

  // Red
  "red-50": "#fef2f2",
  "red-100": "#fee2e2",
  "red-200": "#fecaca",
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-800": "#991b1b",
  "red-900": "#7f1d1d",

  // Orange
  "orange-50": "#fff7ed",
  "orange-100": "#ffedd5",
  "orange-200": "#fed7aa",
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "orange-700": "#c2410c",
  "orange-800": "#9a3412",
  "orange-900": "#7c2d12",

  // Amber
  "amber-50": "#fffbeb",
  "amber-100": "#fef3c7",
  "amber-200": "#fde68a",
  "amber-300": "#fcd34d",
  "amber-400": "#fbbf24",
  "amber-500": "#f59e0b",
  "amber-600": "#d97706",
  "amber-700": "#b45309",
  "amber-800": "#92400e",
  "amber-900": "#78350f",

  // Yellow
  "yellow-50": "#fefce8",
  "yellow-100": "#fef9c3",
  "yellow-200": "#fef08a",
  "yellow-300": "#fde047",
  "yellow-400": "#facc15",
  "yellow-500": "#eab308",
  "yellow-600": "#ca8a04",
  "yellow-700": "#a16207",
  "yellow-800": "#854d0e",
  "yellow-900": "#713f12",

  // Lime
  "lime-50": "#f7fee7",
  "lime-100": "#ecfccb",
  "lime-200": "#d9f99d",
  "lime-300": "#bef264",
  "lime-400": "#a3e635",
  "lime-500": "#84cc16",
  "lime-600": "#65a30d",
  "lime-700": "#4d7c0f",
  "lime-800": "#3f6212",
  "lime-900": "#365314",

  // Green
  "green-50": "#f0fdf4",
  "green-100": "#dcfce7",
  "green-200": "#bbf7d0",
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "green-700": "#15803d",
  "green-800": "#166534",
  "green-900": "#14532d",

  // Emerald
  "emerald-50": "#ecfdf5",
  "emerald-100": "#d1fae5",
  "emerald-200": "#a7f3d0",
  "emerald-300": "#6ee7b7",
  "emerald-400": "#34d399",
  "emerald-500": "#10b981",
  "emerald-600": "#059669",
  "emerald-700": "#047857",
  "emerald-800": "#065f46",
  "emerald-900": "#064e3b",

  // Teal
  "teal-50": "#f0fdfa",
  "teal-100": "#ccfbf1",
  "teal-200": "#99f6e4",
  "teal-300": "#5eead4",
  "teal-400": "#2dd4bf",
  "teal-500": "#14b8a6",
  "teal-600": "#0d9488",
  "teal-700": "#0f766e",
  "teal-800": "#115e59",
  "teal-900": "#134e4a",

  // Cyan
  "cyan-50": "#ecfeff",
  "cyan-100": "#cffafe",
  "cyan-200": "#a5f3fc",
  "cyan-300": "#67e8f9",
  "cyan-400": "#22d3ee",
  "cyan-500": "#06b6d4",
  "cyan-600": "#0891b2",
  "cyan-700": "#0e7490",
  "cyan-800": "#155e75",
  "cyan-900": "#164e63",

  // Sky
  "sky-50": "#f0f9ff",
  "sky-100": "#e0f2fe",
  "sky-200": "#bae6fd",
  "sky-300": "#7dd3fc",
  "sky-400": "#38bdf8",
  "sky-500": "#0ea5e9",
  "sky-600": "#0284c7",
  "sky-700": "#0369a1",
  "sky-800": "#075985",
  "sky-900": "#0c4a6e",

  // Blue
  "blue-50": "#eff6ff",
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",
  "blue-900": "#1e3a8a",

  // Indigo
  "indigo-50": "#eef2ff",
  "indigo-100": "#e0e7ff",
  "indigo-200": "#c7d2fe",
  "indigo-300": "#a5b4fc",
  "indigo-400": "#818cf8",
  "indigo-500": "#6366f1",
  "indigo-600": "#4f46e5",
  "indigo-700": "#4338ca",
  "indigo-800": "#3730a3",
  "indigo-900": "#312e81",

  // Violet
  "violet-50": "#f5f3ff",
  "violet-100": "#ede9fe",
  "violet-200": "#ddd6fe",
  "violet-300": "#c4b5fd",
  "violet-400": "#a78bfa",
  "violet-500": "#8b5cf6",
  "violet-600": "#7c3aed",
  "violet-700": "#6d28d9",
  "violet-800": "#5b21b6",
  "violet-900": "#4c1d95",

  // Purple
  "purple-50": "#faf5ff",
  "purple-100": "#f3e8ff",
  "purple-200": "#e9d5ff",
  "purple-300": "#d8b4fe",
  "purple-400": "#c084fc",
  "purple-500": "#a855f7",
  "purple-600": "#9333ea",
  "purple-700": "#7e22ce",
  "purple-800": "#6b21a8",
  "purple-900": "#581c87",

  // Fuchsia
  "fuchsia-50": "#fdf4ff",
  "fuchsia-100": "#fae8ff",
  "fuchsia-200": "#f5d0fe",
  "fuchsia-300": "#f0abfc",
  "fuchsia-400": "#e879f9",
  "fuchsia-500": "#d946ef",
  "fuchsia-600": "#c026d3",
  "fuchsia-700": "#a21caf",
  "fuchsia-800": "#86198f",
  "fuchsia-900": "#701a75",

  // Pink
  "pink-50": "#fdf2f8",
  "pink-100": "#fce7f3",
  "pink-200": "#fbcfe8",
  "pink-300": "#f9a8d4",
  "pink-400": "#f472b6",
  "pink-500": "#ec4899",
  "pink-600": "#db2777",
  "pink-700": "#be185d",
  "pink-800": "#9d174d",
  "pink-900": "#831843",

  // Rose
  "rose-50": "#fff1f2",
  "rose-100": "#ffe4e6",
  "rose-200": "#fecdd3",
  "rose-300": "#fda4af",
  "rose-400": "#fb7185",
  "rose-500": "#f43f5e",
  "rose-600": "#e11d48",
  "rose-700": "#be123c",
  "rose-800": "#9f1239",
  "rose-900": "#881337",

  // Special colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
}

// Convert Tailwind color to hex
const tailwindColorToHex = (colorName: string) => {
  return TAILWIND_COLORS[colorName] || "#000000"
}

// Convert Tailwind direction to CSS direction
const tailwindDirectionToCSS = (direction: string) => {
  const directionMap: Record<string, string> = {
    // Old Tailwind v3 syntax
    "bg-gradient-to-r": "to right",
    "bg-gradient-to-l": "to left",
    "bg-gradient-to-t": "to top",
    "bg-gradient-to-b": "to bottom",
    "bg-gradient-to-tr": "to top right",
    "bg-gradient-to-tl": "to top left",
    "bg-gradient-to-br": "to bottom right",
    "bg-gradient-to-bl": "to bottom left",
    // New Tailwind v4 syntax
    "bg-linear-to-r": "to right",
    "bg-linear-to-l": "to left",
    "bg-linear-to-t": "to top",
    "bg-linear-to-b": "to bottom",
    "bg-linear-to-tr": "to top right",
    "bg-linear-to-tl": "to top left",
    "bg-linear-to-br": "to bottom right",
    "bg-linear-to-bl": "to bottom left",
  }

  return directionMap[direction] || "to right"
}

// Parse Tailwind gradient code
const parseTailwindGradient = (code: string) => {
  const parts = code.split(" ")

  let direction = "bg-linear-to-r"
  let fromColor = ""
  let viaColor = ""
  let toColor = ""

  parts.forEach((part) => {
    // Handle both old and new gradient syntax for compatibility
    if (part.startsWith("bg-gradient-to-") || part.startsWith("bg-linear-to-")) {
      direction = part
    } else if (part.startsWith("gradient-from-")) {
      fromColor = part.replace("gradient-from-", "")
    } else if (part.startsWith("from-")) {
      fromColor = part.replace("from-", "")
    } else if (part.startsWith("gradient-via-")) {
      viaColor = part.replace("gradient-via-", "")
    } else if (part.startsWith("via-")) {
      viaColor = part.replace("via-", "")
    } else if (part.startsWith("gradient-to-")) {
      toColor = part.replace("gradient-to-", "")
    } else if (part.startsWith("to-")) {
      toColor = part.replace("to-", "")
    }
  })

  return { direction, fromColor, viaColor, toColor }
}

// Convert Tailwind to CSS
const tailwindToCSS = (code: string) => {
  const { direction, fromColor, viaColor, toColor } = parseTailwindGradient(code)

  const cssDirection = tailwindDirectionToCSS(direction)
  const fromHex = tailwindColorToHex(fromColor)
  const toHex = tailwindColorToHex(toColor)

  if (viaColor) {
    const viaHex = tailwindColorToHex(viaColor)
    return `background: linear-gradient(${cssDirection}, ${fromHex}, ${viaHex}, ${toHex});`
  }

  return `background: linear-gradient(${cssDirection}, ${fromHex}, ${toHex});`
}

// Convert Tailwind to SCSS
const tailwindToSCSS = (code: string) => {
  const { direction, fromColor, viaColor, toColor } = parseTailwindGradient(code)

  const cssDirection = tailwindDirectionToCSS(direction)
  const fromHex = tailwindColorToHex(fromColor)
  const toHex = tailwindColorToHex(toColor)

  let scss = `$from-color: ${fromHex};\n`
  scss += `$to-color: ${toHex};\n`

  if (viaColor) {
    const viaHex = tailwindColorToHex(viaColor)
    scss += `$via-color: ${viaHex};\n\n`
    scss += `.gradient {\n  background: linear-gradient(${cssDirection}, $from-color, $via-color, $to-color);\n}`
  } else {
    scss += `\n.gradient {\n  background: linear-gradient(${cssDirection}, $from-color, $to-color);\n}`
  }

  return scss
}

// Convert Tailwind to CSS-in-JS
const tailwindToCSSinJS = (code: string) => {
  const { direction, fromColor, viaColor, toColor } = parseTailwindGradient(code)

  const cssDirection = tailwindDirectionToCSS(direction)
  const fromHex = tailwindColorToHex(fromColor)
  const toHex = tailwindColorToHex(toColor)

  if (viaColor) {
    const viaHex = tailwindColorToHex(viaColor)
    return `const styles = {\n  gradient: {\n    background: 'linear-gradient(${cssDirection}, ${fromHex}, ${viaHex}, ${toHex})'\n  }\n};\n\n// For styled-components\nconst Gradient = styled.div\`\n  background: linear-gradient(${cssDirection}, ${fromHex}, ${viaHex}, ${toHex});\n\`;`
  }

  return `const styles = {\n  gradient: {\n    background: 'linear-gradient(${cssDirection}, ${fromHex}, ${toHex})'\n  }\n};\n\n// For styled-components\nconst Gradient = styled.div\`\n  background: linear-gradient(${cssDirection}, ${fromHex}, ${toHex});\n\`;`
}

// Convert Tailwind to CSS Custom Properties
const tailwindToCSSVars = (code: string) => {
  const { direction, fromColor, viaColor, toColor } = parseTailwindGradient(code)

  const cssDirection = tailwindDirectionToCSS(direction)
  const fromHex = tailwindColorToHex(fromColor)
  const toHex = tailwindColorToHex(toColor)

  let cssVars = `:root {\n  --gradient-from: ${fromHex};\n  --gradient-to: ${toHex};\n`

  if (viaColor) {
    const viaHex = tailwindColorToHex(viaColor)
    cssVars += `  --gradient-via: ${viaHex};\n`
    cssVars += `}\n\n.gradient {\n  background: linear-gradient(\n    ${cssDirection},\n    var(--gradient-from),\n    var(--gradient-via),\n    var(--gradient-to)\n  );\n}`
  } else {
    cssVars += `}\n\n.gradient {\n  background: linear-gradient(\n    ${cssDirection},\n    var(--gradient-from),\n    var(--gradient-to)\n  );\n}`
  }

  return cssVars
}

interface CodeDisplayProps {
  code: string
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, format: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(format)
          setTimeout(() => setCopied(null), 2000)
        })
      } else {
        // Fallback for browsers that don't support the Clipboard API
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
          setCopied(format)
          setTimeout(() => setCopied(null), 2000)
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
      <Tabs defaultValue="tailwind" className="w-full">
        <div className="flex justify-between items-center mb-2">
          <TabsList className="bg-black/30">
            <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="scss">SCSS</TabsTrigger>
            <TabsTrigger value="cssInJs">CSS-in-JS</TabsTrigger>
            <TabsTrigger value="cssVars">CSS Variables</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tailwind">
          <pre className="p-2 rounded bg-app-muted/50 dark:bg-black/50 text-app-foreground dark:text-white overflow-x-auto max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-app-muted-foreground/30 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <code>{code}</code>
          </pre>
          <motion.div
            className="absolute top-[52px] right-2 z-10 bg-black/50 backdrop-blur-xs rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-gray-800"
              onClick={() => copyToClipboard(code, "tailwind")}
            >
              {copied === "tailwind" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">{copied === "tailwind" ? "Copied" : "Copy code"}</span>
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="css">
          <pre className="p-2 rounded bg-app-muted/50 dark:bg-black/50 text-app-foreground dark:text-white overflow-x-auto max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-app-muted-foreground/30 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <code>{tailwindToCSS(code)}</code>
          </pre>
          <motion.div
            className="absolute top-[52px] right-2 z-10 bg-black/50 backdrop-blur-xs rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-gray-800"
              onClick={() => copyToClipboard(tailwindToCSS(code), "css")}
            >
              {copied === "css" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">{copied === "css" ? "Copied" : "Copy code"}</span>
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="scss">
          <pre className="p-2 rounded bg-app-muted/50 dark:bg-black/50 text-app-foreground dark:text-white overflow-x-auto max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-app-muted-foreground/30 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <code>{tailwindToSCSS(code)}</code>
          </pre>
          <motion.div
            className="absolute top-[52px] right-2 z-10 bg-black/50 backdrop-blur-xs rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-gray-800"
              onClick={() => copyToClipboard(tailwindToSCSS(code), "scss")}
            >
              {copied === "scss" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">{copied === "scss" ? "Copied" : "Copy code"}</span>
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="cssInJs">
          <pre className="p-2 rounded bg-app-muted/50 dark:bg-black/50 text-app-foreground dark:text-white overflow-x-auto max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-app-muted-foreground/30 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <code>{tailwindToCSSinJS(code)}</code>
          </pre>
          <motion.div
            className="absolute top-[52px] right-2 z-10 bg-black/50 backdrop-blur-xs rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-gray-800"
              onClick={() => copyToClipboard(tailwindToCSSinJS(code), "cssInJs")}
            >
              {copied === "cssInJs" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">{copied === "cssInJs" ? "Copied" : "Copy code"}</span>
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="cssVars">
          <pre className="p-2 rounded bg-app-muted/50 dark:bg-black/50 text-app-foreground dark:text-white overflow-x-auto max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-app-muted-foreground/30 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <code>{tailwindToCSSVars(code)}</code>
          </pre>
          <motion.div
            className="absolute top-[52px] right-2 z-10 bg-black/50 backdrop-blur-xs rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-app-muted-foreground dark:text-gray-400 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-gray-800"
              onClick={() => copyToClipboard(tailwindToCSSVars(code), "cssVars")}
            >
              {copied === "cssVars" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">{copied === "cssVars" ? "Copied" : "Copy code"}</span>
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

