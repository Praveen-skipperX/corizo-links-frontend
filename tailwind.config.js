/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          dark: '#1557b0',
          light: '#e8f0fe',
        },
        accent: '#202124',
        brand: {
          purple: '#1a73e8',
          'dark-purple': '#1557b0',
          'light-bg': '#f8fafc',
          'dark-text': '#202124',
          sidebar: '#f8fafc',
          'sidebar-hover': '#221A42',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Arial', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(30,21,61,0.04), 0 4px 16px 0 rgba(30,21,61,0.04)',
        'card-hover': '0 8px 30px 0 rgba(110,36,165,0.12)',
        soft: '0 1px 3px 0 rgba(30,21,61,0.06)',
        sidebar: '4px 0 24px 0 rgba(22,16,46,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
