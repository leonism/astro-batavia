import { ui } from './ui';
import type { TranslationKey } from './types';
import { DEFAULT_LOCALE } from '../consts';

export const defaultLang = DEFAULT_LOCALE;
export { ui };

/**
 * Extracts the language code from a URL.
 *
 * @param {URL} url - The URL object.
 * @returns {keyof typeof ui} The language code found in the URL, or the default locale if not found.
 */
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return DEFAULT_LOCALE;
}

/**
 * Creates a translation function for a specific language.
 *
 * @param {keyof typeof ui} lang - The language code.
 * @returns {function(TranslationKey): string} A function that takes a translation key and returns the translated string.
 */
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: TranslationKey) {
    if (!ui[lang]) {
      console.warn(`Translation language "${lang}" not found, falling back to "${DEFAULT_LOCALE}"`);
      return ui[DEFAULT_LOCALE][key] || key;
    }
    return ui[lang][key] || ui[DEFAULT_LOCALE][key] || key;
  };
}

/**
 * Generates a localized path for a given path and language.
 * Handles special cases for the search page and the default locale's home page.
 *
 * @param {string} path - The path to localize.
 * @param {string} lang - The target language code.
 * @returns {string} The localized path.
 */
export function getLocalizedPath(path: string, lang: string) {
  const cleanPath = path.startsWith('/') ? path : '/' + path;

  // Special case: Search page is unified and language-agnostic in the URL
  if (cleanPath === '/search') {
    return '/search';
  }

  // Special case: English home page stays at root
  if (lang === DEFAULT_LOCALE && (path === '/' || path === '')) {
    return '/';
  }
  return `/${lang}${cleanPath}`;
}

/**
 * Generates a localized URL for a blog post based on its slug and language.
 *
 * @param {string} slug - The blog post slug (e.g., "lang/slug-content").
 * @param {string} lang - The target language.
 * @returns {string} The localized URL for the blog post.
 */
export function getPostUrl(slug: string, lang: string) {
  // slug usually is "lang/slug-content" or "lang/blog/slug-content"
  const parts = slug.split('/');
  const slugWithoutLang = parts.slice(1).join('/');

  // Check if the slug already includes the 'blog' segment to avoid double /blog/blog/
  const path = slugWithoutLang.startsWith('blog/')
    ? `/${slugWithoutLang}`
    : `/blog/${slugWithoutLang}`;

  return getLocalizedPath(path, lang);
}

/**
 * Removes the locale segment from a path.
 *
 * @param {string} path - The path containing a locale.
 * @returns {string} The path without the locale segment.
 */
export function removeLocaleFromPath(path: string) {
  const segments = path.split('/');
  if (segments[1] && segments[1] in ui) {
    segments.splice(1, 1);
  }
  return segments.join('/') || '/';
}

/**
 * Extracts the language code from a path string.
 *
 * @param {string} path - The path string.
 * @returns {string} The language code found in the path, or the default locale.
 */
export function getLanguageFromPath(path: string): string {
  const segments = path.split('/');
  if (segments[1] && segments[1] in ui) {
    return segments[1];
  }
  return DEFAULT_LOCALE;
}

/**
 * Retrieves the list of available languages.
 *
 * @returns {string[]} An array of available language codes.
 */
export function getAvailableLanguages() {
  return Object.keys(ui);
}

/**
 * Checks if a language code is valid (exists in the UI configuration).
 *
 * @param {string} lang - The language code to check.
 * @returns {boolean} True if the language is valid, false otherwise.
 */
export function isValidLanguage(lang: string): lang is keyof typeof ui {
  return lang in ui;
}

/**
 * Slugifies a tag string for use in URLs.
 * Converts to lowercase, removes diacritics, and replaces spaces/symbols with hyphens.
 *
 * @param {string} tag - The tag string to slugify.
 * @returns {string} The slugified tag.
 */
export function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritic marks
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/\//g, '-') // Replace slashes with hyphens
    .replace(/[!"#$%&'()*+,.:;<=>?@\[\\\]^`{|}~]/g, '') // Remove symbols
    .replace(/--+/g, '-') // Replace multiple hyphens
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}
