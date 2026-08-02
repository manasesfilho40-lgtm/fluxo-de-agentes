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
          DEFAULT: '#0a0a0a',
          50: '#111111',
          100: '#1a1a1a',
          200: '#222222',
          300: '#2a2a2a',
        },
        neon: {
          DEFAULT: '#00ff87',
          50: 'rgba(0, 255, 135, 0.05)',
          100: 'rgba(0, 255, 135, 0.1)',
          200: 'rgba(0, 255, 135, 0.2)',
          300: 'rgba(0, 255, 135, 0.3)',
          400: 'rgba(0, 255, 135, 0.4)',
          500: '#00ff87',
          600: '#00e679',
        },
        orange: {
          DEFAULT: '#ff6b35',
        },
        gray: {
          50: '#f5f5f5',
          100: '#b0b0b0',
          200: '#a0a0a0',
          300: '#808080',
          400: '#606060',
          500: '#404040',
          light: '#e0e0e0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', '"Barlow Condensed"', 'sans-serif'],
      },
      fontSize: {
        'hero': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-md': ['2.75rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'section': ['1.5rem', { lineHeight: '1.15' }],
        'section-md': ['2rem', { lineHeight: '1.15' }],
        'subtitle': ['1.125rem', { lineHeight: '1.3' }],
        'subtitle-md': ['1.375rem', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6' }],
        'small': ['0.9375rem', { lineHeight: '1.5' }],
        'xs': ['0.8125rem', { lineHeight: '1.4' }],
        '2xs': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        'section': '3rem',
        'section-lg': '4rem',
        'section-xl': '5rem',
        'card': '1.25rem',
        'card-lg': '1.75rem',
      },
      borderRadius: {
        'card': '0.75rem',
        'card-lg': '1rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'fade-in-up-delay-1': 'fadeInUp 0.6s ease 0.1s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.6s ease 0.2s forwards',
        'fade-in-up-delay-3': 'fadeInUp 0.6s ease 0.3s forwards',
        'fade-in-left': 'fadeInLeft 0.6s ease forwards',
        'fade-in-right': 'fadeInRight 0.6s ease forwards',
        'scale-in': 'scaleIn 0.5s ease forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'marquee-left': 'marqueeLeft 25s linear infinite',
        'marquee-right': 'marqueeRight 25s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 135, 0.25)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 135, 0.5), 0 0 60px rgba(0, 255, 135, 0.2)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 135, 0.3), 0 0 40px rgba(0, 255, 135, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 135, 0.5), 0 0 60px rgba(0, 255, 135, 0.25), 0 0 80px rgba(0, 255, 135, 0.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        marqueeLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
        'card-glow': '0 4px 30px rgba(0, 255, 135, 0.12)',
        'neon': '0 0 25px rgba(0, 255, 135, 0.3)',
        'neon-strong': '0 0 20px rgba(0, 255, 135, 0.5), 0 0 40px rgba(0, 255, 135, 0.25), 0 0 60px rgba(0, 255, 135, 0.12)',
      },
    },
  },
  plugins: [],
}
