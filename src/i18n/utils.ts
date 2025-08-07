import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)["en"] | keyof (typeof ui)["es"] | keyof (typeof ui)["ja"]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getLocalizedPath(path: string, lang: string) {
  if (lang === defaultLang) {
    if (path === "/") {
      return "/";
    } else {
      return `/${lang}${path}`;
    }
  } else {
    return `/${lang}${path}`;
  }
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
