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
]

export type ColorOption = {
  color: string
  intensity: string
}

export type GradientHistoryItem = {
  id: string
  direction: string
  fromColor: ColorOption
  viaColor?: ColorOption
  toColor: ColorOption
  useVia: boolean
  timestamp: number
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
  history: GradientHistoryItem[];

  // Actions
  setDirection: (direction: string) => void;
  setFromColor: (color: string, intensity: string) => void;
  setViaColor: (color: string, intensity: string) => void;
  setToColor: (color: string, intensity: string) => void;
  setUseVia: (useVia: boolean) => void;
  setPreviewMode: (previewMode: "raw" | "component") => void;
  setComponentType: (componentType: "card" | "button" | "navbar" | "hero") => void;
  generateRandomGradient: () => void;
  addToHistory: () => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  loadGradientsFromStorage: () => Promise<void>;
  clearHistory: () => Promise<void>;
  applyFromHistory: (item: GradientHistoryItem) => void;
  gradientClass: () => string;
  cssGradient: () => string;
  findClosestTailwindColor: (hex: string) => { color: string; intensity: string };
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
export const useGradientStore = create<GradientStore>()((persist as any)(
  (set, get) => ({
    // Default values - Updated for Tailwind v4
    direction: "bg-linear-to-r",
    fromColor: { color: "blue", intensity: "500" },
    viaColor: { color: "purple", intensity: "500" },
    toColor: { color: "pink", intensity: "500" },
    useVia: true,
    previewMode: "raw",
    componentType: "card",
    history: [],

    // Actions
    setDirection: (direction: string) => set({ direction }),
    setFromColor: (color: string, intensity: string) => {
      set({ fromColor: { color, intensity } })
      setTimeout(() => get().addToHistory(), 100)
    },
    setViaColor: (color: string, intensity: string) => {
      set({ viaColor: { color, intensity } })
      setTimeout(() => get().addToHistory(), 100)
    },
    setToColor: (color: string, intensity: string) => {
      set({ toColor: { color, intensity } })
      setTimeout(() => get().addToHistory(), 100)
    },
    setUseVia: (useVia: boolean) => {
      set({ useVia })
      setTimeout(() => get().addToHistory(), 100)
    },
    setPreviewMode: (previewMode: "raw" | "component") => set({ previewMode }),
    setComponentType: (componentType: "card" | "button" | "navbar" | "hero") => set({ componentType }),

    // Gradient operations
    generateRandomGradient: () => {
      const randomColor = () => ({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        intensity: INTENSITIES[Math.floor(Math.random() * INTENSITIES.length)],
      })

      set({
        fromColor: randomColor(),
        viaColor: randomColor(),
        toColor: randomColor(),
        direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)].value,
      })

      setTimeout(() => get().addToHistory(), 100)
    },

    // Override addToHistory to use offline storage
    addToHistory: async () => {
      const { direction, fromColor, viaColor, toColor, useVia, history } = get()

      const currentGradient = {
        id: generateId(),
        direction,
        fromColor,
        viaColor,
        toColor,
        useVia,
        timestamp: Date.now(),
      }

      // Check if this exact gradient is already in history
      const isDuplicate = history.some(
        (item) =>
          item.direction === direction &&
          item.fromColor.color === fromColor.color &&
          item.fromColor.intensity === fromColor.intensity &&
          item.toColor.color === toColor.color &&
          item.toColor.intensity === toColor.intensity &&
          item.useVia === useVia &&
          (!useVia || (item.viaColor?.color === viaColor.color && item.viaColor?.intensity === viaColor.intensity)),
      )

      if (!isDuplicate) {
        // Save to local storage
        await saveGradientLocally(currentGradient)

        // Add to state
        set({ history: [currentGradient, ...history].slice(0, 20) })
      }
    },

    // Override removeFromHistory to use offline storage
    removeFromHistory: async (id: string) => {
      const { history } = get()

      // Delete from local storage
      await deleteLocalGradient(id)

      // Update state
      set({ history: history.filter((item) => item.id !== id) })
    },

    // Load gradients from storage
    loadGradientsFromStorage: async () => {
      try {
        const gradients = await getLocalGradients()

        // Migrate old gradient directions to new Tailwind v4 format
        const migratedGradients = gradients.map(item => ({
          ...item,
          direction: migrateGradientDirection(item.direction)
        }))

        set({ history: migratedGradients })
      } catch (error) {
        console.error("Error loading gradients from storage:", error)
      }
    },

    // Update the clearHistory function in the store
    clearHistory: async () => {
      // First clear the history in the store
      set({ history: [] })

      try {
        // Then clear the gradients from IndexedDB
        await clearLocalGradients()

        // Also clear localStorage for the Zustand persist state
        if (typeof window !== 'undefined') {
          const zustandKey = 'gradient-store'
          localStorage.removeItem(zustandKey)
        }

        console.log("History cleared successfully from both store and IndexedDB")
      } catch (error) {
        console.error("Error clearing history:", error)
      }
    },

    // Apply gradient from history
    applyFromHistory: (item: GradientHistoryItem) => {
      // Migrate old gradient direction to new Tailwind v4 format if needed
      const direction = migrateGradientDirection(item.direction)

      set({
        direction,
        fromColor: item.fromColor,
        viaColor: item.viaColor || { color: "purple", intensity: "500" },
        toColor: item.toColor,
        useVia: item.useVia,
      })
    },

    // Computed values
    gradientClass: () => {
      const { direction } = get()
      // In Tailwind v4, we'll use the direction class only and apply the colors via inline style
      return direction
    },

    // Update the cssGradient computed value in the store
    cssGradient: () => {
      const { direction, fromColor, viaColor, toColor, useVia } = get()

      // Get the CSS direction from the Tailwind direction class
      const cssDirection = getCssDirection(direction)

      // Get the color values
      const fromColorValue = getColorValue(fromColor)
      const viaColorValue = useVia ? getColorValue(viaColor) : null
      const toColorValue = getColorValue(toColor)

      // Build the gradient string
      let gradientString = `linear-gradient(${cssDirection}`

      // Add the colors
      gradientString += `, ${fromColorValue}`
      if (viaColorValue) {
        gradientString += `, ${viaColorValue}`
      }
      gradientString += `, ${toColorValue})`

      return gradientString
    },
    findClosestTailwindColor: (hex: string) => findClosestTailwindColor(hex),
  }),
  {
    name: "gradient-storage",
    partialize: (state) => ({ history: state.history }),
    // Add an onRehydrateStorage callback to initialize offline storage
    onRehydrateStorage: () => (state) => {
      // Initialize offline storage
      if (typeof window !== "undefined") {
        initOfflineStorage()

        // Load gradients from storage if needed
        if (state && (!state.history || state.history.length === 0)) {
          setTimeout(() => {
            useGradientStore.getState().loadGradientsFromStorage()
          }, 0)
        }
      }
    },
  },
))

