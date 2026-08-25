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
          50: "#f6f8f6",
          100: "#eaf0ea",
          200: "#d5e2d5",
          300: "#b3cab4",
          400: "#8baa8d",
          500: "#658b68",
          600: "#4e7051",
          700: "#3e5841",
          800: "#334735",
          900: "#2a3a2c",
          // Refined Stone & Geological Palette
          stoneBgDark: "#080b10",
          stoneSurfaceDark: "#0f1520",
          stoneElevatedDark: "#151e2d",
          stoneBorderDark: "#1a2538",
          stoneBorderHoverDark: "#273752",
          
          stoneBgLight: "#fbf9f5",
          stoneSurfaceLight: "#ffffff",
          stoneElevatedLight: "#f4f0e8",
          stoneBorderLight: "#e5e0d5",
          stoneBorderHoverLight: "#ccc5b6",
          
          emeraldAccent: "#10b981",
          emeraldMuted: "#064e3b",
          amberAccent: "#d97706",
          purpleAccent: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest: ".15em",
      },
      maxWidth: {
        reading: "46rem",
      },
    },
  },
  plugins: [],
};

export default config;
