/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0f2c53', // Current dark blue
          600: '#0c2342',
          700: '#091a31',
          800: '#061221',
          900: '#030910',
        },
        accent: {
          light: '#f44336', // Current red
          dark: '#ff5747',
        },
      },
      fontFamily: {
        sans: ['Roboto Condensed', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
