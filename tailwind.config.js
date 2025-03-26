/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['content/**/*.md', 'layouts/**/*.html', 'layouts/**/*.svg'],
  theme: {
    extend: {
      colors: {
        highlight: '#F5D547',
        calloutcolor: 'dodgerblue',
        hovercolor: '#02394A',
        darkMaincolor: '#5C8001',
        accentText: '#ACC196',
        text: '#C8C2B7',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
