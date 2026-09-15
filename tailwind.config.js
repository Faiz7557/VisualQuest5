/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#070d18",
          900: "#0b1528",
          800: "#13233f",
          700: "#1b335a",
          600: "#27487d",
        },
        amber: {
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        iris: {
          orange: "#f97316",
          amber: "#f59e0b",
          blue: "#1d4ed8",
          cyan: "#06b6d4",
          navy: "#0a192f",
          card: "rgba(16, 28, 51, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        cluster: {
          0: "#10b981", // Maju & Terhubung (Emerald)
          1: "#ef4444", // Tertinggal Ekstrem (Rose Red)
          2: "#3b82f6", // Berkembang Menengah (Sky Blue)
          3: "#f59e0b", // Tertinggal Sedang (Amber)
        },
        urgency: {
          low: "#10b981",
          medium: "#f59e0b",
          high: "#ef4444",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(249, 115, 22, 0.3)",
        "glow-blue": "0 0 25px -5px rgba(59, 130, 246, 0.3)",
      }
    },
  },
  plugins: [],
};
