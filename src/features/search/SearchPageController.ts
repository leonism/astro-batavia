import { EnhancedSearchClient } from './EnhancedSearchClient';
import { SORT_OPTIONS, DEFAULT_SORT, DOM_IDS, SEARCH_CONFIG } from './searchConstants';

/**
 * Interface representing the state of active search filters.
 */
interface FilterState {
  /** Array of selected tags for filtering. */
  tags: string[];
  /** Selected language code for filtering (optional). */
  lang?: string;
}

/**
 * Interface representing the state of search results sorting.
 */
interface SortState {
  /** The field to sort by (e.g., 'date', 'relevance'). */
  sortBy: string;
  /** The sort order ('asc' or 'desc'). */
  sortOrder: string;
}

/**
 * Controller for the Search Page.
 * Manages the initialization, event handling, and state coordination between the UI and the search client.
 */
export class SearchPageController {
  /** The client for interacting with the enhanced search engine. */
  private client: EnhancedSearchClient;
  /** Current state of active filters. */
  private currentFilters: FilterState;
  /** Current sorting configuration. */
  private currentSort: SortState;
  /** Reference to the sort selection dropdown element. */
  private sortSelect: HTMLSelectElement | null;
  /** Reference to the language selection dropdown element. */
  private langSelect: HTMLSelectElement | null;
  /** Collection of tag filter buttons. */
  private tagButtons: NodeListOf<HTMLButtonElement>;

  /**
   * Creates an instance of SearchPageController.
   * Initializes the search client, default state, and DOM element references.
   */
  constructor() {
    this.client = new EnhancedSearchClient(SEARCH_CONFIG);
    this.currentFilters = { tags: [] };
    this.currentSort = { ...DEFAULT_SORT };

    // DOM Elements
    this.sortSelect = document.getElementById(DOM_IDS.sortSelect) as HTMLSelectElement;
    this.langSelect = document.getElementById(DOM_IDS.langSelect) as HTMLSelectElement;
    this.tagButtons = document.querySelectorAll(DOM_IDS.tagFilter);
  }

  /**
   * Initializes the search page controller.
   * Sets up the client, sort options, event listeners, and handles the initial URL state.
   *
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   */
  public async init(): Promise<void> {
    console.log('Enhanced search page controller initializing...');

    try {
      await this.initializeClient();
      this.setupSortOptions();
      this.setupEventListeners();
      this.handleInitialState();

      // Expose for debugging
      (window as any).searchClient = this.client;
      (window as any).searchInsights = () => {
        console.log('Search Insights:', this.client.getInsights());
      };

      console.log('Enhanced search controller initialized successfully');
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Initializes the search client by fetching and indexing documents.
   *
   * @private
   * @returns {Promise<void>} A promise that resolves when the client is initialized.
   */
  private async initializeClient(): Promise<void> {
    console.log('Fetching search index...');
    const response = await fetch('/api/search-index');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const documents = await response.json();
    console.log(`Fetched ${documents.length} documents for indexing`);

    await this.client.initialize(documents);
  }

  /**
   * Populates the sort selection dropdown with available options.
   * Sets the initial value based on the current sort state.
   *
   * @private
   */
  private setupSortOptions(): void {
    if (!this.sortSelect) return;

    // Clear existing and populate with constant options
    this.sortSelect.innerHTML = SORT_OPTIONS.map(
      (option) => `<option value="${option.value}">${option.label}</option>`,
    ).join('');

    // Set default value
    this.sortSelect.value = `${this.currentSort.sortBy}-${this.currentSort.sortOrder}`;
  }

  /**
   * Sets up event listeners for UI interactions.
   * Handles tag clicks, language changes, sort changes, and window unload events.
   *
   * @private
   */
  private setupEventListeners(): void {
    // Tag Filters
    this.tagButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        this.handleTagClick(button);
      });
    });

    // Language Select
    if (this.langSelect) {
      // Ensure UI shows "All Languages" by default initially if not set
      if (!this.langSelect.value) this.langSelect.value = 'all';

      this.langSelect.addEventListener('change', () => {
        this.handleSearchUpdate();
      });
    }

    // Sort Select
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', () => {
        const value = this.sortSelect?.value;
        if (value) {
          const [sortBy, sortOrder] = value.split('-');
          this.currentSort = { sortBy, sortOrder };
          this.handleSearchUpdate();
        }
      });
    }

    // Performance optimization
    window.addEventListener('beforeunload', () => {
      this.client.optimizePerformance();
    });
  }

  /**
   * Handles the initial state of the page based on URL parameters.
   * Sets initial filters and performs a search if a query is present.
   *
   * @private
   * @returns {Promise<void>} A promise that resolves when the initial state is handled.
   */
  private async handleInitialState(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    const initialTag = urlParams.get('tag');

    // Set initial tag state
    if (initialTag) {
      this.currentFilters.tags = [initialTag];
      this.updateTagUI(initialTag);
    }

    // Perform initial search if query exists
    if (initialQuery) {
      const searchInput = document.getElementById(SEARCH_CONFIG.searchInputId) as HTMLInputElement;
      if (searchInput) {
        searchInput.value = initialQuery;
        await this.performSearch(initialQuery);
      }
    }
  }

  /**
   * Handles click events on tag filter buttons.
   * Updates the UI and triggers a search update.
   *
   * @private
   * @param {HTMLButtonElement} clickedButton - The button that was clicked.
   */
  private handleTagClick(clickedButton: HTMLButtonElement): void {
    // Update UI
    this.tagButtons.forEach((btn) => btn.classList.remove('active'));
    clickedButton.classList.add('active');

    // Update State
    const tag = clickedButton.dataset?.tag;
    this.currentFilters.tags = tag === 'all' || !tag ? [] : [tag];

    // Trigger Search
    this.handleSearchUpdate();
  }

  /**
   * Updates the UI to reflect the active tag filter.
   *
   * @private
   * @param {string} activeTag - The tag that is currently active.
   */
  private updateTagUI(activeTag: string): void {
    const targetButton = document.querySelector(`${DOM_IDS.tagFilter}[data-tag="${activeTag}"]`);
    if (targetButton) {
      this.tagButtons.forEach((btn) => btn.classList.remove('active'));
      targetButton.classList.add('active');
    }
  }

  /**
   * Orchestrates a search update based on current inputs and filters.
   * Retrieves the query and language, then executes the search.
   *
   * @private
   * @returns {Promise<void>} A promise that resolves when the search update is complete.
   */
  private async handleSearchUpdate(): Promise<void> {
    const searchInput = document.getElementById(SEARCH_CONFIG.searchInputId) as HTMLInputElement;
    const query = searchInput ? searchInput.value : '';

    if (query) {
      // Get current language from select if available
      const selectedLang = this.langSelect?.value;

      await this.performSearch(query, selectedLang);
    }
  }

  /**
   * Executes a search with the provided query and current configuration.
   * Displays the results via the client.
   *
   * @private
   * @param {string} query - The search query string.
   * @param {string} [lang] - The language code to filter by (optional).
   * @returns {Promise<void>} A promise that resolves when the search is performed and results are displayed.
   */
  private async performSearch(query: string, lang?: string): Promise<void> {
    const searchOptions = {
      ...this.currentFilters,
      ...this.currentSort,
      lang: lang !== 'all' ? lang : undefined,
    };

    const results = await this.client.search(query, searchOptions);
    this.client.displayResults(results);
  }

  /**
   * Handles errors during initialization or search operations.
   * Logs the error and displays a user-friendly message in the UI.
   *
   * @private
   * @param {unknown} error - The error that occurred.
   */
  private handleError(error: unknown): void {
    console.error('Failed to initialize search:', error);
    const statusElement = document.getElementById(SEARCH_CONFIG.statusElementId);
    if (statusElement) {
      statusElement.textContent = 'Failed to load search index. Please try refreshing the page.';
      statusElement.className = 'text-red-600 dark:text-red-400';
    }
  }
}
