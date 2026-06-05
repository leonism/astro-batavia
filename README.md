<div align="center">
  <h1>🚀 Astro Batavia</h1>
  <p><strong>A modern, multilingual blog platform built with Astro.js</strong></p>

[![Astro](https://img.shields.io/badge/Astro-6.4.4-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

  <!-- Additional new badges below -->

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare_Pages-F38020?style=flat&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Vercel](https://img.shields.io/badge/Preview-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/7e052926-bd01-4269-be91-b2a98ccdce35/deploy-status)](https://app.netlify.com/projects/astro-batavia/deploys)
[![Multilingual](https://img.shields.io/badge/Multilingual-Yes-0A7E07?style=flat)](#)
[![Dark Mode](https://img.shields.io/badge/Dark_Mode-Enabled-000000?style=flat)](#)

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
- [🌐 Internationalization](#-internationalization)
- [📝 Content Management](#-content-management)
- [🎨 Customization](#-customization)
- [📦 Build & Deployment](#-build--deployment)
- [🔧 Configuration](#-configuration)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🌍 **Multilingual Support**

- **3 Languages**: English, Spanish, and Japanese
- **Native i18n APIs**: Leverages `Astro.currentLocale` and stable routing
- **Smart Routing**: Language-prefixed URLs with fallback handling
- **Localized Content**: Date formatting, UI translations, and content management
- **SEO Optimized**: Language-specific meta tags and hreflang attributes

### 📱 **Modern Design**

- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Dark Mode**: System preference detection with manual toggle
- **Performance**: Static site generation with optimized assets
- **Accessibility**: WCAG compliant with semantic HTML

### 📝 **Content Management**

- **Decap CMS**: Git-based headless CMS for easy content editing
- **MDX Support**: Rich markdown with inherited global configurations
- **Advanced Processing**: Powered by the new unified markdown processor API
- **Reading Time**: Automatic calculation for better UX
- **Tag System**: Categorization and filtering capabilities
- **Draft Support**: Preview unpublished content

### 🔍 **Advanced Search**

- **Realtime Search**: Search results appear as you type keywords
- **Search Overlay UI**: Search UI under an overlay UI composition
- **Under 100 millisecond**: Fast, blazingly fast results experience
- **Accesibility**: Navigate search results using key strokes on desktop

### 📊 **SEO & Analytics**

- **Advanced SEO**: Open Graph, Twitter Cards, JSON-LD structured data
- **Sitemap**: Automatic generation with i18n support
- **Analytics Ready**: Google Tag Manager (via Partytown) and Sentry integration
- **Performance**: Lighthouse-optimized with Gzip/Brotli/Zstd compression

### 🎯 **Developer Experience**

- **TypeScript**: Full type safety across the codebase
- **Component Architecture**: Modular and reusable components
- **Client-Side Prerendering**: Instant navigation via experimental Speculation Rules API
- **Stable Prefetching**: Configurable viewport-based background loading
- **Advanced Build Optimization**:
  - **Enterprise-Grade HTML Minification**: Custom integration with `html-minifier-terser` using multi-core processing.
  - **Asset Compression**: Automatic Gzip, Brotli, and Zstandard compression for production builds.
  - **Granular Control**: Configurable build tools for fine-tuning optimization settings.
  - **Detailed Build Reports**: Comprehensive reports on file sizes and compression savings.

## 🛠️ Tech Stack

### **Core Framework**

- **[Astro 6.4.4](https://astro.build)** - Static site generator with islands architecture
- **[TypeScript 5.7+](https://www.typescriptlang.org/)** - Type-safe JavaScript development
- **[MDX 6.0.2](https://mdxjs.com/)** - Markdown with JSX components

### **Styling & UI**

- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework with **CSS-only configuration**
- **[@tailwindcss/vite](https://tailwindcss.com)** - Native Vite integration for Tailwind CSS
- **[@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)** - Beautiful typographic defaults
- **Custom Design System** - Centralized in `src/styles/global.css` using the `@theme` block

### **Content & CMS**

- **[Decap CMS](https://decapcms.org/)** - Git-based content management
- **[Zod](https://zod.dev/)** - Schema validation for content types
- **[@astrojs/markdown-remark](https://docs.astro.build)** - Pluggable unified processor API

### **SEO & Analytics**

- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** - Automatic sitemap generation
- **[@astrojs/partytown](https://docs.astro.build/en/guides/integrations-guide/partytown/)** - Off-main-thread third-party scripts
- **[Sentry](https://sentry.io/)** - Error tracking and performance monitoring

### **Build & Optimization**

- **Vite 6** - Fast build tool and dev server
- **HTML, CSS, & JS Minification** - Automatic minification for optimized delivery
- **Image Optimization** - Automatic image compression and format conversion
- **Compression** - Gzip, Brotli, and Zstd compression for production builds

## 🏗️ Architecture

Astro Batavia follows a modern, component-based architecture designed for scalability and maintainability:

```
┌─ 🌐 Multi-language Routing (/en, /es, /ja)
├─ 📄 Static Site Generation (Astro Islands)
├─ 🎨 Component Library (Modular & Reusable)
├─ 📝 Content Layer (MDX + Unified Processor)
├─ 🔍 SEO Layer (Structured Data + Meta)
└─ ⚡ Performance Layer (Client-Prerender + Compression)
```

### **Key Architectural Decisions**

- **Islands Architecture**: Minimal JavaScript with selective hydration
- **Content Collections**: Type-safe content management with Zod validation
- **Internationalization**: Route-based language switching with shared components
- **Component Composition**: Atomic design principles with reusable UI components
- **Manual Pagination**: High-performance manual pagination for custom routes (e.g., `/blog/`, `/blog/[slug]`) to bypass standard routing constraints and ensure sub-100ms response times.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 24.0.0 or higher
- **npm** 8.0.0 or higher (or **yarn** 1.22.0+)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/leonism/astro-batavia.git
   cd astro-batavia
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Development

1. **Start the development server**

   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:5000`

2. **Available Scripts**

   ```bash
   npm run dev          # Start development server
   npm run build        # Build for production with compression
   npm run build:only   # Build without compression
   npm run compress     # Compress existing build
   ```

3. **Access the CMS**
   - Development: `http://localhost:5000/admin`
   - Production: `https://yourdomain.com/admin`

## 🌐 Internationalization

Astro Batavia supports three languages out of the box with a flexible i18n system:

### **Supported Languages**

- 🇺🇸 **English** (`en`) - Default language
- 🇪🇸 **Spanish** (`es`)
- 🇯🇵 **Japanese** (`ja`)

### **URL Structure**

```
/                    → Redirects to /en/
/en/                 → English homepage
/es/                 → Spanish homepage
/ja/                 → Japanese homepage
/en/blog/my-post     → English blog post
/es/blog/mi-post     → Spanish blog post
```

### **Adding a New Language**

1. **Update language configuration**

   ```typescript
   // src/i18n/ui.ts
   export const languages = {
     en: 'English',
     es: 'Español',
     ja: '日本語',
     fr: 'Français', // Add new language
   };
   ```

2. **Add translations**

   ```typescript
   // src/i18n/ui.ts
   export const ui = {
     // ... existing translations
     fr: {
       'nav.home': 'Accueil',
       'nav.blog': 'Blog',
       // ... add all required translations
     },
   } as const;
   ```

3. **Update Astro configuration**
   ```javascript
   // astro.config.mjs
   i18n: {
     defaultLocale: "en",
     locales: ["en", "es", "ja", "fr"], // Add new locale
   }
   ```

## 📝 Content Management

### **Decap CMS Integration**

Content is managed through Decap CMS, providing a user-friendly interface for non-technical users:

- **Git-based**: All content stored in your repository
- **Real-time Preview**: See changes before publishing
- **Media Management**: Upload and organize images
- **Workflow**: Draft → Review → Publish process

### **Content Structure**

```
src/content/blog/
├── en/           # English posts
│   ├── post-1.mdx
│   └── post-2.mdx
├── es/           # Spanish posts
│   ├── articulo-1.mdx
│   └── articulo-2.mdx
└── ja/           # Japanese posts
    ├── 記事-1.mdx
    └── 記事-2.mdx
```

### **Frontmatter Schema**

Each blog post includes comprehensive metadata:

```yaml
---
title: 'Your Post Title'
slug: 'your-post-slug'
language: 'en'
categories: ['Technology', 'Web Development']
description: 'Post description for SEO'
keywords: ['astro', 'blog', 'seo']
author:
  name: 'Author Name'
  url: 'https://author-website.com'
  image: '/images/author.jpg'
publishDate: 2024-01-15
editDate: 2024-01-16
heroImage: '/images/hero.jpg'
tags: ['astro', 'tutorial']
draft: false
commentStatus: 'open'
robots: 'index, follow'
canonical: 'https://yourdomain.com/en/blog/your-post-slug'
---
```

### **Creating Content**

1. **Via CMS**: Use the admin interface at `/admin`
2. **Via Files**: Create `.mdx` files in the appropriate language folder
3. **Via API**: Use the content collections API for programmatic creation

## 🎨 Customization

### **Design System**

The project uses a custom design system built on Tailwind CSS v4, configured entirely within the CSS entry point:

```css
/* src/styles/global.css */
@theme {
  --color-primary-50: hsl(210 100% 98%);
  --color-primary-500: hsl(210 100% 60%);
  --color-primary-600: hsl(210 100% 50%); /* Main brand color */
  --color-primary-900: hsl(210 100% 20%);
}
```

### **Component Customization**

- **Header**: Modify `src/components/navigation/Header.astro`
- **Footer**: Update `src/components/footer/Footer.astro`
- **Blog Cards**: Customize `src/components/cards/BlogCard.astro`
- **Layout**: Edit `src/layouts/Layout.astro`

### **Styling Guidelines**

- Use Tailwind utility classes for consistency
- Follow the established color palette
- Maintain responsive design principles
- Ensure dark mode compatibility

## 📦 Build & Deployment

### **Build Process**

```bash
# Standard build
npm run build

# Build with compression (recommended for production)
npm run build        # Includes automatic compression

# Manual compression of existing build
npm run compress
```

### **Build Output**

```
dist/
├── en/              # English pages
├── es/              # Spanish pages
├── ja/              # Japanese pages
├── assets/          # Optimized CSS/JS
├── images/          # Compressed images
└── *.html.gz        # Gzip compressed files
└── *.html.br        # Brotli compressed files
```

### **Deployment Options**

#### **Netlify**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "*.gz"
  [headers.values]
    Content-Encoding = "gzip"
```

#### **Vercel**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

#### **GitHub Pages**

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload entire repository
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔧 Configuration

### **Global Constants**

The project utilizes `src/consts.ts` to centralize site-wide configuration. This file populates the majority of configurable variables used across components and layouts:

- **Core Site Data**: `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL`, and `SITE_EMAIL`.
- **Analytics**: `GTM_ID` (Google Tag Manager) is now managed here.
- **I18n Defaults**: `DEFAULT_LOCALE` and the `LOCALES` map.
- **Social Links**: Centralized links for GitHub, X (formerly Twitter), LinkedIn, etc., in the `SOCIAL_LINKS` object.
- **System Logic**: Pagination limits and default author information.

### **Environment Variables**

Create a `.env` file in the root directory:

```env
# Analytics & Tracking
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_api_key
GTM_ID=your_google_tag_manager_id

# Comments
DISQUS_SHORTNAME=your_disqus_shortname

# Error Tracking
SENTRY_DSN=your_sentry_dsn
```

### **Site Configuration**

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://www.yourdomain.com', // Update with your domain
  output: 'static',
  // ... other configuration
});
```

### **CMS Configuration**

Update the CMS backend in `public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main # or your default branch

# For GitHub
backend:
  name: github
  repo: your-username/your-repo
  branch: main
```

## 📁 Project Structure

```
astro-batavia/
├── 📁 public/                    # Static assets
│   ├── 📁 admin/                 # Decap CMS configuration
│   │   ├── config.yml            # CMS settings
│   │   └── index.html            # CMS entry point
│   ├── 📁 images/                # Static images
│   ├── favicon.svg               # Site favicon
│   ├── robots.txt                # SEO robots file
│   └── site.webmanifest          # PWA manifest
├── 📁 src/                       # Source code
│   ├── 📁 components/            # Reusable components
│   │   ├── 📁 blog/              # Blog-specific components
│   │   ├── 📁 cards/             # Card components
│   │   ├── 📁 common/            # Shared components
│   │   ├── 📁 footer/            # Footer components
│   │   ├── 📁 home/              # Homepage components
│   │   ├── 📁 navigation/        # Navigation components
│   │   ├── 📁 search/            # Search functionality
│   │   ├── 📁 sections/          # Page sections
│   │   └── 📁 ui/                # UI primitives
│   ├── 📁 content/               # Content collections
│   │   ├── 📁 blog/              # Blog posts by language
│   │   │   ├── 📁 en/            # English posts
│   │   │   ├── 📁 es/            # Spanish posts
│   │   │   └── 📁 ja/            # Japanese posts
│   │   └── config.ts             # Content schema definitions
│   ├── 📁 i18n/                  # Internationalization
│   │   ├── types.ts              # i18n TypeScript types
│   │   ├── ui.ts                 # UI translations
│   │   └── utils.ts              # i18n utility functions
│   ├── 📁 layouts/               # Page layouts
│   │   ├── BlogPost.astro        # Blog post layout
│   │   └── Layout.astro          # Base layout
│   ├── 📁 client/                # Client-side scripts (global JS/TS)
│   ├── 📁 pages/                 # Route pages
│   │   ├── 📁 [lang]/            # Dynamic language routes (including blog)
│   │   ├── 📁 api/               # API endpoints
│   │   ├── 📁 blog/              # Legacy blog aliases (kept empty for now)
│   │   ├── 📁 en/                # English pages
│   │   ├── 📁 es/                # Spanish pages
│   │   ├── 📁 ja/                # Japanese pages
│   │   ├── 404.astro             # 404 error page
│   │   └── index.astro           # Root redirect
│   ├── 📁 styles/                # Global styles
│   │   └── global.css            # Tailwind v4 configuration & theme
│   ├── 📁 utils/                 # Utility functions
│   │   ├── remark-reading-time.mjs # Reading time plugin
│   │   ├── search.ts             # Search utilities
│   │   └── seo.ts                # SEO utilities
│   └── env.d.ts                  # Environment types
├── 📁 scripts/                   # Build scripts
│   └── compress.js               # Asset compression
├── astro.config.mjs              # Astro configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

### **Key Directories Explained**

- **`src/components/`**: Modular, reusable UI components following atomic design principles
- **`src/content/blog/`**: Multilingual blog posts organized by language subdirectories
- **`src/i18n/`**: Complete internationalization system with translations and utilities
- **`src/pages/`**: File-based routing with language-specific directories
- **`public/admin/`**: Decap CMS configuration for content management
- **`scripts/`**: Build-time optimization and compression scripts

## 🤝 Contributing

We welcome contributions to Astro Batavia! Here's how you can help:

### **Getting Started**

1. **Fork the repository**

   ```bash
   git clone https://github.com/leonism/astro-batavia.git
   cd astro-batavia
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Test your changes**

   ```bash
   npm run dev
   npm run build
   ```

5. **Commit and push**

   ```bash
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**

### **Contribution Guidelines**

#### **Code Style**

- Use TypeScript for type safety
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Maintain component modularity
- Write descriptive commit messages

#### **Adding New Features**

- **Components**: Place in appropriate `src/components/` subdirectory
- **Pages**: Follow the existing language structure
- **Translations**: Add to all supported languages in `src/i18n/ui.ts`
- **Content**: Use the established frontmatter schema

#### **Bug Reports**

When reporting bugs, please include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

#### **Feature Requests**

For new features, please:

- Check existing issues first
- Provide detailed use cases
- Consider backward compatibility
- Discuss implementation approach

### **Development Workflow**

1. **Local Development**

   ```bash
   npm run dev          # Start dev server
   ```

2. **Code Quality**

   ```bash
   npm run build        # Test production build
   ```

3. **Testing**
   - Test all language versions
   - Verify responsive design
   - Check accessibility
   - Validate SEO metadata

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

### **ISC License Summary**

The ISC license is a permissive free software license that allows you to:

✅ **Use** the software for any purpose
✅ **Modify** the software
✅ **Distribute** the software
✅ **Sublicense** the software
✅ **Sell** copies of the software

**Requirements:**

- Include the original copyright notice
- Include the license text

**Limitations:**

- No warranty provided
- No liability assumed

---

<div align="center">
  <h3>🌟 Star this project if you find it helpful!</h3>
  <p>
    <a href="https://github.com/leonism/astro-batavia/stargazers">⭐ Stars</a> •
    <a href="https://github.com/your-leonism/astro-batavia/issues">🐛 Issues</a> •
    <a href="https://github.com/leonism/astro-batavia/pulls">🔀 Pull Requests</a>
  </p>

  <p><strong>Built with ❤️ using Astro.js</strong></p>

  <p>
    <a href="https://astro.build">🚀 Astro</a> •
    <a href="https://tailwindcss.com">🎨 Tailwind CSS</a> •
    <a href="https://decapcms.org">📝 Decap CMS</a>
  </p>
</div>
