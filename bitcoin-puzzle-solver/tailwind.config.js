/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bitcoin: {
          orange: '#f7931a',
          dark: '#1a1a1a',
          darker: '#0d0d0d',
          gray: '#2a2a2a',
        }
      }
    },
  },
  plugins: [],
}
