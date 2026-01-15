/**
 * @file I18n Type Definitions
 * @description TypeScript types for the internationalization system.
 *
 * Astro.js Tip: Using "typeof" on your translation objects ensures
 * that your keys are always type-safe across all supported languages.
 */

import type { ui, languages } from './ui';

/**
 * Valid language codes supported by the application.
 * Derived from the keys of the 'languages' object in ui.ts.
 */
export type LanguageKey = keyof typeof languages;

/**
 * Valid translation keys available in the 'ui' object.
 * We use the 'en' locale as the base for type checking.
 */
export type TranslationKey = keyof (typeof ui)['en'];
