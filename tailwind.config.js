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
        brand: {
          50: '#faf8f5',
          100: '#f4efe6',
          200: '#e7dccb',
          300: '#d7c4a8',
          400: '#c3a681',
          500: '#b28e62', // Champagne Gold / Bronze
          600: '#9b764f',
          700: '#7c5a3d',
          800: '#674934',
          900: '#553c2c',
        },
        obsidian: {
          950: '#070a0e',
          900: '#0d1117',
          850: '#131822',
          800: '#1b2230',
          700: '#273248',
          600: '#3c4b69',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
