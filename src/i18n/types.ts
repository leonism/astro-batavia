/**
 * Internationalization Type Definitions.
 * Defines TypeScript types for handling languages and translations.
 */

import type { ui, languages } from './ui';

/**
 * Supported Language Keys.
 * Union type of all valid language codes (e.g., 'en' | 'es' | 'ja').
 */
export type LanguageKey = keyof typeof languages;

/**
 * Translation Keys.
 * Union type of all valid translation keys based on the default language (English).
 * Ensures type safety when accessing UI strings.
 */
export type TranslationKey = keyof (typeof ui)['en'];
