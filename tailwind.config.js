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
        'primary-indigo': '#6366F1',
        'primary-violet': '#7C3AED',
        'dark': '#191A23',
        'light-gray': '#F3F3F3',
      },
      fontFamily: {
        'positivus': ['Positivus', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(10px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.98)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 12s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
