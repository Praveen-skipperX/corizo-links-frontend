/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8860B7',
          dark: '#6E24A5',
          light: '#F2F2FE',
        },
        accent: '#1E153D',
        brand: {
          purple: '#8860B7',
          'dark-purple': '#6E24A5',
          'light-bg': '#F5F4FA',
          'dark-text': '#1E153D',
          sidebar: '#16102E',
          'sidebar-hover': '#221A42',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
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
