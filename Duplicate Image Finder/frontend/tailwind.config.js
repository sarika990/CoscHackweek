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
        dark: {
          bg: '#0b0f19',
          card: 'rgba(17, 25, 40, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        light: {
          bg: '#f8fafc',
          card: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(0, 0, 0, 0.08)'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
