// @ts-nocheck - Suppressing type errors due to Zustand type compatibility issues
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { saveGradientLocally, getLocalGradients, deleteLocalGradient, clearLocalGradients, initOfflineStorage } from "./offline-storage"

// Tailwind color options
export const COLORS = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
]

// Tailwind color intensities
export const INTENSITIES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]

// Gradient directions - Updated for Tailwind v4
export const DIRECTIONS = [
  { value: "bg-linear-to-r", label: "To Right", icon: "→" },
  { value: "bg-linear-to-l", label: "To Left", icon: "←" },
  { value: "bg-linear-to-t", label: "To Top", icon: "↑" },
  { value: "bg-linear-to-b", label: "To Bottom", icon: "↓" },
  { value: "bg-linear-to-tr", label: "To Top Right", icon: "↗" },
  { value: "bg-linear-to-tl", label: "To Top Left", icon: "↖" },
  { value: "bg-linear-to-br", label: "To Bottom Right", icon: "↘" },
  { value: "bg-linear-to-bl", label: "To Bottom Left", icon: "↙" },
  { value: "custom-angle", label: "Custom Angle", icon: "°" },
]

export type ColorOption = {
  color: string
  intensity: string
}

// Define GradientStore type if not already defined
type GradientStore = {
  // State
  direction: string;
  fromColor: ColorOption;
  viaColor: ColorOption;
  toColor: ColorOption;
  useVia: boolean;
  previewMode: "raw" | "component";
  componentType: "card" | "button" | "navbar" | "hero";
  gradientType: "linear" | "radial" | "conic";
  gradientAngle: number;

  // Actions
  setDirection: (direction: string) => void;
  setFromColor: (color: string, intensity: string) => void;
  setViaColor: (color: string, intensity: string) => void;
  setToColor: (color: string, intensity: string) => void;
  setUseVia: (useVia: boolean) => void;
  setPreviewMode: (previewMode: "raw" | "component") => void;
  setComponentType: (componentType: "card" | "button" | "navbar" | "hero") => void;
  setGradientType: (type: "linear" | "radial" | "conic") => void;
  setGradientAngle: (angle: number) => void;
  generateRandomGradient: () => void;
  gradientClass: () => string;
  cssGradient: () => string;
}

// Helper function to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Helper function to format color class
const formatColorClass = (prefix: string, colorObj: ColorOption) => {
  // In Tailwind v4, gradient color classes use the 'gradient-' prefix
  const gradientPrefix = `gradient-${prefix}`

  if (colorObj.color === "white") return `${gradientPrefix}-white`
  if (colorObj.color === "transparent") return `${gradientPrefix}-transparent`
  if (colorObj.color === "black") return `${gradientPrefix}-black`
  return `${gradientPrefix}-${colorObj.color}-${colorObj.intensity}`
}

// Update the getCssDirection function in the store
const getCssDirection = (direction: string) => {
  const directionMap: Record<string, string> = {
    "bg-gradient-to-r": "to right",
    "bg-gradient-to-l": "to left",
    "bg-gradient-to-t": "to top",
    "bg-gradient-to-b": "to bottom",
    "bg-gradient-to-tr": "to top right",
    "bg-gradient-to-tl": "to top left",
    "bg-gradient-to-br": "to bottom right",
    "bg-gradient-to-bl": "to bottom left",
    // Add Tailwind v4 mappings
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

// Update the getColorValue function in the store
const getColorValue = (colorObj: ColorOption) => {
  if (colorObj.color === "white") return "#ffffff"
  if (colorObj.color === "transparent") return "transparent"
  if (colorObj.color === "black") return "#000000"

  // Use the Tailwind color mapping
  const colorMap: Record<string, Record<string, string>> = {
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
  }

  return colorMap[colorObj.color]?.[colorObj.intensity] || `var(--${colorObj.color}-${colorObj.intensity}, #888888)`
}

// Helper function to find the closest Tailwind color to a hex value
const findClosestTailwindColor = (hex: string): { color: string; intensity: string } => {
  // Remove # if present
  hex = hex.replace("#", "")

  // Convert hex to RGB
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  // Define Tailwind colors with their RGB values
  // This is a simplified version - a real implementation would include all Tailwind colors
  const tailwindColors = {
    slate: {
      "50": [248, 250, 252],
      "100": [241, 245, 249],
      "500": [100, 116, 139],
      "900": [15, 23, 42],
    },
    red: {
      "50": [254, 242, 242],
      "500": [239, 68, 68],
      "900": [127, 29, 29],
    },
    green: {
      "50": [240, 253, 244],
      "500": [34, 197, 94],
      "900": [20, 83, 45],
    },
    blue: {
      "50": [239, 246, 255],
      "500": [59, 130, 246],
      "900": [30, 58, 138],
    },
    // Add more colors as needed
  }

  let closestColor = "blue"
  let closestIntensity = "500"
  let minDistance = Number.MAX_VALUE

  // Find the closest Tailwind color
  for (const [color, intensities] of Object.entries(tailwindColors)) {
    for (const [intensity, [r2, g2, b2]] of Object.entries(intensities)) {
      // Calculate color distance using Euclidean distance
      const distance = Math.sqrt(Math.pow(r - r2, 2) + Math.pow(g - g2, 2) + Math.pow(b - b2, 2))

      if (distance < minDistance) {
        minDistance = distance
        closestColor = color
        closestIntensity = intensity
      }
    }
  }

  return { color: closestColor, intensity: closestIntensity }
}

// Helper function to migrate old gradient direction names to new Tailwind v4 format
const migrateGradientDirection = (oldDirection: string): string => {
  const migrationMap: Record<string, string> = {
    "bg-gradient-to-r": "bg-linear-to-r",
    "bg-gradient-to-l": "bg-linear-to-l",
    "bg-gradient-to-t": "bg-linear-to-t",
    "bg-gradient-to-b": "bg-linear-to-b",
    "bg-gradient-to-tr": "bg-linear-to-tr",
    "bg-gradient-to-tl": "bg-linear-to-tl",
    "bg-gradient-to-br": "bg-linear-to-br",
    "bg-gradient-to-bl": "bg-linear-to-bl",
  }
  return migrationMap[oldDirection] || "bg-linear-to-r"
}

// Define the persist options type
type GradientPersist = {
  history: GradientHistoryItem[];
}

// Use a simpler approach with type assertion for the entire store creation
// This is a workaround for Zustand type compatibility issues
export const useGradientStore = create<GradientStore>()((set, get) => ({
  // Initial state
  direction: "bg-linear-to-r",
  fromColor: { color: "blue", intensity: "500" },
  viaColor: { color: "purple", intensity: "500" },
  toColor: { color: "pink", intensity: "500" },
  useVia: false,
  previewMode: "raw",
  componentType: "card",
  gradientType: "linear",
  gradientAngle: 45,

  // Actions
  setDirection: (direction) => set({ direction }),
  setFromColor: (color, intensity) => set({ fromColor: { color, intensity } }),
  setViaColor: (color, intensity) => set({ viaColor: { color, intensity } }),
  setToColor: (color, intensity) => set({ toColor: { color, intensity } }),
  setUseVia: (useVia) => set({ useVia }),
  setPreviewMode: (previewMode) => set({ previewMode }),
  setComponentType: (componentType) => set({ componentType }),
  setGradientType: (gradientType) => set({ gradientType }),
  setGradientAngle: (gradientAngle) => set({ gradientAngle }),

  generateRandomGradient: () => {
    const { gradientType } = get()

    // Curated color combinations that work well together
    const curatedCombinations = [
      // Two-color combinations
      { from: "blue-500", to: "purple-500" },
      { from: "green-400", to: "blue-500" },
      { from: "yellow-300", to: "red-500" },
      { from: "pink-500", to: "rose-500" },
      { from: "indigo-500", to: "cyan-400" },
      { from: "red-400", to: "red-700" },
      { from: "blue-300", to: "blue-600" },
      { from: "green-200", to: "green-700" },
      { from: "indigo-400", to: "purple-500" },
      { from: "amber-200", to: "orange-600" },
      { from: "teal-300", to: "cyan-700" },
      { from: "slate-800", to: "slate-500" },
      { from: "zinc-800", to: "zinc-400" },
      { from: "stone-800", to: "amber-400" },
      { from: "sky-400", to: "indigo-900" },
      { from: "violet-500", to: "fuchsia-500" },
      { from: "lime-500", to: "emerald-500" },
      { from: "rose-500", to: "indigo-700" },
      { from: "amber-300", to: "pink-500" },
      { from: "cyan-500", to: "blue-900" },
      { from: "fuchsia-600", to: "pink-400" },

      // Three-color combinations (with via)
      { from: "slate-900", via: "purple-900", to: "orange-500" },
      { from: "purple-600", via: "pink-500", to: "orange-400" },
      { from: "blue-700", via: "blue-400", to: "emerald-400" },
      { from: "red-500", via: "purple-500", to: "blue-500" },
      { from: "green-500", via: "cyan-400", to: "blue-500" },
      { from: "purple-500", via: "pink-500", to: "red-500" },
      { from: "yellow-400", via: "orange-500", to: "red-600" },
      { from: "blue-600", via: "indigo-600", to: "purple-600" },
      { from: "emerald-500", via: "teal-500", to: "cyan-500" },
    ]

    // Select a random combination
    const randomCombination = curatedCombinations[Math.floor(Math.random() * curatedCombinations.length)]

    // Parse the color and intensity
    const parseColorIntensity = (colorStr: string) => {
      const [color, intensity] = colorStr.split('-')
      return { color, intensity }
    }

    const fromColorObj = parseColorIntensity(randomCombination.from)
    const toColorObj = parseColorIntensity(randomCombination.to)

    // Handle via color if present
    let useVia = false
    let viaColorObj = { color: "purple", intensity: "500" }

    if (randomCombination.via) {
      useVia = true
      viaColorObj = parseColorIntensity(randomCombination.via)
    }

    // Random direction based on gradient type
    let randomDirection
    let randomAngle = Math.floor(Math.random() * 360)

    if (gradientType === "linear") {
      // For linear gradients, either use a predefined direction or custom angle
      if (Math.random() > 0.3) {
        // Use a predefined direction (70% chance)
        randomDirection = DIRECTIONS[Math.floor(Math.random() * (DIRECTIONS.length - 1))].value // Exclude custom-angle
      } else {
        // Use custom angle (30% chance)
        randomDirection = "custom-angle"
      }
    } else if (gradientType === "radial") {
      const radialPositions = ["radial-at-t", "radial-at-b", "radial-at-l", "radial-at-r", "radial-at-c"]
      randomDirection = radialPositions[Math.floor(Math.random() * radialPositions.length)]
    } else if (gradientType === "conic") {
      const conicPositions = ["conic-at-t", "conic-at-b", "conic-at-c"]
      randomDirection = conicPositions[Math.floor(Math.random() * conicPositions.length)]
    }

    set({
      fromColor: fromColorObj,
      viaColor: viaColorObj,
      toColor: toColorObj,
      useVia,
      direction: randomDirection,
      gradientAngle: randomAngle,
      // Keep existing gradient type
      gradientType,
    })
  },

  gradientClass: () => {
    const { direction, fromColor, viaColor, toColor, useVia, gradientType } = get()
    let className = ""

    if (gradientType === "linear") {
      className = direction
    } else if (gradientType === "radial") {
      className = `bg-radial ${direction}`
    } else if (gradientType === "conic") {
      className = `bg-conic ${direction}`
    }

    className += ` gradient-from-${fromColor.color}-${fromColor.intensity}`
    if (useVia) {
      className += ` gradient-via-${viaColor.color}-${viaColor.intensity}`
    }
    className += ` gradient-to-${toColor.color}-${toColor.intensity}`

    return className
  },

  cssGradient: () => {
    const { direction, fromColor, viaColor, toColor, useVia, gradientType, gradientAngle } = get()
    let gradient = ""

    // Helper function to get CSS color value
    const getColorValue = (color: ColorOption) => {
      if (color.color === "white") return "white"
      if (color.color === "black") return "black"
      if (color.color === "transparent") return "transparent"

      // Use the color map to get the actual hex value
      const colorMap: Record<string, Record<string, string>> = {
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
        red: {
          "50": "#fef2f2", "100": "#fee2e2", "200": "#fecaca", "300": "#fca5a5",
          "400": "#f87171", "500": "#ef4444", "600": "#dc2626", "700": "#b91c1c",
          "800": "#991b1b", "900": "#7f1d1d"
        },
        blue: {
          "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd",
          "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8",
          "800": "#1e40af", "900": "#1e3a8a"
        },
        green: {
          "50": "#f0fdf4", "100": "#dcfce7", "200": "#bbf7d0", "300": "#86efac",
          "400": "#4ade80", "500": "#22c55e", "600": "#16a34a", "700": "#15803d",
          "800": "#166534", "900": "#14532d"
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
        purple: {
          "50": "#faf5ff", "100": "#f3e8ff", "200": "#e9d5ff", "300": "#d8b4fe",
          "400": "#c084fc", "500": "#a855f7", "600": "#9333ea", "700": "#7e22ce",
          "800": "#6b21a8", "900": "#581c87"
        },
        pink: {
          "50": "#fdf2f8", "100": "#fce7f3", "200": "#fbcfe8", "300": "#f9a8d4",
          "400": "#f472b6", "500": "#ec4899", "600": "#db2777", "700": "#be185d",
          "800": "#9d174d", "900": "#831843"
        }
      }

      return colorMap[color.color]?.[color.intensity] || "#64748b" // Default to slate-500 if not found
    }

    if (gradientType === "linear") {
      if (direction === "custom-angle") {
        gradient = `linear-gradient(${gradientAngle}deg`
      } else {
        const directionMap: Record<string, string> = {
          "bg-linear-to-t": "to top",
          "bg-linear-to-tr": "to top right",
          "bg-linear-to-r": "to right",
          "bg-linear-to-br": "to bottom right",
          "bg-linear-to-b": "to bottom",
          "bg-linear-to-bl": "to bottom left",
          "bg-linear-to-l": "to left",
          "bg-linear-to-tl": "to top left",
        }
        gradient = `linear-gradient(${directionMap[direction] || "to right"}`
      }
    } else if (gradientType === "radial") {
      let position = "center"
      if (direction === "radial-at-t") position = "top"
      else if (direction === "radial-at-b") position = "bottom"
      else if (direction === "radial-at-l") position = "left"
      else if (direction === "radial-at-r") position = "right"
      gradient = `radial-gradient(circle at ${position}`
    } else if (gradientType === "conic") {
      let position = "center"
      if (direction === "conic-at-t") position = "top"
      else if (direction === "conic-at-b") position = "bottom"
      gradient = `conic-gradient(from ${gradientAngle}deg at ${position}`
    }

    gradient += `, ${getColorValue(fromColor)}`
    if (useVia) {
      gradient += `, ${getColorValue(viaColor)}`
    }
    gradient += `, ${getColorValue(toColor)})`

    return gradient
  },
}))

