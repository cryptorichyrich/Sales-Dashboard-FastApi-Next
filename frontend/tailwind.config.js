/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'brand-primary': '#3498db',
          'brand-secondary': '#2ecc71',
        },
        maxWidth: {
            '1280': '1280px',
          },
      },
    },
    plugins: [],
  }