import { DEFAULT_LOCALE, DATE_FORMAT_OPTIONS, LOCALE_MAP } from '@/consts';

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
    return new Intl.DateTimeFormat(LOCALE_MAP[lang] || LOCALE_MAP[DEFAULT_LOCALE], DATE_FORMAT_OPTIONS).format(date);
  }
}
