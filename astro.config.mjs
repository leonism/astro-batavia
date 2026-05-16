import { defineConfig, fontProviders } from 'astro/config';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/utils/remark-reading-time.mts';
import htmlMinifier from './src/integrations/html-minifier.mjs';
import { SITE_URL } from './src/consts.ts';
import partytown from '@astrojs/partytown';

/** @type {import('vite').Plugin} */
const devPartytownFix = {
  name: 'dev-partytown-fix',
  apply: 'serve',
  enforce: 'pre',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url;
      if (url?.includes('~partytown') && !url.includes('.')) {
        req.url = url + '.js';
      }
      next();
    });
  },
};

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: SITE_URL,
  trailingSlash: 'ignore',
  redirects: {
    '/search/': '/en/search/',
    '/blog/': '/en/blog/',
    '/services/': '/en/services/',
    '/about/': '/en/about/',
    '/contact/': '/en/contact/',
    '/terms/': '/en/terms/',
    '/privacy/': '/en/privacy/',
    '/cookies/': '/en/cookies/  ',
    '/en': '/',
    '/sitemap.xml': '/sitemap-index.xml',
  },
  prefetch: {
    defaultStrategy: 'viewport',
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-plus-jakarta',
      display: 'swap',
      weights: [200, 300, 400, 500, 600, 700, 800],
      subsets: ['latin'],
      styles: ['normal', 'italic'],
    },
  ],
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        themes: {
          light: 'github-dark',
          dark: 'github-dark',
        },
        wrap: true,
      },
      remarkPlugins: [remarkReadingTime],
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
    }),
    htmlMinifier({
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
        debug: false,
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ja'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-dark',
        dark: 'github-dark',
      },
      wrap: true,
    },
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    plugins: [tailwindcss(), devPartytownFix],
    optimizeDeps: {
      include: ['@astrojs/markdown-remark'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      minify: true,
      cssCodeSplit: false,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'SOURCEMAP_ERROR') return;
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
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'style.min.css';
            return 'assets/[name].[hash][extname]';
          },
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
});
