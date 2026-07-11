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
        bg: {
          primary:   '#071A14',
          secondary: '#0D2E25',
          card:      '#143E31',
          'card-hover': '#174A3B',
        },
        accent: {
          DEFAULT: '#00E676',
          bright:  '#39FF88',
          dim:     '#00C853',
        },
        text: {
          primary:   '#FFFFFF',
          secondary: '#D4F8E8',
          muted:     '#9CC9B5',
        },
        success: '#00FF88',
        danger:  '#FF6B6B',
        warn:    '#FFC857',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glass:         '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,230,118,0.08)',
        'glass-hover': '0 16px 48px rgba(0,0,0,0.5), 0 0 20px rgba(0,230,118,0.08)',
        accent:        '0 0 20px rgba(0,230,118,0.25)',
        'accent-strong': '0 0 35px rgba(0,230,118,0.45)',
        btn:           '0 4px 15px rgba(0,230,118,0.35)',
        'btn-hover':   '0 6px 25px rgba(0,230,118,0.5)',
      },
      backdropBlur: {
        glass: '16px',
      },
      borderColor: {
        accent:       'rgba(0,230,118,0.18)',
        'accent-hover': 'rgba(0,230,118,0.45)',
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 5px rgba(0,230,118,0.3)' },
          '50%':     { boxShadow: '0 0 20px rgba(0,230,118,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
