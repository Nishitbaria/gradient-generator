// Calculate relative luminance of a color
// Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20-TECHS/G17.html
export const calculateRelativeLuminance = (color: string): number => {
  try {
    // Remove # if present
    color = color.replace("#", "")

    // Handle shorthand hex (e.g., #FFF)
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
    }

    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
      // Default to black if invalid
      color = "000000"
    }

    // Convert hex to RGB
    const r = Number.parseInt(color.substring(0, 2), 16) / 255
    const g = Number.parseInt(color.substring(2, 4), 16) / 255
    const b = Number.parseInt(color.substring(4, 6), 16) / 255

    // Calculate relative luminance
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * R + 0.7152 * G + 0.0722 * B
  } catch (error) {
    console.error("Error in calculateRelativeLuminance:", error)
    return 0 // Return 0 in case of error
  }
}

// Improve the extractRepresentativeColor function to better handle light gradients
export const extractRepresentativeColor = (gradient: string): string => {
  // Ensure gradient is a string
  if (typeof gradient !== "string") {
    // Return a default color if gradient is not a string
    return "#1e293b"
  }

  // Check if it's a CSS gradient
  if (gradient.includes("linear-gradient")) {
    // Extract all colors from the gradient
    const colorMatches = gradient.match(/(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb$$[^)]+$$|rgba$$[^)]+$$)/g) || []

    if (colorMatches.length > 0) {
      // For accessibility, we should use the color with the lowest contrast against the text
      // For simplicity, we'll use the first color as a representative
      // In a more advanced implementation, we could analyze all colors
      return colorMatches[0]
    }
  }

  // If it's a hex color already, return it
  if (gradient.startsWith("#")) {
    return gradient
  }

  // Default to a dark color if we can't extract one
  return "#1e293b"
}

// Improve the calculateContrastRatio function to be more accurate
export const calculateContrastRatio = (textColor: string, backgroundColor: string): number => {
  try {
    // For gradients, we'll use a simplified approach
    // Extract a representative color from the gradient
    const bgColor = extractRepresentativeColor(backgroundColor)

    // Ensure textColor is valid
    if (!textColor || typeof textColor !== "string") {
      textColor = "#ffffff" // Default to white if invalid
    }

    // Remove # if present and handle shorthand hex
    let textColorHex = textColor.replace("#", "")
    if (textColorHex.length === 3) {
      textColorHex =
        textColorHex[0] + textColorHex[0] + textColorHex[1] + textColorHex[1] + textColorHex[2] + textColorHex[2]
    }

    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(textColorHex)) {
      textColorHex = "ffffff" // Default to white if invalid format
    }

    const textLuminance = calculateRelativeLuminance("#" + textColorHex)
    const bgLuminance = calculateRelativeLuminance(bgColor)

    // Calculate contrast ratio
    const lighter = Math.max(textLuminance, bgLuminance)
    const darker = Math.min(textLuminance, bgLuminance)

    return (lighter + 0.05) / (darker + 0.05)
  } catch (error) {
    console.error("Error in calculateContrastRatio:", error)
    return 0 // Return 0 in case of error
  }
}

// Add a new function to check if colors are too similar
export const areColorsTooSimilar = (color1: string, color2: string): boolean => {
  try {
    const rgb1 = hexToRgb(color1.replace("#", ""))
    const rgb2 = hexToRgb(color2.replace("#", ""))

    if (!rgb1 || !rgb2) return false

    // Calculate color distance (Euclidean distance in RGB space)
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2),
    )

    // Colors are too similar if distance is below threshold
    return distance < 30 // Adjust threshold as needed
  } catch (error) {
    console.error("Error in areColorsTooSimilar:", error)
    return false
  }
}

// Add this new function to suggest an initial text color based on the gradient
export const getDefaultTextColor = (gradient: string): string => {
  try {
    const bgColor = extractRepresentativeColor(gradient)
    const bgLuminance = calculateRelativeLuminance(bgColor)

    // If background is dark, suggest white text
    // If background is light, suggest dark text
    return bgLuminance < 0.5 ? "#FFFFFF" : "#1e293b"
  } catch (error) {
    console.error("Error in getDefaultTextColor:", error)
    return "#FFFFFF" // Default to white if there's an error
  }
}

// Generate accessible text colors for a given background
export const getTextColorSuggestions = (backgroundColor: string): string[] => {
  const bgColor = extractRepresentativeColor(backgroundColor)
  const bgLuminance = calculateRelativeLuminance(bgColor)

  // Determine if the background is light or dark
  const isDarkBg = bgLuminance < 0.5

  if (isDarkBg) {
    // For dark backgrounds, suggest light colors
    return [
      "#ffffff", // White
      "#f8fafc", // Slate 50
      "#f1f5f9", // Slate 100
      "#e2e8f0", // Slate 200
      "#f0fdf4", // Green 50
      "#ecfdf5", // Emerald 50
      "#f0fdfa", // Teal 50
      "#eff6ff", // Blue 50
    ]
  } else {
    // For light backgrounds, suggest dark colors
    return [
      "#000000", // Black
      "#0f172a", // Slate 900
      "#1e293b", // Slate 800
      "#334155", // Slate 700
      "#1e3a8a", // Blue 900
      "#312e81", // Indigo 900
      "#581c87", // Purple 900
      "#134e4a", // Teal 900
    ]
  }
}

// Check if text meets WCAG AA standards
export const meetsWCAGAA = (contrastRatio: number, fontSize: number, isBold: boolean): boolean => {
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold)
  return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5
}

// Check if text meets WCAG AAA standards
export const meetsWCAGAAA = (contrastRatio: number, fontSize: number, isBold: boolean): boolean => {
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold)
  return isLargeText ? contrastRatio >= 4.5 : contrastRatio >= 7
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

