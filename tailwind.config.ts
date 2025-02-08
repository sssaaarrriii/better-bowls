import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'green': {
          900: '#5E7153', // Reseda green
        },
        'sage': '#A8B589',
        // Secondary colors
        'beige': '#FCFCE4',
        'dutch-white': '#F9ECC9',
      },
      fontFamily: {
        header: ['var(--font-header)', 'serif'],
        body: ['var(--font-body)', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config 