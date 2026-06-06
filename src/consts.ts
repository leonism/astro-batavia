/**
 * Application Constants.
 * Defines global configuration values, site metadata, and defaults.
 */

// Core Site Data
export const SITE_TITLE = 'Astro Batavia';
export const SITE_DESCRIPTION = 'A modern multi-language blog built with Astro.js';
export const SITE_URL = 'https://astro-batavia.pages.dev'; // Production URL, don't add any trailing slash
export const SITE_EMAIL = 'contact@astrobatavia.com';
export const GTM_ID = 'GTM-5BH6SQST';

/**
 * Internationalization Configuration.
 */
// Internationalization
export const DEFAULT_LOCALE = 'en';
export const LOCALES = {
  en: 'en',
  es: 'es',
  ja: 'ja',
} as const;

export type LocaleKey = keyof typeof LOCALES;

/**
 * Default Author Information.
 */
// Author Defaults
export const SITE_AUTHOR = {
  name: `${SITE_TITLE} Team`,
  image: '/images/og-default.svg', // Local fallback
  url: `${SITE_URL}/about`,
  email: `${SITE_EMAIL}`,
};

/**
 * Site Utility Links.
 */
// Site Utilities
export const SITE_UTILS = {
  rss: `${SITE_URL}/rss.xml`,
  sitemap: `${SITE_URL}/sitemap-0.xml`,
};

/**
 * Legal Page Paths.
 */
export const LEGAL_PATHS = {
  privacy: '/privacy/',
  terms: '/terms/',
  cookies: '/cookies/',
};

/**
 * Social Media Links.
 */
// Social Links
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
 * System Configuration Logic.
 */
// System Logic
export const PAGINATION_POSTS_PER_PAGE = 7;
export const PAGINATION_TAGS_PER_PAGE = 5;
export const PAGINATION_AUTHORS_PER_PAGE = 6;
export const SEARCH_MAX_SUGGESTIONS = 6;

/**
 * Date Formatting Configuration.
 */
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  ja: 'ja-JP',
};
