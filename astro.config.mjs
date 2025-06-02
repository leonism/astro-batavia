import { defineConfig } from 'astro/config';
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://your-blog.com',
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
    },
    remarkPlugins: [remarkReadingTime],
  }), tailwind({
    applyBaseStyles: false,
  }), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en-US',
        es: 'es-ES',
        ja: 'ja-JP',
      },
    },
  }), sentry(), spotlightjs()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      include: ['@astrojs/markdown-remark'],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
});