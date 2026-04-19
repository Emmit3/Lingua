/** @type {import('tailwindcss').Config} */
module.exports = {
  /** Required for NativeWind on web — `media` breaks when css-interop syncs color scheme (MutationObserver → throw). */
  darkMode: 'class',
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
        /** Playful Momentum (ui_improvements) — mirrors `constants/designTokens.ts` */
        pm: {
          bg: '#FAFAF8',
          text: '#1A1A1A',
          muted: '#6B7280',
          divider: '#E5E7EB',
          teal: '#00D9FF',
          coral: '#FF6B54',
          lime: '#A3FF5C',
          purple: '#7C3AED',
        },
      },
    },
  },
  plugins: [],
};
