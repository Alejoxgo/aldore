import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff", 100: "#dbe7ff", 200: "#bcd2ff", 300: "#8eb3ff",
          400: "#5a88ff", 500: "#3461fa", 600: "#2244ef", 700: "#1b33d4",
          800: "#1c2dab", 900: "#1d2c86", 950: "#151c52",
        },
        accent: { 400: "#2ee6c5", 500: "#14d1b0", 600: "#0aa98f" },
        ink: { 900: "#0b1020", 800: "#111831", 700: "#1a2342" },
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
