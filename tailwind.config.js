/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ['./index.html', './source/**/*.{js,ts,jsx,tsx}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
