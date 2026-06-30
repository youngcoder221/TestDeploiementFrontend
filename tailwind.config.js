/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50:  '#eff6ff',
          100: '#dbeafe',
          300: '#93c5fd',
          400: '#3b82f6',
          500: '#2563eb',
          600: '#1d56b8',
          700: '#1a4694',
          800: '#153872',
          900: '#0f2b5b',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}