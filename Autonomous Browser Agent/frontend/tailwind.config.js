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
        darkBg: '#05160E',
        darkCard: 'rgba(6, 28, 18, 0.45)',
        darkBorder: 'rgba(16, 185, 129, 0.15)',
        forestGreen: '#042A16',
        neonGreen: {
          light: '#39FF14',
          DEFAULT: '#10B981',
          glow: '#00FF87'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 15px rgba(16, 185, 129, 0.3)',
        'neon-strong': '0 0 25px rgba(0, 255, 135, 0.5)'
      }
    },
  },
  plugins: [],
}
