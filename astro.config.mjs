import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/utils/remark-reading-time.mts';
import htmlMinifier from './src/integrations/html-minifier.mjs';
import sitemapStyler from './src/integrations/sitemap-styler.mjs';
import { SITE_URL } from './src/consts.ts';
import partytown from '@astrojs/partytown';

// Dev-only middleware: respond to /sitemap*.xml with a valid stub so requests
// don't fall through to the [lang] dynamic router and produce 404 noise.
/** @type {import('vite').Plugin} */
const devSitemapStub = {
  name: 'dev-sitemap-stub',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (/\/sitemap.*\.xml($|\?)/.test(req.url ?? '')) {
        res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
        res.end(
          '<?xml version="1.0" encoding="UTF-8"?>' +
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            '<!-- Sitemap is generated at build time -->' +
            '</urlset>',
        );
        return;
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
  prefetch: {
    defaultStrategy: 'viewport',
  },
  integrations: [
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark',
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
      filter: (page) => !page.includes('/api/'),
      serialize(item) {
        // Remove trailing slash for comparison if it exists
        const url = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        const baseUrl = SITE_URL;

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
      filenameBase: 'sitemap',
      entryLimit: 10000,
    }),
    sitemapStyler(),
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
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    plugins: [tailwindcss(), devSitemapStub],
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
