import { DEFAULT_LOCALE } from '@/consts';

/**
 * Service for handling date formatting and manipulation.
 * Encapsulates logic for localized date display.
 */
export class DateService {
  /**
   * Formats a date object according to the specified language.
   * @param {Date} date - The date to format.
   * @param {string} [lang] - The language code (default: 'en').
   * @returns {string} The formatted date string.
   */
  static format(date: Date, lang: string = DEFAULT_LOCALE): string {
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
}
