/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0f0a',
          50: '#111511',
          100: '#1a231a',
          200: '#222f22',
        },
        green: {
          DEFAULT: '#00c853',
          50: 'rgba(0, 200, 83, 0.05)',
          100: 'rgba(0, 200, 83, 0.1)',
          200: 'rgba(0, 200, 83, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', '"Barlow Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}