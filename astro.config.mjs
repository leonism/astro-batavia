import { defineConfig } from "astro/config";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";
// import viteImagemin from 'vite-plugin-imagemin';
// import gzipPlugin from 'rollup-plugin-gzip';
// import brotliPlugin from 'rollup-plugin-brotli';
// import htmlMinifier from './src/integrations/html-minifier.mjs';

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://your-blog.com",
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-dark",
      },
      remarkPlugins: [remarkReadingTime],
    }),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          es: "es-ES",
          ja: "ja-JP",
        },
      },
    }),
    sentry(),
    spotlightjs(),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "ja"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@astrojs/markdown-remark"],
    },
    build: {
      minify: true,
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },
    },
    // Additional plugins can be added here:
    // plugins: [
    //   viteImagemin({
    //     gifsicle: { optimizationLevel: 7 },
    //     mozjpeg: { quality: 80 },
    //     pngquant: { quality: [0.65, 0.8] },
    //     svgo: {
    //       plugins: [
    //         { name: 'removeViewBox', active: false },
    //         { name: 'removeEmptyAttrs', active: false },
    //       ],
    //     },
    //     webp: { quality: 80 },
    //     avif: { quality: 60 },
    //   }),
    //   gzipPlugin(),
    //   brotliPlugin(),
    // ],
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
});
