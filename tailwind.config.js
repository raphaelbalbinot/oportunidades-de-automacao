/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/client/**/*.{js,ts,jsx,tsx,html}",
    "./src/client/index.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffe',
          300: '#7cc2fd',
          400: '#36a2fa',
          500: '#0c85eb',
          600: '#0067c8',
          700: '#0052a2',
          800: '#054685',
          900: '#0a3a6e',
          950: '#072549',
        },
      },
    },
  },
  plugins: [],
}
