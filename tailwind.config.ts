import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        aravalli: {
          50: "#f7f9f7",
          100: "#eaf0ea",
          200: "#d5e2d5",
          300: "#b3cab4",
          400: "#8baa8d",
          500: "#658b68",
          600: "#4e7051",
          700: "#3e5841",
          800: "#334735",
          900: "#2a3a2c",
          // Dark Theme Tokens (Deep Mineral Slate & Charcoal)
          bgDark: "#090d13",
          surfaceDark: "#111622",
          surfaceElevatedDark: "#171e2e",
          borderDark: "#1f283c",
          borderHoverDark: "#2d3a56",
          textPrimaryDark: "#e6edf3",
          textMutedDark: "#8b949e",
          accentDark: "#10b981",
          accentMutedDark: "#064e3b",
          // Light Theme Tokens (Warm Earth & Parchment)
          bgLight: "#f9f8f5",
          surfaceLight: "#ffffff",
          surfaceElevatedLight: "#f3f1ec",
          borderLight: "#e2ded4",
          borderHoverLight: "#c8c2b4",
          textPrimaryLight: "#1c2128",
          textMutedLight: "#57606a",
          accentLight: "#047857",
          accentMutedLight: "#d1fae5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        reading: "46rem", // Optimal character count per line for deep reading
      },
    },
  },
  plugins: [],
};

export default config;
