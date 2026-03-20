import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "../../apps/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // "The Midnight Architect" dual typeface system
        inter:   ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        sans:    ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          dim:        "hsl(var(--primary-dim))",
          container:  "hsl(var(--primary-container))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Tertiary — Neon Rose for alerts / urgent insights
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Surface Hierarchy — The Midnight Architect
        surface: {
          DEFAULT:   "hsl(var(--surface))",
          low:       "hsl(var(--surface-low))",
          container: "hsl(var(--surface-container))",
          high:      "hsl(var(--surface-high))",
          highest:   "hsl(var(--surface-highest))",
        },
        "on-surface":         "hsl(var(--on-surface))",
        "on-surface-variant": "hsl(var(--on-surface-variant))",
        "outline-variant":    "hsl(var(--outline-variant))",
        success: { DEFAULT: "hsl(160 84% 39%)" },
        warning: { DEFAULT: "hsl(38 92% 50%)" },
        info:    { DEFAULT: "hsl(199 89% 48%)" },
      },
      borderRadius: {
        // Per design: use xl (0.75rem) for large cards, not DEFAULT
        lg:    "var(--radius)",
        md:    "calc(var(--radius) - 2px)",
        sm:    "calc(var(--radius) - 4px)",
        xl:    "0.75rem",
        "2xl": "1rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        shimmer:          "shimmer 2s linear infinite",
        "glow-pulse":     "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
