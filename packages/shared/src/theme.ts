// Single source of truth for Doctor Contract's design tokens.
// Both the web app (Next.js/Tailwind, via CSS variables generated from
// this file) and the mobile app (React Native StyleSheet) read from here,
// so the two stay visually in sync.

export const Colors = {
  primary: "#1B3A8C",
  primaryDark: "#12295E",
  secondary: "#22C55E",
  secondaryLight: "#DCFCE7",
  background: "#FFFFFF",
  backgroundSoft: "#F4F7FE",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
} as const;

export type ColorToken = keyof typeof Colors;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
