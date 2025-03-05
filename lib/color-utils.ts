// Convert RGB to HEX
export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
      })
      .join("")
  )
}

// Convert HEX to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

// Calculate color distance (Euclidean distance in RGB space)
export const colorDistance = (
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number },
): number => {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) + Math.pow(color1.g - color2.g, 2) + Math.pow(color1.b - color2.b, 2),
  )
}

// Tailwind color mapping (simplified version)
export const TAILWIND_COLORS = {
  slate: {
    "50": "#f8fafc",
    "100": "#f1f5f9",
    "200": "#e2e8f0",
    "300": "#cbd5e1",
    "400": "#94a3b8",
    "500": "#64748b",
    "600": "#475569",
    "700": "#334155",
    "800": "#1e293b",
    "900": "#0f172a",
  },
  gray: {
    "50": "#f9fafb",
    "100": "#f3f4f6",
    "200": "#e5e7eb",
    "300": "#d1d5db",
    "400": "#9ca3af",
    "500": "#6b7280",
    "600": "#4b5563",
    "700": "#374151",
    "800": "#1f2937",
    "900": "#111827",
  },
  red: {
    "50": "#fef2f2",
    "100": "#fee2e2",
    "200": "#fecaca",
    "300": "#fca5a5",
    "400": "#f87171",
    "500": "#ef4444",
    "600": "#dc2626",
    "700": "#b91c1c",
    "800": "#991b1b",
    "900": "#7f1d1d",
  },
  // Add more colors as needed
}

// Find the closest Tailwind color to a hex value
export const findClosestTailwindColor = (hex: string): { color: string; intensity: string } => {
  const rgb = hexToRgb(hex)
  if (!rgb) return { color: "gray", intensity: "500" }

  let closestColor = "gray"
  let closestIntensity = "500"
  let minDistance = Number.MAX_VALUE

  // Find the closest Tailwind color
  for (const [color, intensities] of Object.entries(TAILWIND_COLORS)) {
    for (const [intensity, hexValue] of Object.entries(intensities)) {
      const tailwindRgb = hexToRgb(hexValue)
      if (tailwindRgb) {
        const distance = colorDistance(rgb, tailwindRgb)
        if (distance < minDistance) {
          minDistance = distance
          closestColor = color
          closestIntensity = intensity
        }
      }
    }
  }

  return { color: closestColor, intensity: closestIntensity }
}

// Extract dominant colors from an image
export const extractDominantColors = (imageData: Uint8ClampedArray, colorCount = 3): string[] => {
  // Create a map to store color frequencies
  const colorMap: Record<string, number> = {}

  // Sample pixels at regular intervals
  const pixelCount = imageData.length / 4
  const sampleRate = Math.max(1, Math.floor(pixelCount / 1000)) // Sample at most 1000 pixels

  for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]
    const a = imageData[i + 3]

    // Skip transparent pixels
    if (a < 128) continue

    // Quantize colors to reduce the number of unique colors
    // This groups similar colors together
    const quantizedR = Math.round(r / 24) * 24
    const quantizedG = Math.round(g / 24) * 24
    const quantizedB = Math.round(b / 24) * 24

    const colorKey = `${quantizedR},${quantizedG},${quantizedB}`
    colorMap[colorKey] = (colorMap[colorKey] || 0) + 1
  }

  // Sort colors by frequency and get the top N
  const sortedColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(([color]) => {
      const [r, g, b] = color.split(",").map(Number)
      return rgbToHex(r, g, b)
    })

  return sortedColors
}

// Ensure colors have good contrast
export const ensureColorContrast = (colors: string[]): string[] => {
  if (colors.length <= 1) return colors

  const result = [colors[0]]

  for (let i = 1; i < colors.length; i++) {
    const currentRgb = hexToRgb(colors[i])
    if (!currentRgb) continue

    // Check contrast with all previously selected colors
    let hasGoodContrast = true
    for (const selectedColor of result) {
      const selectedRgb = hexToRgb(selectedColor)
      if (selectedRgb && colorDistance(currentRgb, selectedRgb) < 100) {
        hasGoodContrast = false
        break
      }
    }

    // If this color doesn't have good contrast, try to adjust it
    if (!hasGoodContrast) {
      // Simple adjustment: make it darker or lighter
      const adjusted = {
        r: Math.min(255, Math.max(0, currentRgb.r + (currentRgb.r > 128 ? -50 : 50))),
        g: Math.min(255, Math.max(0, currentRgb.g + (currentRgb.g > 128 ? -50 : 50))),
        b: Math.min(255, Math.max(0, currentRgb.b + (currentRgb.b > 128 ? -50 : 50))),
      }
      result.push(rgbToHex(adjusted.r, adjusted.g, adjusted.b))
    } else {
      result.push(colors[i])
    }
  }

  return result
}

