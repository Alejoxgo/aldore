import type { Config } from "tailwindcss";

// Identidad Aldore: papel cálido, tinta casi negra y un solo color de acento (bermellón).
const signal = {
  50: "#fdf1ec", 100: "#fbe0d5", 200: "#f6bfa9", 300: "#ef9673", 400: "#e86a42",
  500: "#e2471c", 600: "#c63b14", 700: "#a32f11", 800: "#842914", 900: "#6c2414", 950: "#3b0f07",
};

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: signal,
        accent: { 400: signal[400], 500: signal[500], 600: signal[600] },
        paper: { DEFAULT: "#f4f1ea", 2: "#ebe6db", line: "#d9d2c3" },
        ink: { 900: "#16130f", 800: "#221e19", 700: "#3a342c", 500: "#6b6358", 400: "#8f8679" },
      },
      fontFamily: {
        sans: ['"Inter Tight Variable"', "system-ui", "sans-serif"],
        serif: ['"Fraunces Variable"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
