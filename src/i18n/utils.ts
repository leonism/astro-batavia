import { ui } from './ui';
import type { TranslationKey } from './types';
import { DEFAULT_LOCALE } from '../consts';

export const defaultLang = DEFAULT_LOCALE;
export { ui };

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return DEFAULT_LOCALE;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: TranslationKey) {
    if (!ui[lang]) {
      console.warn(`Translation language "${lang}" not found, falling back to "${DEFAULT_LOCALE}"`);
      return ui[DEFAULT_LOCALE][key] || key;
    }
    return ui[lang][key] || ui[DEFAULT_LOCALE][key] || key;
  };
}

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

export function removeLocaleFromPath(path: string) {
  const segments = path.split('/');
  if (segments[1] && segments[1] in ui) {
    segments.splice(1, 1);
  }
  return segments.join('/') || '/';
}

export function getLanguageFromPath(path: string): string {
  const segments = path.split('/');
  if (segments[1] && segments[1] in ui) {
    return segments[1];
  }
  return DEFAULT_LOCALE;
}

export function getAvailableLanguages() {
  return Object.keys(ui);
}

export function isValidLanguage(lang: string): lang is keyof typeof ui {
  return lang in ui;
}

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
