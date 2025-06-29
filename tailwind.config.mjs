/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: ["@tailwindcss/typography", "@tailwindcss/forms"],
=======
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
        gray: {
          50: 'hsl(210 20% 98%)',
          100: 'hsl(210 20% 95%)',
          200: 'hsl(210 16% 93%)',
          300: 'hsl(210 14% 89%)',
          400: 'hsl(210 14% 83%)',
          500: 'hsl(210 11% 71%)',
          600: 'hsl(210 7% 56%)',
          700: 'hsl(210 9% 31%)',
          800: 'hsl(210 10% 23%)',
          900: 'hsl(210 11% 15%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(210 11% 15%)',
            a: {
              color: 'hsl(210 100% 50%)',
              textDecoration: 'none',
              '&:hover': {
                color: 'hsl(210 100% 40%)',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'hsl(210 11% 15%)',
            },
            code: {
              color: 'hsl(210 100% 50%)',
              backgroundColor: 'hsl(210 20% 95%)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: 'hsl(210 20% 95%)',
            a: {
              color: 'hsl(210 100% 60%)',
              '&:hover': {
                color: 'hsl(210 100% 70%)',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'hsl(210 20% 95%)',
            },
            code: {
              color: 'hsl(210 100% 60%)',
              backgroundColor: 'hsl(210 10% 23%)',
            },
            blockquote: {
              borderLeftColor: 'hsl(210 100% 60%)',
              color: 'hsl(210 20% 95%)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
>>>>>>> 771a0a126f0221d7e2dd9bd0103257e8679d9d92
};
