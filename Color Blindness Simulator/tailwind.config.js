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
        primary: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
        },
        secondary: '#16a34a',
        accent: '#4ade80',
        brand: {
          dark: '#08130d',
          light: '#f4faf6',
        },
        glass: {
          card: 'rgba(255, 255, 255, 0.08)',
          cardLight: 'rgba(0, 0, 0, 0.04)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderLight: 'rgba(0, 0, 0, 0.08)',
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(34, 197, 94, 0.2)',
        'glow-accent': '0 0 20px rgba(74, 222, 128, 0.4)',
      }
    },
  },
  plugins: [],
}
