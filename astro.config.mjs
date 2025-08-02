import { defineConfig } from 'astro/config';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import htmlMinifier from './src/integrations/html-minifier.mjs';
import viteImagemin from 'vite-plugin-imagemin';
import gzipPlugin from 'rollup-plugin-gzip';
import brotliPlugin from 'rollup-plugin-brotli';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://astro-batavia.pages.dev',
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark',
      },
      remarkPlugins: [remarkReadingTime],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          es: 'es-ES',
          ja: 'ja-JP',
        },
      },
      customPages: ['/rss.xml'],
    }),
    sentry(),
    spotlightjs(),
    image(),
  ],
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
    build: {
      minify: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
    plugins: [
      gzipPlugin(),
      brotliPlugin(),
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
});
