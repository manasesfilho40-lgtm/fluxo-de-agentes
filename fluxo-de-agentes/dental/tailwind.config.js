/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A14',
        accent: '#7B61FF',
        background: '#F0EFF4',
        dark: '#18181B',
      },
      fontFamily: {
        heading: ['"Sora"', 'sans-serif'],
        drama: ['"Instrument Serif"', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
        sans: ['"Sora"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '2rem',
        '3xl': '3rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
