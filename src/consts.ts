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

/**
 * Social media handles and URLs.
 */
export const SOCIAL_LINKS = {
  github: 'https://www.github.com/leonism/astro-batavia',
  X: 'https://www.x.com/AstroBatavia',
  linkedin: 'https://www.linkedin.com/in/astrobatavia',
  youtube: 'https://www.youtube.com/@AstroBatavia',
  instagram: 'https://www.instagram.com/@AstroBatavia',
  tiktok: 'https://www.tiktok.com/@AstroBatavia',
  telegram: 'https://t.me/AstroBatavia',
  facebook: 'https://www.facebook.com/AstroBatavia',
};

/**
 * Internationalization (I18n) Configuration
 */
export const LOCALES = {
  en: 'en',
  es: 'es',
  ja: 'ja',
} as const;

export type LocaleKey = keyof typeof LOCALES;

// Social & Author Defaults
export const SITE_AUTHOR = {
  name: 'Astro Batavia Team',
  image: '/images/default-author.jpg', // Local fallback
  url: 'https://astro-batavia.pages.dev/about',
};

// System Logic
export const PAGINATION_POSTS_PER_PAGE = 6;
export const SEARCH_MAX_SUGGESTIONS = 6;
export const SEARCH_DEBOUNCE_MS = 150;
export const UI_CONFIG = {
  postsPerPage: PAGINATION_POSTS_PER_PAGE,
  relatedPostsLimit: 3,
} as const;
