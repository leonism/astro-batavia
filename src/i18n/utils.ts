import { ui, defaultLang } from './ui';
import type { TranslationKey } from './types';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: TranslationKey) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getLocalizedPath(path: string, lang: string) {
  // Special case: English home page stays at root
  if (lang === 'en' && (path === '/' || path === '')) {
    return '/';
  }
  const cleanPath = path.startsWith('/') ? path : '/' + path;
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
  return defaultLang;
}

export function formatDate(date: Date, lang: string = defaultLang): string {
  const locales = {
    en: 'en-US',
    es: 'es-ES',
    ja: 'ja-JP',
  };

  return new Intl.DateTimeFormat(locales[lang as keyof typeof locales] || locales.en, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getAvailableLanguages() {
  return Object.keys(ui);
}

export function isValidLanguage(lang: string): lang is keyof typeof ui {
  return lang in ui;
}
