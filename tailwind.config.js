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
      typography: {
        DEFAULT: {
          css: {
            color: '#C8C2B7',
            a: {
              color: 'white',
              '&:hover': {
                color: 'black',
                backgroundColor: 'var(--maincolor)',
              },
              borderBottom: '3px solid var(--maincolor)',
              fontWeight: 700,
              textDecoration: 'none',
              code: {
                color: 'var(--hovercolor)',
              },
            },
            '--tw-prose-headings': '#C8C2B7',
            blockquote: {
              color: '#CCC7B8',
              strong: {
                color: 'white',
              }
            },
            strong: {
              color: 'white',
              fontWeight: 700,
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
