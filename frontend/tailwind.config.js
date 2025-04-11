/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' for OS level preference
  theme: {
    extend: {
      colors: {
        // You can customize your color palette here
        blue: {
          50: '#e6f0ff',
          100: '#bdd6fe',
          200: '#90b8fc',
          300: '#649afa',
          400: '#3c7cf7',
          500: '#2563eb', // Primary blue
          600: '#1e51c9',
          700: '#1a3fa7',
          800: '#152e85',
          900: '#121f64',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      boxShadow: {
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  plugins: [],
}