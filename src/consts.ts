/**
 * @file Site Configuration Constants
 * @description Centralized configuration for the Astro Batavia project.
 * These constants are used throughout the application to maintain consistency.
 *
 * Astro.js Tip: Using a central constants file is a best practice for
 * maintaining "Single Source of Truth" in your project.
 */

/**
 * Site metadata used for SEO and head tags.
 */
export const SITE_METADATA = {
  title: 'Astro Batavia',
  description: 'A modern, high-performance Astro.js starter template with multi-language support.',
  defaultLanguage: 'en',
  siteUrl: 'https://astro-batavia.pages.dev',
} as const;

// Backward compatibility aliases
export const SITE_TITLE = SITE_METADATA.title;
export const SITE_DESCRIPTION = SITE_METADATA.description;
export const SITE_URL = SITE_METADATA.siteUrl;

/**
 * Information about the site author, used for SEO and blog post metadata.
 */
export const SITE_AUTHOR = {
  name: 'Gemika Haziq Nugroho',
  image: '/images/og-default.png',
  url: 'https://github.com/gemikahzqn',
} as const;

/**
 * Social media handles and URLs.
 */
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/astrodotbuild',
  github: 'https://github.com/withastro/astro',
} as const;

/**
 * Internationalization (I18n) Configuration
 */
export const LOCALES = {
  en: 'en',
  es: 'es',
  ja: 'ja',
} as const;

export const DEFAULT_LOCALE = SITE_METADATA.defaultLanguage;

/**
 * Search configuration constants.
 * These values control the behavior of the EnhancedSearch engine.
 */
export const SEARCH_MAX_SUGGESTIONS = 8;
export const SEARCH_DEBOUNCE_MS = 150;

/**
 * UI Configuration
 * Values that affect the visual representation of the site.
 */
export const UI_CONFIG = {
  postsPerPage: 6,
  relatedPostsLimit: 3,
} as const;

// Pagination alias for backward compatibility
export const PAGINATION_POSTS_PER_PAGE = UI_CONFIG.postsPerPage;
