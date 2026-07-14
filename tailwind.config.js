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
        ink: {
          light: '#374151',
          DEFAULT: '#1f2328',
          dark: '#111827',
        },
        gold: {
          light: '#d4af37',
          DEFAULT: '#c58f32',
          dark: '#996515',
        },
        paper: {
          DEFAULT: '#fffdf8',
          dark: '#1e1e24',
        },
        brand: {
          blue: '#0b6aa2',
          navy: '#10263f',
          gold: '#c58f32',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
