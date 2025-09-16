import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        game: {
          bg: '#0f172a',
          card: '#1e293b',
          accent: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          success: '#10b981',
        }
      },
      fontFamily: {
        comic: ['Comic Neue', 'cursive'],
        game: ['Press Start 2P', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-fast': 'pulse 1s infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'fire': 'fire 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        fire: {
          '0%': { transform: 'scale(1) rotate(-1deg)' },
          '100%': { transform: 'scale(1.1) rotate(1deg)' },
        }
      }
    },
  },
  plugins: [],
}
export default config