# Enterprise-Grade SEO Implementation Guide

Astro Batavia implements a multi-layered SEO strategy, combining technical perfection with rich content metadata.

## Core Architecture

The SEO system is managed through two primary layers:

1.  **`SEOService.ts`**: Handles the logic for meta tags, Open Graph, and Twitter Cards.
2.  **`SchemaService.ts`**: Generates complex JSON-LD structured data for search engine rich results.

## Key Features

### 🚀 Technical SEO

- **Dynamic Meta Tags**: Automatic generation of titles, descriptions, and canonical URLs.
- **Multilingual Hreflang**: Correct alternate link injection for all supported languages.
- **Robots Management**: Granular control via frontmatter (`index, follow`).
- **Sitemap Indexing**: Automatic inclusion of post-modifed dates and priority scoring.

### 📊 Rich Result Support (JSON-LD)

We support a wide array of Schema.org types, auto-generated from blog frontmatter:

- **BlogPosting**: Full article metadata including reading time and word count.
- **Organization**: Centralized brand data with social profiles.
- **BreadcrumbList**: Automatic path generation for Google search results.
- **FAQPage**: Injected when `faqs` are present in the MDX frontmatter.
- **Review**: Support for aggregate ratings and individual review snippets.
- **ImageObject**: Enhanced metadata including license, creator, and credit text.

## Usage Guide

### Frontmatter Schema

To maximize SEO impact, provide comprehensive metadata in your MDX files:

```yaml
---
title: 'The Ultimate Guide to Astro SEO'
description: 'Master the art of search engine optimization with Astro Batavia.'
author:
  name: 'Leo'
  url: 'https://leonism.com'
tags: ['astro', 'seo', 'tutorial']
categories: ['Web Development']
faqs:
  - question: 'Is Astro good for SEO?'
    answer: 'Yes, because it generates static HTML by default.'
reviews:
  - author: 'Jane Doe'
    reviewBody: 'Excellent guide, very helpful!'
    reviewRating: 5
heroImage: '/images/seo-guide.jpg'
---
```

### Layout Integration

The `Layout.astro` component automatically consumes this data and passes it to the `SEO` and `Schema` components:

```astro
<Layout
  title={title}
  description={description}
  image={heroImage}
  type="article"
>
  <slot />
</Layout>
```

## Advanced Open Graph

Our system generates optimized tags for various platforms:

- **Facebook/LinkedIn**: `og:image:width`, `og:image:height` (calculated at build time).
- **Twitter**: High-quality `summary_large_image` cards.
- **WhatsApp**: Compact metadata for clean link previews.

## Monitoring & Validation

1.  **Sitemap**: Accessible at `/sitemap-index.xml`.
2.  **RSS Feed**: Styled and optimized at `/rss.xml`.
3.  **Performance**: Verified via Lighthouse and PageSpeed Insights.

## SEO Best Practices for Authors

1.  **Focus Keywords**: Include your primary keyword in the first 100 words.
2.  **Alt Text**: Always provide descriptive text for the `heroImage`.
3.  **Slug Optimization**: Keep URLs short and keyword-rich.
4.  **Internal Linking**: Use the `RelatedArticles` feature to boost topical authority.
