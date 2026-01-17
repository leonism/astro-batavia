import { DEFAULT_LOCALE } from '@/consts';

/**
 * Formats a date object according to the specified language.
 * @param date The date to format.
 * @param lang The language code (default: 'en').
 * @returns The formatted date string.
 */
export function formatDate(date: Date, lang: string = DEFAULT_LOCALE): string {
  const locales: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    ja: 'ja-JP',
  };

  return new Intl.DateTimeFormat(locales[lang] || locales.en, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
