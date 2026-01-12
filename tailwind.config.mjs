
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(210 100% 98%)',
          100: 'hsl(210 100% 95%)',
          200: 'hsl(210 100% 90%)',
          300: 'hsl(210 100% 80%)',
          400: 'hsl(210 100% 70%)',
          500: 'hsl(210 100% 60%)',
          600: 'hsl(210 100% 50%)',
          700: 'hsl(210 100% 40%)',
          800: 'hsl(210 100% 30%)',
          900: 'hsl(210 100% 20%)',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)',
            '[class~="lead"]': {
              color: 'rgb(107 114 128)',
            },
            a: {
              color: 'hsl(210 100% 50%)',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal',
            },
            'ol > li': {
              position: 'relative',
            },
            'ol > li::before': {
              content: 'counter(list-item, var(--list-counter-style, decimal)) "."',
              position: 'absolute',
              fontWeight: '400',
              color: 'rgb(107 114 128)',
              left: '-1.5em',
            },
            'ul > li': {
              position: 'relative',
            },
            'ul > li::before': {
              content: '""',
              position: 'absolute',
              backgroundColor: 'rgb(209 213 219)',
              borderRadius: '50%',
              width: '0.375em',
              height: '0.375em',
              top: 'calc(0.875em - 0.1875em)',
              left: '-1.5em',
            },
            hr: {
              borderColor: 'rgb(229 231 235)',
              borderTopWidth: 1,
              marginTop: '3em',
              marginBottom: '3em',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'rgb(17 24 39)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'rgb(229 231 235)',
              quotes: '"\u201C""\u201D""\u2018""\u2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
            },
            h1: {
              color: 'rgb(17 24 39)',
              fontWeight: '800',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8888889em',
              lineHeight: '1.1111111',
            },
            h2: {
              color: 'rgb(17 24 39)',
              fontWeight: '700',
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3333333',
            },
            h3: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.6',
            },
            h4: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5',
            },
            img: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            picture: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            'picture > img': {
              marginTop: '0',
              marginBottom: '0',
            },
            video: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            kbd: {
              fontWeight: '500',
              fontFamily: 'inherit',
              color: 'rgb(17 24 39)',
              boxShadow: '0 0 0 1px rgb(17 24 39 / 10%), 0 3px 0 rgb(17 24 39 / 10%)',
              fontSize: '0.875em',
              borderRadius: '0.3125rem',
              paddingTop: '0.1875em',
              paddingRight: '0.375em',
              paddingBottom: '0.1875em',
              paddingLeft: '0.375em',
            },
            code: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '"`"',
            },
            'code::after': {
              content: '"`"',
            },
            'a code': {
              color: 'rgb(17 24 39)',
            },
            'h1 code': {
              color: 'rgb(17 24 39)',
            },
            'h2 code': {
              color: 'rgb(17 24 39)',
            },
            'h3 code': {
              color: 'rgb(17 24 39)',
            },
            'h4 code': {
              color: 'rgb(17 24 39)',
            },
            'blockquote code': {
              color: 'rgb(17 24 39)',
            },
            'thead th code': {
              color: 'rgb(17 24 39)',
            },
            pre: {
              color: 'rgb(229 231 235)',
              backgroundColor: 'rgb(17 24 39)',
              overflowX: 'auto',
              fontWeight: '400',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.375rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: 'none',
            },
            'pre code::after': {
              content: 'none',
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(209 213 219)',
            },
            'thead th': {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(229 231 235)',
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td': {
              verticalAlign: 'baseline',
            },
            tfoot: {
              borderTopWidth: '1px',
              borderTopColor: 'rgb(209 213 219)',
            },
            'tfoot td': {
              verticalAlign: 'top',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'rgb(209 213 219)',
            '--tw-prose-headings': 'rgb(255 255 255)',
            '--tw-prose-lead': 'rgb(156 163 175)',
            '--tw-prose-links': 'hsl(210 100% 60%)',
            '--tw-prose-bold': 'rgb(255 255 255)',
            '--tw-prose-counters': 'rgb(156 163 175)',
            '--tw-prose-bullets': 'rgb(75 85 99)',
            '--tw-prose-hr': 'rgb(55 65 81)',
            '--tw-prose-quotes': 'rgb(243 244 246)',
            '--tw-prose-quote-borders': 'rgb(55 65 81)',
            '--tw-prose-captions': 'rgb(156 163 175)',
            '--tw-prose-kbd': 'rgb(255 255 255)',
            '--tw-prose-kbd-shadows': 'rgb(255 255 255 / 50%)',
            '--tw-prose-code': 'rgb(255 255 255)',
            '--tw-prose-pre-code': 'rgb(209 213 219)',
            '--tw-prose-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-th-borders': 'rgb(75 85 99)',
            '--tw-prose-td-borders': 'rgb(55 65 81)',
            color: 'var(--tw-prose-body)',
            '[class~="lead"]': {
              color: 'var(--tw-prose-lead)',
            },
            a: {
              color: 'var(--tw-prose-links)',
            },
            strong: {
              color: 'var(--tw-prose-bold)',
            },
            'ol > li::before': {
              color: 'var(--tw-prose-counters)',
            },
            'ul > li::before': {
              backgroundColor: 'var(--tw-prose-bullets)',
            },
            hr: {
              borderColor: 'var(--tw-prose-hr)',
            },
            blockquote: {
              color: 'var(--tw-prose-quotes)',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
            },
            h1: {
              color: 'var(--tw-prose-headings)',
            },
            h2: {
              color: 'var(--tw-prose-headings)',
            },
            h3: {
              color: 'var(--tw-prose-headings)',
            },
            h4: {
              color: 'var(--tw-prose-headings)',
            },
            'figure figcaption': {
              color: 'var(--tw-prose-captions)',
            },
            code: {
              color: 'var(--tw-prose-code)',
            },
            'a code': {
              color: 'var(--tw-prose-links)',
            },
            'h1 code': {
              color: 'var(--tw-prose-headings)',
            },
            'h2 code': {
              color: 'var(--tw-prose-headings)',
            },
            'h3 code': {
              color: 'var(--tw-prose-headings)',
            },
            'h4 code': {
              color: 'var(--tw-prose-headings)',
            },
            'blockquote code': {
              color: 'var(--tw-prose-quotes)',
            },
            'thead th code': {
              color: 'var(--tw-prose-headings)',
            },
            pre: {
              color: 'var(--tw-prose-pre-code)',
              backgroundColor: 'var(--tw-prose-pre-bg)',
            },
            'thead th': {
              color: 'var(--tw-prose-headings)',
              borderBottomColor: 'var(--tw-prose-th-borders)',
            },
            'tbody tr': {
              borderBottomColor: 'var(--tw-prose-td-borders)',
            },
            'tfoot td': {
              borderTopColor: 'var(--tw-prose-th-borders)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
