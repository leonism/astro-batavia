import { defineConfig, fontProviders } from 'astro/config';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/utils/remark-reading-time.mts';
import htmlMinifier from './src/integrations/html-minifier.mjs';
import sitemapHandler from './src/integrations/sitemap-handler.mjs';
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

// Dev-only middleware: respond to /sitemap*.xml with a valid stub so requests
// don't fall through to the [lang] dynamic router and produce 404 noise.
/** @type {import('vite').Plugin} */
const devSitemapStub = {
  name: 'dev-sitemap-stub',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url ?? '';
      if (/\/sitemap.*\.xml($|\?)/.test(url)) {
        try {
          const sitemapPath = fileURLToPath(new URL('./dist/sitemap.xml', import.meta.url));
          let content = await fs.readFile(sitemapPath, 'utf-8');

          // Dynamically replace production URL with local URL for development
          const host = req.headers.host || 'localhost:5000';
          const protocol = req.headers['x-forwarded-proto'] || 'http';
          const localOrigin = `${protocol}://${host}`;
          
          content = content.replaceAll(SITE_URL, localOrigin);

          res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
          res.end(content);
          return;
        } catch (e) {
          // Fallback if no build exists
          const host = req.headers.host || 'localhost:5000';
          res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
          res.end(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
              '  <!-- Real sitemap is generated during build time -->\n' +
              '  <url>\n' +
              '    <loc>http://' + host + '/</loc>\n' +
              '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n' +
              '    <changefreq>daily</changefreq>\n' +
              '    <priority>1.0</priority>\n' +
              '  </url>\n' +
              '</urlset>',
          );
          return;
        }
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
      /** @param {any} item */
      serialize(item) {
        // Remove trailing slash for comparison if it exists
        const url = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        const baseUrl = SITE_URL;

        if (url === baseUrl || url === `${baseUrl}/es` || url === `${baseUrl}/ja`) {
          item.changefreq = 'daily';
          item.priority = 1.0;
        } else if (url.includes('/blog/')) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } else if (url.includes('/tags/')) {
          item.changefreq = 'weekly';
          item.priority = 0.6;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.5;
        }

        item.lastmod = new Date().toISOString().split('T')[0];
        return item;
      },
      entryLimit: 10000,
    }),
    sitemapHandler(),
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
      strategy: 'manual',
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
