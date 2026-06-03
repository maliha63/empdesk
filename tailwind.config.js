/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        surface: {
          DEFAULT: "#f1f5f9",
          card:    "#ffffff",
          border:  "#e2e8f0",
          hover:   "#f8fafc",
          dark:         "#0b0f1a",
          "dark-card":  "#111827",
          "dark-card2": "#161d2e",
          "dark-border":"#1f2a3d",
          "dark-hover": "#1a2235",
        },
        text: {
          primary:   "#0f172a",
          secondary: "#475569",
          muted:     "#94a3b8",
          "dark-primary":   "#f1f5f9",
          "dark-secondary": "#94a3b8",
          "dark-muted":     "#4b5e7a",
        },
      },
      borderRadius: {
        "xl":  "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        "xs":         "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "card":       "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-md":    "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.04)",
        "card-hover": "0 12px 32px -4px rgb(0 0 0 / 0.10), 0 4px 12px -4px rgb(0 0 0 / 0.06)",
        "card-dark":  "0 1px 3px 0 rgb(0 0 0 / 0.4)",
        "card-dark-hover": "0 12px 32px -4px rgb(0 0 0 / 0.5)",
        "glow-brand": "0 0 20px -4px rgb(59 130 246 / 0.35)",
      },
      backgroundImage: {
        "grid-light": "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
        "grid-dark":  "radial-gradient(circle, #1f2a3d 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};