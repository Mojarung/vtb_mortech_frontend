/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-purple': '#8B5CF6',
        'dark': '#191A23',
        'light-gray': '#F3F3F3',
      },
      fontFamily: {
        'positivus': ['Positivus', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
