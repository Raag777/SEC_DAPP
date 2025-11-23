/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",   // 🔥 REQUIRED FOR THEME TO WORK
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neonBlue: "#00eaff",
        neonPurple: "#7a00ff",
        neonPink: "#ff00ff",
        neonCyan: "#00fff2",
        neonGreen: "#39ff14",

        // 🌌 Premium Cyberpunk Backgrounds
        cyberBg: "#050B16",
        cyberPanel: "#0A1224",
      },

      boxShadow: {
        neon: "0 0 18px rgba(0,234,255,0.35), 0 0 40px rgba(122,0,255,0.25)",
        neonInner: "inset 0 0 12px rgba(0,234,255,0.3)",
        neonStrong: "0 0 25px rgba(0,234,255,0.9)",
      },

      keyframes: {
        neonPulse: {
          "0%,100%": { boxShadow: "0 0 12px rgba(0,234,255,0.25)" },
          "50%":     { boxShadow: "0 0 28px rgba(122,0,255,0.5)" },
        },
        neonFlicker: {
          "0%": { opacity: 0.9 },
          "5%": { opacity: 0.4 },
          "10%": { opacity: 1 },
          "15%": { opacity: 0.5 },
          "20%": { opacity: 1 },
          "100%": { opacity: 0.9 },
        }
      },

      animation: {
        neonPulse: "neonPulse 3s ease-in-out infinite",
        neonFlicker: "neonFlicker 4s infinite linear",
      }
    },
  },
  plugins: [],
};
