/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'reseda-green': '#5E7153',
        'sage': '#A8B589',
        'beige': '#FCFCE4',
        'dutch-white': '#F9ECC9',
        'orange': {
          500: '#FF9B71',
        }
      },
      fontFamily: {
        header: ['var(--font-header)', 'serif'],
        body: ['var(--font-body)', 'serif']
      },
    },
  },
  plugins: [],
}
