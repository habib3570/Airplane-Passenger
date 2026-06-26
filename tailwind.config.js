/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        navy: {
          50: "#eef2f9",
          100: "#d6e0f0",
          200: "#aec2e1",
          300: "#7f9dcc",
          400: "#4f72ab",
          500: "#2f4f86",
          600: "#1f3a68",
          700: "#172c50",
          800: "#101f3a",
          900: "#0a1528",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};