/**
 * Enhanced Search Client for Astro Batavia
 * Features: Debouncing, accessibility, instant search, progressive enhancement
 */

import EnhancedSearchEngine, { SearchResult, SearchSuggestion } from './EnhancedSearchEngine';

declare const gtag: (...args: any[]) => void;

interface SearchClientConfig {
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

interface SearchState {
  isSearching: boolean;
  currentQuery: string;
  selectedSuggestionIndex: number;
  selectedResultIndex: number;
  lastSearchTime: number;
  hasResults: boolean;
  currentLang: string;
}

export class EnhancedSearchClient {
  private searchEngine: EnhancedSearchEngine;
  private config: SearchClientConfig;
  private state: SearchState;
  private elements: {
    searchInput?: HTMLInputElement;
    resultsContainer?: HTMLElement;
    suggestionsContainer?: HTMLElement;
    statusElement?: HTMLElement;
    noResultsElement?: HTMLElement;
  } = {};

  private debounceTimer: NodeJS.Timeout | null = null;
  private suggestionDebounceTimer: NodeJS.Timeout | null = null;
  private currentAbortController: AbortController | null = null;

  // Accessibility announcements
  private announcer!: HTMLElement;

  // Performance monitoring
  private performanceObserver?: PerformanceObserver;

  constructor(config: SearchClientConfig) {
    this.config = {
      debounceMs: 150,
      minQueryLength: 1,
      maxSuggestions: 6,
      enableVoiceSearch: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      enableKeyboardNavigation: true,
      enableAnalytics: true,
      ...config
    };

    this.state = {
      isSearching: false,
      currentQuery: '',
      selectedSuggestionIndex: -1,
      selectedResultIndex: -1,
      lastSearchTime: 0,
      hasResults: false,
      currentLang: 'all' // Always search across all languages by default
    };

    this.searchEngine = new EnhancedSearchEngine();
    this.setupAccessibility();
    this.initializeElements();
    this.setupEventListeners();
    this.setupPerformanceMonitoring();
  }

  /**
   * Initialize the search system with documents
   */
  async initialize(documents: any[]): Promise<void> {
    try {
      this.setLoadingState(true, 'Initializing search...');
      await this.searchEngine.indexDocuments(documents);
      this.setLoadingState(false, `Ready to search ${documents.length} articles.`);
      console.log('Enhanced search client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize search client:', error);
      this.setLoadingState(false, 'Search initialization failed.');
    }
  }

  /**
   * Perform search with enhanced features
   */
  async search(query: string, options: any = {}): Promise<SearchResult[]> {
    // Cancel any ongoing search
    if (this.currentAbortController) {
      this.currentAbortController.abort();
    }

    this.currentAbortController = new AbortController();

    try {
      this.state.isSearching = true;
      this.state.currentQuery = query;

      const startTime = performance.now();

      const searchFilters = {
        lang: this.state.currentLang === 'all' ? undefined : this.state.currentLang,
        ...options
      };

      // Ensure language is correctly handled
      if (searchFilters.lang === 'all' || options.lang === 'all') {
        searchFilters.lang = 'all';
      }

      const results = this.searchEngine.search(query, searchFilters, {
        enableHighlighting: true,
        typoTolerance: true,
        phraseMatching: true,
        semanticBoost: 1.3,
        ...options
      });

      const searchTime = performance.now() - startTime;

      this.state.hasResults = results.length > 0;
      this.updateSearchStatus(query, results.length, searchTime);

      if (this.config.enableAnalytics) {
        this.trackSearchEvent(query, results.length, searchTime);
      }

      return results;

    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Search error:', error);
        this.updateSearchStatus(query, 0, 0, 'Search error occurred');
      }
      return [];
    } finally {
      this.state.isSearching = false;
      this.currentAbortController = null;
    }
  }

  /**
   * Get intelligent search suggestions
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (query.length < 2) return [];

    try {
      const suggestions = this.searchEngine.getSuggestions(query, this.config.maxSuggestions);
      this.displaySuggestions(suggestions);
      return suggestions;
    } catch (error) {
      console.error('Suggestion error:', error);
      return [];
    }
  }

  /**
   * Display search results with accessibility
   */
  displayResults(results: SearchResult[]): void {
    if (!this.elements.resultsContainer) return;

    const container = this.elements.resultsContainer;
    container.innerHTML = '';

    if (results.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();

    // Create results with proper accessibility
    results.forEach((result, index) => {
      const resultElement = this.createResultElement(result, index);
      container.appendChild(resultElement);
    });

    // Announce results to screen readers
    this.announceToScreenReader(
      `Found ${results.length} search results for "${this.state.currentQuery}"`
    );
  }

  /**
   * Display search suggestions with keyboard navigation
   */
  private displaySuggestions(suggestions: SearchSuggestion[]): void {
    if (!this.elements.suggestionsContainer) return;

    const container = this.elements.suggestionsContainer;
    container.innerHTML = '';

    if (suggestions.length === 0) {
      container.classList.add('hidden');
      return;
    }

    container.classList.remove('hidden');

    suggestions.forEach((suggestion, index) => {
      const suggestionElement = this.createSuggestionElement(suggestion, index);
      container.appendChild(suggestionElement);
    });

    // Reset selection
    this.state.selectedSuggestionIndex = -1;
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyboardNavigation(event: KeyboardEvent): void {
    if (!this.config.enableKeyboardNavigation) return;

    // Handle suggestions navigation
    const suggestions = this.elements.suggestionsContainer?.children;
    const results = this.elements.resultsContainer?.querySelectorAll('.search-result');

    console.log('Keyboard navigation - Key:', event.key, 'Results found:', results?.length, 'Suggestions:', suggestions?.length);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDown(suggestions, results || undefined);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigateUp(suggestions, results || undefined);
        break;

      case 'Enter':
        event.preventDefault();
        this.handleEnterKey(suggestions, results || undefined);
        break;

      case 'Escape':
        this.handleEscapeKey();
        break;

      case 'Tab':
        // Allow natural tab navigation through results
        if (this.state.selectedSuggestionIndex >= 0) {
          this.clearSuggestions();
        }
        break;

      case 'Home':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.navigateToFirst(suggestions, results || undefined);
        }
        break;

      case 'End':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.navigateToLast(suggestions, results || undefined);
        }
        break;
    }
  }

  /**
   * Navigate down through suggestions and results
   */
  private navigateDown(suggestions: HTMLCollection | undefined, results: NodeListOf<Element> | undefined): void {
    const hasActiveSuggestions = suggestions && suggestions.length > 0 &&
      !this.elements.suggestionsContainer?.classList.contains('hidden');

    if (hasActiveSuggestions) {
      this.state.selectedSuggestionIndex = Math.min(
        this.state.selectedSuggestionIndex + 1,
        suggestions.length - 1
      );
      this.updateSuggestionSelection();
    } else if (results && results.length > 0) {
      this.state.selectedResultIndex = Math.min(
        this.state.selectedResultIndex + 1,
        results.length - 1
      );
      this.updateResultSelection(results);
    }
  }

  /**
   * Navigate up through suggestions and results
   */
  private navigateUp(suggestions: HTMLCollection | undefined, results: NodeListOf<Element> | undefined): void {
    const hasActiveSuggestions = suggestions && suggestions.length > 0 &&
      !this.elements.suggestionsContainer?.classList.contains('hidden');

    if (hasActiveSuggestions) {
      this.state.selectedSuggestionIndex = Math.max(
        this.state.selectedSuggestionIndex - 1,
        -1
      );
      this.updateSuggestionSelection();
    } else if (results && results.length > 0) {
      this.state.selectedResultIndex = Math.max(
        this.state.selectedResultIndex - 1,
        -1
      );
      this.updateResultSelection(results);
    }
  }

  /**
   * Handle Enter key for suggestions and results
   */
  private handleEnterKey(suggestions: HTMLCollection | undefined, results: NodeListOf<Element> | undefined): void {
    const hasActiveSuggestions = suggestions && suggestions.length > 0 &&
      !this.elements.suggestionsContainer?.classList.contains('hidden');

    if (hasActiveSuggestions && this.state.selectedSuggestionIndex >= 0) {
      const selectedElement = suggestions[this.state.selectedSuggestionIndex] as HTMLElement;
      const suggestionText = selectedElement.querySelector('button')?.textContent || selectedElement.textContent || '';
      this.selectSuggestion(suggestionText);
    } else if (results && results.length > 0 && this.state.selectedResultIndex >= 0) {
      const selectedResult = results[this.state.selectedResultIndex] as HTMLElement;
      const link = selectedResult.querySelector('a') as HTMLAnchorElement;
      if (link) {
        this.announceToScreenReader(`Opening article: ${link.getAttribute('aria-describedby') || 'Selected article'}`);
        link.click();
      }
    }
  }

  /**
   * Handle Escape key
   */
  private handleEscapeKey(): void {
    if (this.elements.suggestionsContainer && !this.elements.suggestionsContainer.classList.contains('hidden')) {
      this.clearSuggestions();
    } else {
      this.elements.searchInput?.blur();
      this.state.selectedResultIndex = -1;
      this.updateResultSelection(this.elements.resultsContainer?.querySelectorAll('.search-result') || []);
    }
  }

  /**
   * Navigate to first item
   */
  private navigateToFirst(suggestions: HTMLCollection | undefined, results: NodeListOf<Element> | undefined): void {
    const hasActiveSuggestions = suggestions && suggestions.length > 0 &&
      !this.elements.suggestionsContainer?.classList.contains('hidden');

    if (hasActiveSuggestions) {
      this.state.selectedSuggestionIndex = 0;
      this.updateSuggestionSelection();
    } else if (results && results.length > 0) {
      this.state.selectedResultIndex = 0;
      this.updateResultSelection(results);
    }
  }

  /**
   * Navigate to last item
   */
  private navigateToLast(suggestions: HTMLCollection | undefined, results: NodeListOf<Element> | undefined): void {
    const hasActiveSuggestions = suggestions && suggestions.length > 0 &&
      !this.elements.suggestionsContainer?.classList.contains('hidden');

    if (hasActiveSuggestions) {
      this.state.selectedSuggestionIndex = suggestions.length - 1;
      this.updateSuggestionSelection();
    } else if (results && results.length > 0) {
      this.state.selectedResultIndex = results.length - 1;
      this.updateResultSelection(results);
    }
  }

  /**
   * Update result selection styling and accessibility
   */
  private updateResultSelection(results: NodeListOf<Element> | Element[]): void {
    const resultsArray = Array.from(results);

    resultsArray.forEach((result, index) => {
      const isSelected = index === this.state.selectedResultIndex;
      const resultElement = result as HTMLElement;

      // Update visual selection
      resultElement.classList.toggle('selected', isSelected);
      resultElement.classList.toggle('ring-2', isSelected);
      resultElement.classList.toggle('ring-primary-500', isSelected);
      resultElement.classList.toggle('bg-primary-50', isSelected);
      resultElement.classList.toggle('dark:bg-primary-900/20', isSelected);

      // Update ARIA attributes
      resultElement.setAttribute('aria-selected', isSelected.toString());

      // Scroll into view if selected
      if (isSelected) {
        resultElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });

        // Focus management for screen readers
        const link = resultElement.querySelector('a') as HTMLAnchorElement;
        if (link) {
          link.focus({ preventScroll: true });
          this.announceToScreenReader(
            `Result ${index + 1} of ${resultsArray.length}: ${link.getAttribute('aria-label') || 'Article'}`
          );
        }
      }
    });

    // Update search input ARIA attributes
    if (this.elements.searchInput && resultsArray.length > 0) {
      const selectedId = this.state.selectedResultIndex >= 0
        ? `result-${this.state.selectedResultIndex}`
        : '';
      this.elements.searchInput.setAttribute('aria-activedescendant', selectedId);
      this.elements.searchInput.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Create accessible result element
   */
  private createResultElement(result: SearchResult, index: number): HTMLElement {
    const article = document.createElement('article');
    article.className = 'search-result p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary-500';
    article.setAttribute('role', 'article');
    article.setAttribute('aria-labelledby', `result-title-${index}`);
    article.setAttribute('aria-describedby', `result-excerpt-${index}`);

    const link = document.createElement('a');
    link.href = result.url;
    link.className = 'block group focus:outline-none';
    link.setAttribute('aria-describedby', `result-meta-${index}`);

    // Add Image on top if available
    if (result.heroImage) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'w-full h-48 mb-4 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]';
      const img = document.createElement('img');
      img.src = result.heroImage;
      img.alt = result.title;
      img.className = 'w-full h-full object-cover';
      imgContainer.appendChild(img);
      link.appendChild(imgContainer);
    }

    const contentContainer = document.createElement('div');
    contentContainer.className = 'space-y-3';
    link.appendChild(contentContainer);

    // Track click analytics
    link.addEventListener('click', () => {
      if (this.config.enableAnalytics) {
        this.trackClickEvent(result.id, this.state.currentQuery, index);
      }
    });

    const title = document.createElement('h3');
    title.id = `result-title-${index}`;
    title.className = 'text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200';
    title.innerHTML = result.highlightedTitle || result.title;

    const excerpt = document.createElement('p');
    excerpt.id = `result-excerpt-${index}`;
    excerpt.className = 'text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3';
    excerpt.innerHTML = result.highlightedExcerpt || result.excerpt || result.highlightedDescription || result.description;

    const meta = document.createElement('div');
    meta.id = `result-meta-${index}`;
    meta.className = 'flex flex-wrap items-center gap-3 pt-2';

    // Add language indicator
    const langTag = document.createElement('span');
    langTag.className = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800';
    langTag.textContent = result.lang;
    meta.appendChild(langTag);

    // Add matched fields indicator (optional, keep it small)
    if (result.matchedFields.length > 0 && result.matchedFields.includes('content')) {
      const matchedTag = document.createElement('span');
      matchedTag.className = 'text-[10px] text-gray-500 dark:text-gray-400 italic';
      matchedTag.textContent = 'Matched in content';
      meta.appendChild(matchedTag);
    }

    // Add tags
    if (result.tags.length > 0) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'flex flex-wrap gap-1.5';
      tagsContainer.setAttribute('aria-label', 'Article tags');

      result.tags.slice(0, 3).forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
        tagElement.textContent = `#${tag}`;
        tagsContainer.appendChild(tagElement);
      });

      meta.appendChild(tagsContainer);
    }

    contentContainer.appendChild(title);
    contentContainer.appendChild(excerpt);
    contentContainer.appendChild(meta);
    article.appendChild(link);

    return article;
  }

  /**
   * Create accessible suggestion element
   */
  private createSuggestionElement(suggestion: SearchSuggestion, index: number): HTMLElement {
    const li = document.createElement('li');
    li.className = 'suggestion-item px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150';
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');
    li.setAttribute('id', `suggestion-${index}`);

    const button = document.createElement('button');
    button.className = 'w-full text-left focus:outline-none';
    button.type = 'button';

    const text = document.createElement('div');
    text.className = 'font-medium text-gray-900 dark:text-gray-100';
    text.textContent = suggestion.text;

    const meta = document.createElement('div');
    meta.className = 'text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between';

    const type = document.createElement('span');
    type.className = 'capitalize';
    type.textContent = suggestion.type;

    if (suggestion.description) {
      const desc = document.createElement('span');
      desc.className = 'truncate ml-2';
      desc.textContent = suggestion.description;
      meta.appendChild(desc);
    }

    meta.insertBefore(type, meta.firstChild);

    button.appendChild(text);
    button.appendChild(meta);
    li.appendChild(button);

    // Event listeners
    button.addEventListener('click', () => this.selectSuggestion(suggestion.text));
    li.addEventListener('mouseenter', () => {
      this.state.selectedSuggestionIndex = index;
      this.updateSuggestionSelection();
    });

    return li;
  }

  /**
   * Setup event listeners with proper debouncing
   */
  private setupEventListeners(): void {
    if (!this.elements.searchInput) return;

    const searchInput = this.elements.searchInput;

    // Search input events
    searchInput.addEventListener('input', (event) => {
      const query = (event.target as HTMLInputElement).value;
      this.debouncedSearch(query);
      this.debouncedSuggestions(query);
      this.updateClearButtonVisibility(query);
    });

    searchInput.addEventListener('keydown', (event) => {
      this.handleKeyboardNavigation(event);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.length >= 2) {
        this.getSuggestions(searchInput.value);
      }
    });

    searchInput.addEventListener('blur', (event) => {
      // Delay hiding suggestions to allow click events
      setTimeout(() => {
        this.clearSuggestions();
      }, 150);
    });

    // Clear search functionality
    const clearButton = document.getElementById('search-clear-button');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearSearch();
      });
    }

    // Setup voice search if supported
    if (this.config.enableVoiceSearch) {
      this.setupVoiceSearch();
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
        this.announceToScreenReader('Search input focused');
      }
    });
  }

  /**
   * Debounced search function
   */
  private debouncedSearch = (query: string): void => {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      if (query.length >= this.config.minQueryLength!) {
        const results = await this.search(query);
        this.displayResults(results);
      } else {
        this.clearResults();
      }
    }, this.config.debounceMs);
  };

  /**
   * Debounced suggestions function
   */
  private debouncedSuggestions = (query: string): void => {
    if (this.suggestionDebounceTimer) {
      clearTimeout(this.suggestionDebounceTimer);
    }

    this.suggestionDebounceTimer = setTimeout(async () => {
      if (query.length >= 2) {
        await this.getSuggestions(query);
      } else {
        this.clearSuggestions();
      }
    }, 100); // Faster for suggestions
  };

  /**
   * Setup voice search functionality
   */
  private setupVoiceSearch(): void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = this.state.currentLang;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (this.elements.searchInput) {
        this.elements.searchInput.value = transcript;
        this.debouncedSearch(transcript);
        this.announceToScreenReader(`Voice search: ${transcript}`);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      this.announceToScreenReader('Voice search failed');
    };

    // Use existing voice search button from DOM
    const voiceButton = document.getElementById('voice-search-button');
    if (voiceButton) {
      voiceButton.classList.remove('hidden');
      voiceButton.addEventListener('click', () => {
        recognition.start();
        this.announceToScreenReader('Voice search started. Please speak now.');
      });
    }

  }

  /**
   * Setup accessibility features
   */
  private setupAccessibility(): void {
    // Create screen reader announcer
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    document.body.appendChild(this.announcer);
  }

  /**
   * Announce message to screen readers
   */
  private announceToScreenReader(message: string): void {
    this.announcer.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      this.announcer.textContent = '';
    }, 1000);
  }

  /**
   * Initialize DOM elements
   */
  private initializeElements(): void {
    this.elements.searchInput = document.getElementById(this.config.searchInputId) as HTMLInputElement;
    this.elements.resultsContainer = document.getElementById(this.config.resultsContainerId) || undefined;
    this.elements.suggestionsContainer = document.getElementById(this.config.suggestionsContainerId || 'search-suggestions') || undefined;
    this.elements.statusElement = document.getElementById(this.config.statusElementId || 'search-status') || undefined;
    this.elements.noResultsElement = document.getElementById(this.config.noResultsElementId || 'no-results') || undefined;

    // Setup suggestions container if it doesn't exist
    if (!this.elements.suggestionsContainer && this.elements.searchInput) {
      this.createSuggestionsContainer();
    }

    // Enhance search input with ARIA attributes
    if (this.elements.searchInput) {
      this.elements.searchInput.setAttribute('role', 'searchbox');
      this.elements.searchInput.setAttribute('aria-autocomplete', 'list');
      this.elements.searchInput.setAttribute('aria-expanded', 'false');
      if (this.elements.suggestionsContainer) {
        this.elements.searchInput.setAttribute('aria-owns', this.elements.suggestionsContainer.id);
      }
    }
  }

  /**
   * Create suggestions container
   */
  private createSuggestionsContainer(): void {
    if (!this.elements.searchInput) return;

    const container = document.createElement('ul');
    container.id = 'search-suggestions';
    container.className = 'absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-b-lg shadow-lg max-h-64 overflow-y-auto z-50 hidden';
    container.setAttribute('role', 'listbox');
    container.setAttribute('aria-label', 'Search suggestions');

    // Insert after search input
    const searchContainer = this.elements.searchInput.parentElement;
    if (searchContainer) {
      searchContainer.style.position = 'relative';
      searchContainer.appendChild(container);
      this.elements.suggestionsContainer = container;
    }
  }

  /**
   * Update suggestion selection
   */
  private updateSuggestionSelection(): void {
    if (!this.elements.suggestionsContainer) return;

    const suggestions = Array.from(this.elements.suggestionsContainer.children);

    suggestions.forEach((suggestion, index) => {
      const isSelected = index === this.state.selectedSuggestionIndex;
      suggestion.classList.toggle('bg-primary-50', isSelected);
      suggestion.classList.toggle('dark:bg-primary-900/20', isSelected);
      suggestion.setAttribute('aria-selected', isSelected.toString());
    });

    // Update ARIA attributes
    if (this.elements.searchInput) {
      const selectedId = this.state.selectedSuggestionIndex >= 0
        ? `suggestion-${this.state.selectedSuggestionIndex}`
        : '';
      this.elements.searchInput.setAttribute('aria-activedescendant', selectedId);
    }
  }

  /**
   * Select a suggestion
   */
  private selectSuggestion(text: string): void {
    if (!this.elements.searchInput) return;

    this.elements.searchInput.value = text;
    this.clearSuggestions();
    this.debouncedSearch(text);
    this.elements.searchInput.focus();
  }

  /**
   * Clear suggestions
   */
  private clearSuggestions(): void {
    if (this.elements.suggestionsContainer) {
      this.elements.suggestionsContainer.classList.add('hidden');
      this.elements.suggestionsContainer.innerHTML = '';
    }
    this.state.selectedSuggestionIndex = -1;

    if (this.elements.searchInput) {
      this.elements.searchInput.setAttribute('aria-expanded', 'false');
      this.elements.searchInput.removeAttribute('aria-activedescendant');
    }
  }

  /**
   * Clear search results
   */
  private clearResults(): void {
    if (this.elements.resultsContainer) {
      this.elements.resultsContainer.innerHTML = '';
    }
    this.hideNoResults();
    this.updateSearchStatus('', 0, 0);
  }

  /**
   * Clear entire search
   */
  private clearSearch(): void {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = '';
    }
    this.clearResults();
    this.clearSuggestions();
    this.state.currentQuery = '';
    this.updateClearButtonVisibility('');
    this.announceToScreenReader('Search cleared');
  }

  /**
   * Update clear button visibility
   */
  private updateClearButtonVisibility(query: string): void {
    const clearButton = document.getElementById('search-clear-button');
    if (clearButton) {
      if (query.length > 0) {
        clearButton.classList.remove('hidden');
      } else {
        clearButton.classList.add('hidden');
      }
    }
  }

  /**
   * Show no results state
   */
  private showNoResults(): void {
    if (this.elements.noResultsElement) {
      this.elements.noResultsElement.classList.remove('hidden');
    }
  }

  /**
   * Hide no results state
   */
  private hideNoResults(): void {
    if (this.elements.noResultsElement) {
      this.elements.noResultsElement.classList.add('hidden');
    }
  }

  /**
   * Update search status
   */
  private updateSearchStatus(query: string, count: number, time: number, error?: string): void {
    if (!this.elements.statusElement) return;

    if (error) {
      this.elements.statusElement.textContent = error;
      this.elements.statusElement.className = 'text-red-600 dark:text-red-400';
      return;
    }

    if (query && count > 0) {
      this.elements.statusElement.textContent = `Found ${count} results for "${query}" (${time.toFixed(1)}ms)`;
      this.elements.statusElement.className = 'text-gray-600 dark:text-gray-400';
    } else if (query && count === 0) {
      this.elements.statusElement.textContent = `No results found for "${query}"`;
      this.elements.statusElement.className = 'text-gray-600 dark:text-gray-400';
    } else {
      this.elements.statusElement.textContent = '';
    }
  }

  /**
   * Set loading state
   */
  private setLoadingState(loading: boolean, message: string = ''): void {
    this.state.isSearching = loading;

    if (this.elements.statusElement) {
      this.elements.statusElement.textContent = message;
      this.elements.statusElement.className = loading
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-gray-600 dark:text-gray-400';
    }

    if (this.elements.searchInput) {
      this.elements.searchInput.disabled = loading;
      if (loading) {
        this.elements.searchInput.setAttribute('aria-busy', 'true');
      } else {
        this.elements.searchInput.removeAttribute('aria-busy');
      }
    }
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('search')) {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }
  }

  /**
   * Track search event for analytics
   */
  private trackSearchEvent(query: string, resultCount: number, searchTime: number): void {
    // Custom analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        result_count: resultCount,
        search_time: searchTime,
        language: this.state.currentLang
      });
    }

    // Performance mark
    performance.mark(`search-${Date.now()}`);
  }

  /**
   * Track click event for analytics
   */
  private trackClickEvent(resultId: string, query: string, position: number): void {
    this.searchEngine.trackResultClick(query, resultId);

    if (typeof gtag !== 'undefined') {
      gtag('event', 'search_result_click', {
        search_term: query,
        result_id: resultId,
        result_position: position,
        language: this.state.currentLang
      });
    }
  }

  /**
   * Get search insights
   */
  getInsights() {
    return {
      ...this.searchEngine.getSearchInsights(),
      clientState: { ...this.state }
    };
  }

  /**
   * Optimize performance
   */
  optimizePerformance(): void {
    this.searchEngine.optimizePerformance();

    // Clear timers
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.suggestionDebounceTimer) {
      clearTimeout(this.suggestionDebounceTimer);
      this.suggestionDebounceTimer = null;
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.optimizePerformance();

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    if (this.currentAbortController) {
      this.currentAbortController.abort();
    }

    // Remove screen reader announcer
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer);
    }

    // Clean up event listeners
    Object.values(this.elements).forEach(element => {
      if (element) {
        element.removeEventListener('input', this.debouncedSearch as any);
        element.removeEventListener('keydown', this.handleKeyboardNavigation as any);
      }
    });
  }
}
