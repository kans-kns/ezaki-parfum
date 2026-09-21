import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Identite EZAKI Parfum : noir profond + or
        ink: {
          DEFAULT: '#080808',
          soft: '#111111',
          charcoal: '#171717',
          line: '#242424',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E5C76B',
          deep: '#8C6F14',
          soft: 'rgba(201, 162, 39, 0.14)',
        },
        cream: '#F5F1E8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '430px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        gold: '0 18px 45px -22px rgba(201, 162, 39, 0.55)',
        'gold-lg': '0 28px 70px -28px rgba(201, 162, 39, 0.65)',
        card: '0 24px 60px -32px rgba(0, 0, 0, 0.95)',
      },
      backgroundImage: {
        'gold-line': 'linear-gradient(90deg, transparent, #C9A227, transparent)',
        'gold-radial':
          'radial-gradient(circle at center, rgba(201,162,39,0.35) 0%, rgba(201,162,39,0.08) 45%, transparent 72%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.06)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-160% 0' },
          '100%': { backgroundPosition: '260% 0' },
        },
        'marquee-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'glow-pulse': 'glow-pulse 7s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 3.4s linear infinite',
        'marquee-x': 'marquee-x 32s linear infinite',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;