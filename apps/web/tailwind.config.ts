import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-green-deep": "#1a3b32",
        "brand-green-mid": "#2d5a4c",
        "brand-ivory": "#f2f6f2",
        "brand-neutral": "#e7ece7",
        "brand-gold": "#c5a47e",
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-display)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
