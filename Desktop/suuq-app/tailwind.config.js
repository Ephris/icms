/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        somali: {
          50: '#E8F1FC',
          100: '#D1E3F9',
          200: '#A3C7F3',
          300: '#6BA3E8',
          400: '#4189DD',
          500: '#2B6BC0',
          600: '#1E4F8F',
          700: '#163A6B',
          800: '#0F2648',
          900: '#081324',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
