/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        risk: {
          high: "#dc2626",
          medium: "#ea580c",
          low: "#ca8a04",
          positive: "#16a34a",
        },
      },
    },
  },
  plugins: [],
};
