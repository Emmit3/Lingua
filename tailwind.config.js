/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2196F3',
          green: '#22C55E',
          sky: '#1565C0',
          dark: '#0D3B8C',
        },
        streak: '#FF6B35',
      },
    },
  },
  plugins: [],
};
