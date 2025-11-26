/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 🌞 Solar Energy Theme Colors
        solar: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",  // Main sun/solar color
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        energy: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",  // Main green/energy color
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",  // Main sky/clean energy color
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        earth: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",  // Neutral earth tone
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },

      boxShadow: {
        solar: "0 4px 14px 0 rgba(245, 158, 11, 0.15)",
        'solar-lg': "0 10px 40px 0 rgba(245, 158, 11, 0.2)",
        energy: "0 4px 14px 0 rgba(34, 197, 94, 0.15)",
        'energy-lg': "0 10px 40px 0 rgba(34, 197, 94, 0.2)",
        clean: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },

      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },

      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
      },

      backgroundImage: {
        'solar-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'energy-gradient': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'sky-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        'sunrise': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)',
      },
    },
  },
  plugins: [],
};
