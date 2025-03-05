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

// Gradient directions
export const DIRECTIONS = [
  { value: "bg-gradient-to-r", label: "To Right", icon: "→" },
  { value: "bg-gradient-to-l", label: "To Left", icon: "←" },
  { value: "bg-gradient-to-t", label: "To Top", icon: "↑" },
  { value: "bg-gradient-to-b", label: "To Bottom", icon: "↓" },
  { value: "bg-gradient-to-tr", label: "To Top Right", icon: "↗" },
  { value: "bg-gradient-to-tl", label: "To Top Left", icon: "↖" },
  { value: "bg-gradient-to-br", label: "To Bottom Right", icon: "↘" },
  { value: "bg-gradient-to-bl", label: "To Bottom Left", icon: "↙" },
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
  if (colorObj.color === "white") return `${prefix}-white`
  if (colorObj.color === "transparent") return `${prefix}-transparent`
  if (colorObj.color === "black") return `${prefix}-black`
  return `${prefix}-${colorObj.color}-${colorObj.intensity}`
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
    pink: {
      "900": "#831843",
      "500": "#ec4899",
      // Add other intensities as needed
    },
    lime: {
      "500": "#84cc16",
      // Add other intensities as needed
    },
    emerald: {
      "500": "#10b981",
      // Add other intensities as needed
    },
    // Add other colors as needed
  }

  return colorMap[colorObj.color]?.[colorObj.intensity] || `var(--${colorObj.color}-${colorObj.intensity})`
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

// Define the persist options type
type GradientPersist = {
  history: GradientHistoryItem[];
}

// Use a simpler approach with type assertion for the entire store creation
// This is a workaround for Zustand type compatibility issues
export const useGradientStore = create<GradientStore>()((persist as any)(
  (set, get) => ({
    // Default values
    direction: "bg-gradient-to-r",
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

    // Add a new method to load gradients from offline storage
    loadGradientsFromStorage: async () => {
      const localGradients = await getLocalGradients()
      if (localGradients.length > 0) {
        set({ history: localGradients.slice(0, 20) })
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

    applyFromHistory: (item: GradientHistoryItem) => {
      set({
        direction: item.direction,
        fromColor: item.fromColor,
        toColor: item.toColor,
        useVia: item.useVia,
        ...(item.useVia && item.viaColor ? { viaColor: item.viaColor } : {}),
      })
    },

    // Computed values
    gradientClass: () => {
      const { direction, fromColor, viaColor, toColor, useVia } = get()

      const from = formatColorClass("from", fromColor)
      const via = useVia ? formatColorClass("via", viaColor) : ""
      const to = formatColorClass("to", toColor)

      return [direction, from, via, to].filter(Boolean).join(" ")
    },

    // Update the cssGradient computed value in the store
    cssGradient: () => {
      const { direction, fromColor, viaColor, toColor, useVia } = get()

      const colors = [getColorValue(fromColor), ...(useVia ? [getColorValue(viaColor)] : []), getColorValue(toColor)]

      return `linear-gradient(${getCssDirection(direction)}, ${colors.join(", ")})`
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

