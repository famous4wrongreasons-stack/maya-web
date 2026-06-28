/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./sections/**/*.{js,jsx}",
    "./features/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#07070A",      // near-black, cool
        panel: "#0C0C10",
        ink: "#F4F0EB",       // cream
        muted: "#9A968E",
        line: "rgba(244,240,235,0.10)",
        gold: "#a8c03e",      // бренд-акцент переведён на синий (был #C9A86A)
        maya: "#a8c03e",      // cool blue (AI Maya, из приложения)
      },
      fontFamily: {
        sans: ["var(--font-mont)", "system-ui", "sans-serif"],
        maya: ["var(--font-maya)", "var(--font-mont)", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.32em",
        wide2: "0.18em",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        breathe: { "0%,100%": { opacity: 0.55 }, "50%": { opacity: 1 } },
      },
      animation: {
        breathe: "breathe 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
