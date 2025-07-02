/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: "hsl(210 100% 98%)",
          100: "hsl(210 100% 95%)",
          200: "hsl(210 100% 90%)",
          300: "hsl(210 100% 80%)",
          400: "hsl(210 100% 70%)",
          500: "hsl(210 100% 60%)",
          600: "hsl(210 100% 50%)",
          700: "hsl(210 100% 40%)",
          800: "hsl(210 100% 30%)",
          900: "hsl(210 100% 20%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
