const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.resolve(__dirname, './src/**/*.{js,jsx,ts,tsx}'),
    path.resolve(__dirname, './public/index.html'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}