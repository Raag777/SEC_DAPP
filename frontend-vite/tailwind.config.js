/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
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
