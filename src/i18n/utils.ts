/**
 * @file I18n Utilities
 * @description Helper functions for handling multi-language routing and translations.
 *
 * Astro.js Tip: Routing is a key part of I18n. These utilities help manage
 * localized paths and language detection from URLs.
 */

import { ui, defaultLang } from './ui';
export { ui, defaultLang };
import type { TranslationKey } from './types';
import { DEFAULT_LOCALE } from '../consts';

/**
 * Detects the current language based on the URL pathname.
 * @param url The current URL object.
 * @returns The detected language key or the default locale.
 */
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return DEFAULT_LOCALE as keyof typeof ui;
}

/**
 * Creates a translation function for a specific language.
 * @param lang The language to translate into.
 * @returns A translation function 't' that takes a key and returns the string.
 */
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: TranslationKey) {
    if (!ui[lang]) {
      console.warn(`Translation language "${lang}" not found, falling back to "${DEFAULT_LOCALE}"`);
      return (ui[DEFAULT_LOCALE as keyof typeof ui] as any)[key] || key;
    }
    return (ui[lang] as any)[key] || (ui[DEFAULT_LOCALE as keyof typeof ui] as any)[key] || key;
  };
}

/**
 * Generates a localized path for a given clean path and language.
 * @param path The relative path (e.g., '/about').
 * @param lang The target language code.
 * @returns The fully qualified localized path.
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
 * @param slug The blog post slug.
 * @param lang The target language.
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
 * Removes the locale prefix from a pathname.
 */
export function removeLocaleFromPath(path: string) {
  const segments = path.split('/');
  if (segments[1] && segments[1] in ui) {
    segments.splice(1, 1);
  }
  return segments.join('/') || '/';
}

/**
 * Extracts the language code from a pathname.
 */
export function getLanguageFromPath(path: string): string {
  const segments = path.split('/');
  if (segments[1] && segments[1] in ui) {
    return segments[1];
  }
  return DEFAULT_LOCALE;
}

/**
 * Formats a date according to the specified language.
 */
export function formatDate(date: Date, lang: string = DEFAULT_LOCALE): string {
  const locales = {
    en: 'en-US',
    es: 'es-ES',
    ja: 'ja-JP',
  } as const;

  return new Intl.DateTimeFormat(locales[lang as keyof typeof locales] || locales.en, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Returns an array of all supported language codes.
 */
export function getAvailableLanguages() {
  return Object.keys(ui);
}

/**
 * Checks if a language code is supported.
 */
export function isValidLanguage(lang: string): lang is keyof typeof ui {
  return lang in ui;
}

/**
 * Converts a string into a URL-friendly tag slug.
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
