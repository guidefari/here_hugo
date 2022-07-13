/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['content/**/*.md', 'layouts/**/*.html'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#232333',
            a: {
              color: 'var(--maincolor)',
              '&:hover': {
                color: '#E4CC7D',
              },
              borderBottom: 'none',
              fontWeight: 700
            },
            li: {
              listStyleType: 'square',
            },
            h1: {
              color: '#232333',
            },
            h2: {
              color: '#232333',
            },
            h3: {
              color: '#232333',
            },
            h4: {
              color: '#232333',
            },
            h5: {
              color: '#a0aec0',
            },
            h6: {
              color: '#a0aec0',
            },
            blockquote: {
              color: '#232333',
            },
            strong: {
              color: '#232333',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
