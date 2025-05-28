# AstroBlazeCMS

A modern blog CMS built with Astro.js featuring:

- Multi-language support (English, Spanish, Japanese)
- Decap CMS integration for content management
- Tailwind CSS for styling
- Sitemap generation
- Markdown/MDX support

## Tech Stack

- Astro 5.8.0
- @astrojs/mdx 4.3.0
- @astrojs/tailwind 5.1.5
- @astrojs/sitemap 3.4.0
- Tailwind CSS 3.4.17

## Features

- Git-based content management via Decap CMS
- Responsive design
- SEO optimized
- Reading time calculation
- Dark/light theme support

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Access admin at `/admin`

## Configuration

- Site URL: Configured in `astro.config.mjs`
- Content collections: Defined in `src/content/config.ts`
- CMS settings: Configured in `public/admin/config.yml`

## Deployment

Configured for Netlify with:

- Git Gateway backend
- Branch: main
- Media folder: public/images
