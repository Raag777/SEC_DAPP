/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
