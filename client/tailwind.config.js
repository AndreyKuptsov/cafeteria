/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF8DC',
          100: '#FFEFD5',
          200: '#FFE4B5',
          300: '#FFD700',
          400: '#DAA520',
          500: '#B8860B',
          600: '#8B4513',
          700: '#654321',
          800: '#3E2723',
          900: '#1B0000',
        },
        accent: {
          lavender: '#E6E6FA',
          strawberry: '#FF6B9D',
          chocolate: '#3E2723',
          cream: '#FFFACD',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
