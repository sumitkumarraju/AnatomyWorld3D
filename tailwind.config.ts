import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-evergreen': '#1B512D',
        'forest-jade': '#1C7C54',
        'mint-bloom': '#73E2A7',
        'soft-pistachio': '#DEF4C6',
        'cream-white': '#F0F7E8',
        'obsidian': '#0d1f14',
        'dark-forest': '#122a1a',
        'pulse-red': '#ef4444',
        'glass-border': 'rgba(28, 124, 84, 0.15)',
        'glass-bg': 'rgba(18, 42, 26, 0.6)',
        'glass-bg-hover': 'rgba(18, 42, 26, 0.8)',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(18, 42, 26, 0.7), rgba(18, 42, 26, 0.3))',
        'jade-glow': 'radial-gradient(circle at center, rgba(28, 124, 84, 0.15), transparent 70%)',
        'hero-gradient': 'radial-gradient(ellipse at 50% 50%, rgba(115, 226, 167, 0.08) 0%, transparent 60%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'jade-glow': '0 0 20px rgba(115, 226, 167, 0.3), 0 0 60px rgba(115, 226, 167, 0.1)',
        'pulse-glow': '0 0 20px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(115, 226, 167, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(115, 226, 167, 0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
};

export default config;
