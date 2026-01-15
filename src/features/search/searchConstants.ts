/**
 * @file Search Constants
 * @description Configuration values for the Search feature.
 *
 * Astro.js Tip: Keeping UI constants separate from logic makes it easier
 * to tweak the user experience without touching the engine.
 */

import { SEARCH_MAX_SUGGESTIONS, SEARCH_DEBOUNCE_MS } from '../../consts';

/**
 * Available sorting options for search results.
 */
export const SORT_OPTIONS = [
  { value: 'hybrid-desc', label: 'Best Match' },
  { value: 'relevance-desc', label: 'Most Relevant' },
  { value: 'semantic-desc', label: 'Semantic Match' },
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
] as const;

/**
 * Default sorting configuration.
 */
export const DEFAULT_SORT = {
  sortBy: 'hybrid',
  sortOrder: 'desc',
} as const;

/**
 * Main search configuration.
 * Uses global defaults where applicable.
 */
export const SEARCH_CONFIG = {
  searchInputId: 'main-search-input',
  resultsContainerId: 'results-container',
  statusElementId: 'search-status',
  noResultsElementId: 'no-results',
  debounceMs: SEARCH_DEBOUNCE_MS,
  minQueryLength: 1,
  maxSuggestions: SEARCH_MAX_SUGGESTIONS,
  enableVoiceSearch: true,
  enableKeyboardNavigation: true,
  enableAnalytics: true,
} as const;

/**
 * DOM element IDs and selectors used by the search controller.
 */
export const DOM_IDS = {
  sortSelect: 'sort-select',
  langSelect: 'lang-select',
  tagFilter: '.tag-filter',
} as const;
