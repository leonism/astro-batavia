/**
 * Enhanced Search Type Declarations for Astro Batavia
 */

declare global {
  interface Window {
    searchInsights: () => void;
    gtag?: (...args: any[]) => void;
  }
}

export interface SearchableDocument {
  id: string;
  title: string;
  description: string;
  content?: string;
  tags: string[];
  url: string;
  pubDate: Date | string | number;
  author?: string;
  category?: string;
  lang: string;
  slug: string;
  readingTime?: number;
}

export interface SearchResult extends SearchableDocument {
  relevanceScore: number;
  matchedFields: string[];
  highlightedTitle?: string;
  highlightedDescription?: string;
  highlightedContent?: string;
  excerpt?: string;
  semanticScore?: number;
  contextualRelevance?: number;
}

export interface SearchFilters {
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  author?: string;
  category?: string;
  lang?: string;
  sortBy?: 'relevance' | 'date' | 'title' | 'semantic' | 'hybrid';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchOptions {
  fuzzyThreshold?: number;
  maxResults?: number;
  enableHighlighting?: boolean;
  enableSuggestions?: boolean;
  minQueryLength?: number;
  semanticBoost?: number;
  contextualBoost?: number;
  typoTolerance?: boolean;
  phraseMatching?: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'tag' | 'title' | 'semantic' | 'completion';
  score: number;
  description?: string;
  category?: string;
}

export interface SearchClientConfig {
  searchInputId: string;
  resultsContainerId: string;
  suggestionsContainerId?: string;
  statusElementId?: string;
  noResultsElementId?: string;
  debounceMs?: number;
  minQueryLength?: number;
  maxSuggestions?: number;
  enableVoiceSearch?: boolean;
  enableKeyboardNavigation?: boolean;
  enableAnalytics?: boolean;
}

export interface SearchState {
  isSearching: boolean;
  currentQuery: string;
  selectedSuggestionIndex: number;
  selectedResultIndex: number;
  lastSearchTime: number;
  hasResults: boolean;
  currentLang: string;
}

export interface SearchInsights {
  searchCount: number;
  avgSearchTime: number;
  cacheHitRate: number;
  totalDocuments: number;
  indexSize: number;
  cacheSize: number;
  topQueries: Array<{
    query: string;
    count: number;
  }>;
  clientState: SearchState;
}

// Keyboard navigation constants
export const KEYBOARD_KEYS = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
} as const;

// Accessibility ARIA roles and attributes
export const ARIA_ROLES = {
  COMBOBOX: 'combobox',
  LISTBOX: 'listbox',
  OPTION: 'option',
  SEARCHBOX: 'searchbox',
  STATUS: 'status',
  REGION: 'region',
  ARTICLE: 'article',
} as const;

export const ARIA_ATTRIBUTES = {
  EXPANDED: 'aria-expanded',
  SELECTED: 'aria-selected',
  ACTIVE_DESCENDANT: 'aria-activedescendant',
  CONTROLS: 'aria-controls',
  DESCRIBEDBY: 'aria-describedby',
  LABELLEDBY: 'aria-labelledby',
  LIVE: 'aria-live',
  ATOMIC: 'aria-atomic',
  AUTOCOMPLETE: 'aria-autocomplete',
  HASPOPUP: 'aria-haspopup',
} as const;

export {};
