/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B8D0FA',
        'primary-dark': '#94B9F3',
        accent: '#776A77',
        'yellow-light': '#DDDEA5',
        'yellow-pale': '#EDE9BF',
        'cream': '#F8EDD6',
        'app-white': '#FFFFFF',
        'app-black': '#1c1c1c',
        'app-gray': '#737373',
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

