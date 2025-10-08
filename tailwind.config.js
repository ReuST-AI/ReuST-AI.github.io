/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0b2b45',
          DEFAULT: '#184163',
          light: '#e6f1f8'
        }
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.12)'
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.35 },
          '50%': { opacity: 0.65 }
        }
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 16s ease-in-out infinite'
      }
    }
  },
  plugins: [],
};
