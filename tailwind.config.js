/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3c5d9',
          300: '#8da4c0',
          400: '#6783a7',
          500: '#2E4057', // Deep navy blue for headers and primary buttons
          600: '#253649',
          700: '#1c2a3a',
          800: '#151e2c',
          900: '#0f161f',
        },
        background: {
          50: '#ffffff',
          100: '#E0E7EF', // Soft, calming off-white for backgrounds
          200: '#d1dae5',
          300: '#c2cdd8',
        },
        accent: {
          50: '#fff5f5',
          100: '#ffebeb',
          200: '#fdd8d8',
          300: '#fbc5c5',
          400: '#f99999',
          500: '#FF6B6B', // Vibrant coral accent for CTAs or interactive states
          600: '#ff5252',
          700: '#f44336',
          800: '#e53935',
          900: '#d32f2f',
        }
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}