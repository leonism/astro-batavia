import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
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
    plugins: [tailwindcss()], // Added tailwindcss vite plugin
    optimizeDeps: {
      include: ["@astrojs/markdown-remark"],
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
});
