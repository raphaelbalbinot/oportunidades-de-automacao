/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "../../src/client/**/*.{js,ts,jsx,tsx,html}",
  ],
  corePlugins: {
    preflight: false,
  },
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
        govbr: {
          blue: '#1351b4',
          'blue-warm': '#0c326f',
          'blue-light': '#2670e8',
          gray: '#333333',
          'gray-light': '#f8f8f8',
          green: '#168821',
          yellow: '#ffcd07',
          red: '#e52207',
        },
      },
    },
  },
  plugins: [],
}
