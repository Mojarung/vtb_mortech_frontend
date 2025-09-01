/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#B9FF66',
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
