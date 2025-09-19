import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        sketch: {
          paper: "#ffffff",
          ink: "#2d2d2d",
          light: "#f8f8f8",
          shadow: "#e0e0e0",
          accent: "#4a5568",
          success: "#38a169",
          warning: "#d69e2e",
          danger: "#e53e3e",
        },
      },
      fontFamily: {
        sketch: ["Kalam", "Comic Neue", "cursive"],
        handwritten: ["Caveat", "cursive"],
        comic: ["Comic Neue", "cursive"],
        game: ["Press Start 2P", "monospace"],
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "pulse-fast": "pulse 1s infinite",
        shake: "shake 0.5s ease-in-out infinite",
        fire: "fire 0.5s ease-in-out infinite alternate",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        fire: {
          "0%": { transform: "scale(1) rotate(-1deg)" },
          "100%": { transform: "scale(1.1) rotate(1deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
