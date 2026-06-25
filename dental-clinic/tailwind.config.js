/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D0D12',
        accent: '#C9A84C',
        background: '#FAF8F5',
        dark: '#2A2A35',
        ivory: '#FAF8F5',
        champagne: '#C9A84C',
        obsidian: '#0D0D12',
        slate: '#2A2A35',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        drama: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        wave: {
          '0%, 100%': { strokeDashoffset: '0' },
          '50%': { strokeDashoffset: '50' },
        },
      },
    },
  },
  plugins: [],
}
