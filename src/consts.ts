// Core Site Data
export const SITE_TITLE = 'Astro Batavia';
export const SITE_DESCRIPTION = 'A modern multi-language blog built with Astro.js';
export const SITE_URL = 'https://astro-batavia.pages.dev'; // Production URL
export const SITE_EMAIL = 'contact@astrobatavia.com';
export const GTM_ID = 'GTM-5BH6SQST';

// Internationalization
export const DEFAULT_LOCALE = 'en';
export const LOCALES = {
  en: 'en',
  es: 'es',
  ja: 'ja',
} as const;

export type LocaleKey = keyof typeof LOCALES;

// Social & Author Defaults
export const SITE_AUTHOR = {
  name: `${SITE_TITLE} Team`,
  image: '/images/default-author.jpg', // Local fallback
  url: `${SITE_URL}/about`,
  email: `${SITE_EMAIL}`,
};

export const SOCIAL_LINKS = {
  github: 'https://www.github.com/leonism/astro-batavia',
  X: 'https://www.x.com/AstroBatavia',
  linkedin: 'https://www.linkedin.com/in/astrobatavia',
  youtube: 'https://www.youtube.com/@AstroBatavia',
  instagram: 'https://www.instagram.com/@AstroBatavia',
  tiktok: 'https://www.tiktok.com/@AstroBatavia',
  telegram: 'https://t.me/AstroBatavia',
  facebook: 'https://www.facebook.com/AstroBatavia',
  rss: '${SITE_URL}/rss.xml',
  sitemap: '${SITE_URL}/sitemap-0.xml',
};

// System Logic
export const PAGINATION_POSTS_PER_PAGE = 6;
export const SEARCH_MAX_SUGGESTIONS = 6;
