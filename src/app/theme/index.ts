/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CHORUS DESIGN TOKENS
 * Centralized design system for AMS Enterprise Application
 *
 * WHY: Hardcoded values scattered across components cause:
 *   - Inconsistency when design changes
 *   - Impossible to theme globally
 *   - Difficult maintenance
 *
 * ENTERPRISE BENEFIT:
 *   - Single source of truth for all design values
 *   - Theme changes propagate instantly across entire app
 *   - Consistent visual language maintained at scale
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: "#EF652B", // Orange - primary buttons, key actions
    secondary: "#2D798D", // Teal - links, secondary actions
  },

  // Orange Palette
  orange: {
    50: "#FEF5EE",
    100: "#FDE0C5",
    200: "#FBBC9A",
    350: "#FF8D41",
    400: "#F27F45",
    500: "#EF652B",
    600: "#DF4417",
    700: "#C43A14",
  },

  // Teal Palette
  teal: {
    50: "#F0FAFB",
    100: "#D9F1F4",
    200: "#B8E3E9",
    400: "#4FB1C1",
    500: "#3395A7",
    600: "#2D798D",
    700: "#2B6373",
    800: "#2A5260",
  },

  // Chorus Black Palette
  black: {
    100: "#353750", // chorus-black-100
    200: "#2B2D46", // chorus-black-200
    300: "#121321", // chorus-black-300
    400: "#1A1B2E", // chorus-black-400
    500: "#121321", // chorus-black-500
  },

  // Chorus Gray Palette
  gray: {
    50: "#F7F7F8",
    100: "#F1F1F3",
    200: "#E9E9EC",
    300: "#DCDDE5",
    400: "#C6C7D2",
    500: "#AFB1C0",
    600: "#989AAE",
    700: "#8789A1",
    800: "#767893",
    900: "#676983",
  },

  // Status Colors
  status: {
    red: {
      50: "#FEF2F3",
      100: "#FFE1E3",
      300: "#FEA3A8",
      600: "#E0222D",
      700: "#BD1821",
    },
    yellow: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      500: "#F59E0B",
      700: "#B45309",
    },
    green: {
      50: "#EEFFF1",
      100: "#D8FFE1",
      500: "#0DC93C",
      600: "#05B430",
      700: "#088D2A",
    },
  },

  // Semantic Colors
  semantic: {
    success: "#0DC93C",
    warning: "#F59E0B",
    error: "#BD1821",
    info: "#3395A7",
  },

  // Chart Colors
  chart: {
    1: "oklch(0.646 0.222 41.116)",
    2: "oklch(0.6 0.118 184.704)",
    3: "oklch(0.398 0.07 227.392)",
    4: "oklch(0.828 0.189 84.429)",
    5: "oklch(0.769 0.188 70.08)",
  },

  // Legacy compatibility - mapped to CSS variables
  // DEPRECATED: Use semantic names above
  legacy: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    destructive: "var(--destructive)",
    border: "var(--border)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    muted: "var(--muted)",
    accent: "var(--accent)",
    ring: "var(--ring)",
  },
} as const;

export const typography = {
  // Font Families
  fonts: {
    sans: "'Manrope', sans-serif",
    display: "'Sora', sans-serif",
    mono: "'Manrope', monospace",
  },

  // Font Sizes
  sizes: {
    xs: "0.75rem",    // 12px
    sm: "0.8125rem",  // 13px
    md: "0.875rem",    // 14px - base
    base: "1rem",      // 16px
    lg: "1.125rem",    // 18px
    xl: "1.25rem",     // 20px
    "2xl": "1.5rem",   // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
  },

  // Font Weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  leading: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

export const spacing = {
  // Base spacing scale (4px increments)
  0: "0",
  0.5: "0.125rem",  // 2px
  1: "0.25rem",     // 4px
  1.5: "0.375rem",  // 6px
  2: "0.5rem",      // 8px
  2.5: "0.625rem",  // 10px
  3: "0.75rem",     // 12px
  3.5: "0.875rem",  // 14px
  4: "1rem",        // 16px
  5: "1.25rem",     // 20px
  6: "1.5rem",      // 24px
  7: "1.75rem",     // 28px
  8: "2rem",        // 32px
  9: "2.25rem",     // 36px
  10: "2.5rem",     // 40px
  11: "2.75rem",    // 44px
  12: "3rem",       // 48px
  14: "3.5rem",     // 56px
  16: "4rem",       // 64px
  20: "5rem",       // 80px
  24: "6rem",       // 96px
} as const;

export const radius = {
  none: "0",
  sm: "0.25rem",     // 4px
  md: "0.375rem",    // 6px - Chorus default
  lg: "0.5rem",      // 8px
  xl: "0.75rem",     // 12px
  "2xl": "1rem",     // 16px
  "3xl": "1.5rem",   // 24px
  full: "9999px",
} as const;

export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const;

export const transitions = {
  // Durations
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  // Timing functions
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT TOKENS
// Specific tokens for reusable component styling
// ─────────────────────────────────────────────────────────────────────────────

export const componentTokens = {
  // Button tokens
  button: {
    height: {
      sm: "2rem",    // 32px
      default: "2.5rem", // 40px
      lg: "2.75rem", // 44px
      xl: "3rem",    // 48px
    },
    padding: {
      sm: "0.75rem", // 12px
      default: "1.125rem", // 18px
      lg: "1.375rem", // 22px
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.8125rem", // 13px
      base: "0.875rem", // 14px
    },
  },

  // Input tokens
  input: {
    height: {
      default: "2.5rem",  // 40px
      lg: "3.25rem",      // 52px
    },
    padding: {
      x: "1.125rem", // 18px
    },
  },

  // Card tokens
  card: {
    padding: "1.5rem", // 24px
    radius: "0.75rem", // 12px
  },

  // Badge tokens
  badge: {
    padding: {
      x: "0.625rem", // 10px
      y: "0.25rem",  // 4px
    },
    fontSize: {
      xs: "0.6875rem", // 11px
      sm: "0.75rem",   // 12px
      base: "0.8125rem", // 13px
    },
  },

  // Sidebar tokens
  sidebar: {
    width: "16rem",   // 256px
    collapsedWidth: "4rem", // 64px
  },

  // Table tokens
  table: {
    headerHeight: "3rem", // 48px
    cellPadding: "1rem",  // 16px
    rowHeight: "4rem",    // 64px
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKEN OBJECT - Complete theme export
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  breakpoints,
  zIndex,
  transitions,
  componentTokens,
} as const;

export type Theme = typeof theme;
export default theme;