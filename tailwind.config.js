/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['content/**/*.md', 'layouts/**/*.html', 'layouts/**/*.svg'],
  theme: {
    extend: {
      
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
            },
            li: {
              listStyleType: 'square',
              color: '#C8C2B7',
            },
            ol: {
              listStyleType: 'decimal',
              color: '#C8C2B7',
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
