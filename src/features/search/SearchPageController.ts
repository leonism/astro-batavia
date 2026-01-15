import { EnhancedSearchClient } from './EnhancedSearchClient';
import { SORT_OPTIONS, DEFAULT_SORT, DOM_IDS, SEARCH_CONFIG } from './searchConstants';

interface FilterState {
  tags: string[];
  lang?: string;
}

interface SortState {
  sortBy: string;
  sortOrder: string;
}

export class SearchPageController {
  private client: EnhancedSearchClient;
  private currentFilters: FilterState;
  private currentSort: SortState;
  private sortSelect: HTMLSelectElement | null;
  private langSelect: HTMLSelectElement | null;
  private tagButtons: NodeListOf<HTMLButtonElement>;

  constructor() {
    this.client = new EnhancedSearchClient(SEARCH_CONFIG);
    this.currentFilters = { tags: [] };
    this.currentSort = { ...DEFAULT_SORT };
    
    // DOM Elements
    this.sortSelect = document.getElementById(DOM_IDS.sortSelect) as HTMLSelectElement;
    this.langSelect = document.getElementById(DOM_IDS.langSelect) as HTMLSelectElement;
    this.tagButtons = document.querySelectorAll(DOM_IDS.tagFilter);
  }

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

  private setupSortOptions(): void {
    if (!this.sortSelect) return;

    // Clear existing and populate with constant options
    this.sortSelect.innerHTML = SORT_OPTIONS.map(option => 
      `<option value="${option.value}">${option.label}</option>`
    ).join('');
    
    // Set default value
    this.sortSelect.value = `${this.currentSort.sortBy}-${this.currentSort.sortOrder}`;
  }

  private setupEventListeners(): void {
    // Tag Filters
    this.tagButtons.forEach(button => {
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

  private handleTagClick(clickedButton: HTMLButtonElement): void {
    // Update UI
    this.tagButtons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');

    // Update State
    const tag = clickedButton.dataset?.tag;
    this.currentFilters.tags = (tag === 'all' || !tag) ? [] : [tag];

    // Trigger Search
    this.handleSearchUpdate();
  }

  private updateTagUI(activeTag: string): void {
    const targetButton = document.querySelector(`${DOM_IDS.tagFilter}[data-tag="${activeTag}"]`);
    if (targetButton) {
      this.tagButtons.forEach(btn => btn.classList.remove('active'));
      targetButton.classList.add('active');
    }
  }

  private async handleSearchUpdate(): Promise<void> {
    const searchInput = document.getElementById(SEARCH_CONFIG.searchInputId) as HTMLInputElement;
    const query = searchInput ? searchInput.value : '';

    if (query) {
      // Get current language from select if available
      const selectedLang = this.langSelect?.value;
      
      await this.performSearch(query, selectedLang);
    }
  }

  private async performSearch(query: string, lang?: string): Promise<void> {
    const searchOptions = {
      ...this.currentFilters,
      ...this.currentSort,
      lang: lang !== 'all' ? lang : undefined
    };

    const results = await this.client.search(query, searchOptions);
    this.client.displayResults(results);
  }

  private handleError(error: unknown): void {
    console.error('Failed to initialize search:', error);
    const statusElement = document.getElementById(SEARCH_CONFIG.statusElementId);
    if (statusElement) {
      statusElement.textContent = 'Failed to load search index. Please try refreshing the page.';
      statusElement.className = 'text-red-600 dark:text-red-400';
    }
  }
}
