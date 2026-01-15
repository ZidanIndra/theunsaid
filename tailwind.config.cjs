/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Source Sans 3", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out both",
        "fade-in-slow": "fadeIn 1s ease-out both"
      }
    }
  },
  plugins: []
};
