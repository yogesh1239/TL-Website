import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: '#c0392b',
        'accent-gold': '#c9a96e',
        'bg-reader': '#faf7f2',
        'bg-dark': '#0f0d0b',
        border: '#e0d8ce',
        muted: '#8a8078',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        lora: ['var(--font-lora)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        reader: '680px',
      },
    },
  },
  plugins: [],
}

export default config
