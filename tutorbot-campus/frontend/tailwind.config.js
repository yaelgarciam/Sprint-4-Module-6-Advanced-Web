/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#3B6D11',
          'green-light': '#EAF3DE',
          'green-mid': '#639922',
          'green-dark': '#27500A',
          amber: '#BA7517',
          'amber-light': '#FAEEDA',
          blue: '#185FA5',
          'blue-light': '#E6F1FB',
          coral: '#993C1D',
          'coral-light': '#FAECE7',
          gray: '#5F5E5A',
          'gray-light': '#F1EFE8',
        },
        surface: {
          DEFAULT: '#FAFAF8',
          secondary: '#F1EFE8',
        },
        txt: {
          DEFAULT: '#1a1a18',
          muted: '#5F5E5A',
          subtle: '#888780',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
