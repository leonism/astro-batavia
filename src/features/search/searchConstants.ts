export const SORT_OPTIONS = [
  { value: 'hybrid-desc', label: 'Best Match' },
  { value: 'relevance-desc', label: 'Most Relevant' },
  { value: 'semantic-desc', label: 'Semantic Match' },
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
] as const;

export const DEFAULT_SORT = {
  sortBy: 'hybrid',
  sortOrder: 'desc',
} as const;

export const SEARCH_CONFIG = {
  searchInputId: 'main-search-input',
  resultsContainerId: 'results-container',
  statusElementId: 'search-status',
  noResultsElementId: 'no-results',
  debounceMs: 150,
  minQueryLength: 1,
  maxSuggestions: 8,
  enableVoiceSearch: true,
  enableKeyboardNavigation: true,
  enableAnalytics: true,
} as const;

export const DOM_IDS = {
  sortSelect: 'sort-select',
  langSelect: 'lang-select',
  tagFilter: '.tag-filter',
} as const;
