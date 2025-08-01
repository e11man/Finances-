/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue for highlights
          light: '#3b82f6',
          dark: '#1e40af'
        },
        background: '#f5f7fa',
        surface: '#ffffff'
      }
    }
  },
  plugins: []
};