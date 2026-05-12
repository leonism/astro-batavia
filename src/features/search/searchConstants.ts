/**
 * Array of available sort options for the search results.
 * Each option contains a value (format: 'field-order') and a display label.
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
 * Default sort configuration for the search page.
 * Used when no sort option is selected or provided in the URL.
 */
export const DEFAULT_SORT = {
  /** The field to sort by. */
  sortBy: 'hybrid',
  /** The sort order. */
  sortOrder: 'desc',
} as const;

/**
 * Configuration constants for the search feature.
 * Defines DOM element IDs, timing parameters, and feature flags.
 */
export const SEARCH_CONFIG = {
  /** ID of the main search input element. */
  searchInputId: 'main-search-input',
  /** ID of the container where search results are rendered. */
  resultsContainerId: 'results-container',
  /** ID of the element displaying search status/errors. */
  statusElementId: 'search-status',
  /** ID of the element shown when no results are found. */
  noResultsElementId: 'no-results',
  /** Debounce delay in milliseconds for search input. */
  debounceMs: 150,
  /** Minimum number of characters required to trigger a search. */
  minQueryLength: 1,
  /** Maximum number of suggestions to display. */
  maxSuggestions: 8,
  /** Flag to enable/disable voice search functionality. */
  enableVoiceSearch: true,
  /** Flag to enable/disable keyboard navigation. */
  enableKeyboardNavigation: true,
  /** Flag to enable/disable analytics tracking. */
  enableAnalytics: true,
} as const;

/**
 * Mapping of DOM element IDs and selectors used in the search page.
 */
export const DOM_IDS = {
  /** ID of the sort selection dropdown. */
  sortSelect: 'sort-select',
  /** ID of the language selection dropdown. */
  langSelect: 'lang-select',
  /** CSS selector for tag filter buttons. */
  tagFilter: '.tag-filter',
} as const;
