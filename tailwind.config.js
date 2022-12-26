/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['content/**/*.md', 'layouts/**/*.html'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#C8C2B7',
            a: {
              color: 'var(--maincolor)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'inherit',
              },
              borderBottom: 'none',
              fontWeight: 700
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
            },
            strong: {
              color: '#C8C2B7',
              fontWeight: 700,
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
