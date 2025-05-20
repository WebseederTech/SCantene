/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        customBlue: "#7393B3", // Add your custom color here
        darkBackground: '#0f0f10',
        lightBackground: '#ffffff',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      boxShadow: {
        'navigation': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'navigation-dark': '0 4px 6px rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        exo: ['Exo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
