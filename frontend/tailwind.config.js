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
          750: '#2c3440', // Added for darker background elements
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
        'all': 'all',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.blue.500'),
              '&:hover': {
                color: theme('colors.blue.600'),
              },
            },
            h1: {
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '0.75em',
              marginTop: '0.5em',
            },
            h2: {
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5em',
              marginTop: '0.5em',
            },
            h3: {
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '0.5em',
              marginTop: '0.5em',
            },
            h4: {
              fontWeight: '600',
            },
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.red.500'),
              fontWeight: '400',
              padding: '0.25em',
              borderRadius: '0.25em',
            },
            pre: {
              backgroundColor: theme('colors.gray.100'),
              padding: '1em',
              borderRadius: '0.5em',
              overflow: 'auto',
            },
            ul: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              paddingLeft: '1.25em',
            },
            ol: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              paddingLeft: '1.25em',
            },
            li: {
              marginBottom: '0.25em',
            },
            blockquote: {
              color: theme('colors.gray.600'),
              borderLeftColor: theme('colors.gray.300'),
              fontStyle: 'italic',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.gray.700'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.green.400'),
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}