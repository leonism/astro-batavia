/**
 * Enhanced Search Type Declarations for Astro Batavia
 * Defines interfaces for search documents, results, filters, and configuration.
 */

declare global {
  interface Window {
    searchInsights: () => void;
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Represents a document in the search index.
 */
export interface SearchableDocument {
  /** Unique identifier for the document */
  id: string;
  /** Title of the document */
  title: string;
  /** Short description or excerpt */
  description: string;
  /** Full content of the document (optional) */
  content?: string;
  /** List of associated tags */
  tags: string[];
  /** URL path to the document */
  url: string;
  /** Publication date */
  pubDate: Date | string | number;
  /** Author name */
  author?: string;
  /** Category name */
  category?: string;
  /** Language code */
  lang: string;
  /** URL slug */
  slug: string;
  /** Estimated reading time in minutes */
  readingTime?: number;
}

/**
 * Represents a search result with relevance metadata.
 * Extends SearchableDocument with scoring and highlighting details.
 */
export interface SearchResult extends SearchableDocument {
  /** Overall relevance score */
  relevanceScore: number;
  /** List of fields that matched the query */
  matchedFields: string[];
  /** Title with search terms highlighted (HTML) */
  highlightedTitle?: string;
  /** Description with search terms highlighted (HTML) */
  highlightedDescription?: string;
  /** Content snippet with search terms highlighted (HTML) */
  highlightedContent?: string;
  /** Generated excerpt for display */
  excerpt?: string;
  /** Score based on semantic similarity */
  semanticScore?: number;
  /** Score based on contextual relevance */
  contextualRelevance?: number;
}

/**
 * Filters that can be applied to search queries.
 */
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

/**
 * Configuration options for the search engine.
 */
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

/**
 * Represents a search suggestion or autocomplete item.
 */
export interface SearchSuggestion {
  text: string;
  type: 'query' | 'tag' | 'title' | 'semantic' | 'completion';
  score: number;
  description?: string;
  category?: string;
}

/**
 * Configuration for the search client UI.
 */
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

/**
 * Represents the current state of the search interface.
 */
export interface SearchState {
  isSearching: boolean;
  currentQuery: string;
  selectedSuggestionIndex: number;
  selectedResultIndex: number;
  lastSearchTime: number;
  hasResults: boolean;
  currentLang: string;
}

/**
 * Analytics data for search performance and usage.
 */
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
