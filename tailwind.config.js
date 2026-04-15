/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
        glow: '0 0 40px rgba(34, 211, 238, 0.25)',
      },
      colors: {
        triage: {
          immediate: '#ef4444',
          urgent: '#f97316',
          semiUrgent: '#facc15',
          nonUrgent: '#22c55e',
        },
      },
    },
  },
  plugins: [],
}
