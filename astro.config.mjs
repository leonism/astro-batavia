import { defineConfig } from 'astro/config';
import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/utils/remark-reading-time.mts';
import htmlMinifier from './src/integrations/html-minifier.mjs';
import sitemapStyler from './src/integrations/sitemap-styler.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: '{https://astro-batavia.pages.dev}',
  trailingSlash: 'ignore',
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
          en: 'en-US',
          es: 'es-ES',
          ja: 'ja-JP',
        },
      },
      filter: (page) => !page.includes('/api/'),
      serialize(item) {
        // Remove trailing slash for comparison if it exists
        const url = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        const baseUrl = 'https://astro-batavia.pages.dev';

        if (url === baseUrl || url === `${baseUrl}/es` || url === `${baseUrl}/ja`) {
          // @ts-ignore
          item.changefreq = 'daily';
          item.priority = 1.0;
        } else if (url.includes('/blog/')) {
          // @ts-ignore
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } else if (url.includes('/tags/')) {
          // @ts-ignore
          item.changefreq = 'weekly';
          item.priority = 0.6;
        } else {
          // @ts-ignore
          item.changefreq = 'monthly';
          item.priority = 0.5;
        }

        item.lastmod = new Date().toISOString().split('T')[0];
        return item;
      },
      entryLimit: 10000,
    }),
    sitemapStyler(),
    sentry({
      telemetry: false,
    }),
    spotlightjs(),
    htmlMinifier({
      removeComments: true,
    }),
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
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    optimizeDeps: {
      include: ['@astrojs/markdown-remark'],
    },
    build: {
      minify: true,
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress "unused external import" warnings from Astro internals
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            warning.message.includes('@astrojs/internal-helpers/remote')
          ) {
            return;
          }
          warn(warning);
        },
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
});
