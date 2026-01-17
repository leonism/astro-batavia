import type { ui, languages } from './ui';

export type LanguageKey = keyof typeof languages;
export type TranslationKey = keyof (typeof ui)['en'];
