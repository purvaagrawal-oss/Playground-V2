/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: '#08090D',
        sidebar: '#0B0D12',
        panel: '#11141A',
        panel2: '#171A21',
        hover: '#1B1E26',
        border: '#272B35',
        borderStrong: '#343844',
        textPrimary: '#F7F7F8',
        textSecondary: '#9B9DA6',
        textMuted: '#6F727C',
        accent: '#E5005A',
        accentHover: '#F0196D',
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #E5005A 0%, #B4008F 100%)',
        'accent-gradient-hover': 'linear-gradient(135deg, #F0196D 0%, #C40A9E 100%)',
      },
      borderRadius: {
        lg: '10px',
        xl: '14px',
        '2xl': '16px',
      },
      boxShadow: {
        panel: '0 8px 24px rgba(0, 0, 0, 0.35)',
        pop: '0 12px 32px rgba(0, 0, 0, 0.5)',
      },
      transitionDuration: {
        120: '120ms',
        160: '160ms',
        200: '200ms',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-12px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.96)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
        'slide-in-right': 'slide-in-right 200ms ease-out',
        'slide-in-left': 'slide-in-left 200ms ease-out',
        'scale-in': 'scale-in 160ms ease-out',
      },
    },
  },
  plugins: [],
}
