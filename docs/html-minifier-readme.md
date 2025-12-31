# Enterprise HTML Minifier Integration

This document provides an overview of the `enterprise-html-minifier` Astro integration, its features, and how to configure it.

## Overview

The `enterprise-html-minifier` is a custom Astro integration that automatically minifies all generated HTML files at the end of the build process. It is designed for high performance and detailed reporting, making it suitable for large-scale projects.

## Features

- **High-Performance Minification**: Utilizes the powerful and highly configurable [`html-minifier-terser`](https://github.com/terser/html-minifier-terser) library.
- **Multi-Core Processing**: Leverages all available CPU cores to minify files in parallel, significantly speeding up the build process.
- **Detailed Reporting**: Provides a comprehensive summary after the build, including:
  - Total number of files scanned and processed.
  - Detailed error reporting without halting the build for non-critical errors.
  - Original and minified sizes of the HTML files.
  - Total size saved and the percentage of reduction.
- **Configurability**: Allows you to override the default minification options for granular control.

## Usage

The integration is already configured in `astro.config.mjs`. It runs automatically during a production build (`npm run build`).

To use it, simply import it and add it to the `integrations` array in your `astro.config.mjs` file:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import htmlMinifier from './src/integrations/html-minifier.mjs';

export default defineConfig({
  // ...
  integrations: [
    // ...
    htmlMinifier(),
  ],
});
```

## Configuration

You can customize the minification options by passing an object to the `htmlMinifier` function. These options are passed directly to `html-minifier-terser`.

### Example

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import htmlMinifier from './src/integrations/html-minifier.mjs';

export default defineConfig({
  // ...
  integrations: [
    // ...
    htmlMinifier({
      removeComments: false, // Keep comments in the HTML
      collapseWhitespace: false, // Disable whitespace collapsing
    }),
  ],
});
```

### Default Options

The integration uses a set of default options that are optimized for performance and safety. These are:

```javascript
{
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeOptionalTags: false, // Important: set to true can break pages
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true,
}
```

For a full list of available options, please refer to the [`html-minifier-terser` documentation](https://github.com/terser/html-minifier-terser#options-quick-reference).
