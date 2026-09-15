module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f8fb",
          100: "#e9eef7",
          200: "#cfe0f0",
          300: "#b4d1e8",
          400: "#7fb7df",
          500: "#4a9cd6",
          600: "#2f7fb0",
          700: "#235f83",
          800: "#1a4861",
          900: "#102f3d",
        },
        accent: {
          DEFAULT: "#ff7aa2",
          500: "#ff7aa2",
          600: "#ff4f8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        "soft-lg": "0 10px 30px rgba(16,24,40,0.08)",
      },
    },
  },
  plugins: [],
};
