/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,md,mdx}",
    "./components/**/*.{js,jsx,md,mdx}",
    "./lib/**/*.{js,jsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08080A",
          900: "#0B0B0F",
          800: "#111114",
        },
        glass: {
          surface: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.10)",
        },
        accent: {
          silver: "#C9CDD3",
          ember: "#E8743C",
          violet: "#7C5CFF",
        },
        text: {
          primary: "#F5F5F7",
          muted: "#A1A1AA",
          dim: "#71717A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        mesh: {
          "0%, 100%": { transform: "scale(1) translate(0, 0)" },
          "33%": { transform: "scale(1.05) translate(2%, -3%)" },
          "66%": { transform: "scale(0.98) translate(-2%, 2%)" },
        },
        blob1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(5%, 10%) scale(1.05)" },
          "50%": { transform: "translate(10%, 5%) scale(0.95)" },
          "75%": { transform: "translate(3%, -5%) scale(1.02)" },
        },
        blob2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-8%, 6%) scale(0.96)" },
          "50%": { transform: "translate(-4%, -8%) scale(1.04)" },
          "75%": { transform: "translate(5%, 3%) scale(0.98)" },
        },
        blob3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(8%, -6%) scale(1.06)" },
          "66%": { transform: "translate(-6%, 8%) scale(0.94)" },
        },
        blob4: {
          "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "25%": { transform: "translate(-10%, 8%) scale(1.1) rotate(45deg)" },
          "50%": { transform: "translate(6%, -10%) scale(0.9) rotate(90deg)" },
          "75%": { transform: "translate(10%, 4%) scale(1.05) rotate(135deg)" },
        },
      },
      fontSize: {
        display: [
          "clamp(3.5rem, 8vw, 7rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h2: [
          "clamp(2.25rem, 5vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        h3: [
          "clamp(1.5rem, 3vw, 2rem)",
          { lineHeight: "1.2", fontWeight: "600" },
        ],
        body: [
          "clamp(1rem, 1.125vw, 1.125rem)",
          { lineHeight: "1.6" },
        ],
      },
    },
  },
  plugins: [],
};
