import { searchIntegration } from "./searchIntegration";
import type {
  SearchableDocument,
  SearchResult,
  SearchFilters,
} from "./EnterpriseSearchEngine";

interface SearchUIElements {
  searchInput: HTMLInputElement | null;
  searchButton: HTMLButtonElement | null;
  clearButton: HTMLButtonElement | null;
  voiceButton: HTMLButtonElement | null;
  suggestionsContainer: HTMLElement | null;
  filtersContainer: HTMLElement | null;
  resultsContainer: HTMLElement | null;
  statusElement: HTMLElement | null;
  loadingIndicator: HTMLElement | null;
  noResultsElement: HTMLElement | null;
  sortDropdown: HTMLElement | null;
  viewToggle: HTMLElement | null;
}

interface SearchState {
  query: string;
  filters: SearchFilters;
  sortBy: "relevance" | "date" | "title" | "popularity";
  sortOrder: "asc" | "desc";
  currentView: "grid" | "list";
  isLoading: boolean;
  hasSearched: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalResults: number;
}

class EnterpriseSearchClient {
  private elements: SearchUIElements;
  private state: SearchState;
  private debounceTimer: number | null = null;

  private popularSearches: string[] = [];
  private intersectionObserver: IntersectionObserver | null = null;
  private abortController: AbortController | null = null;

  constructor() {
    this.elements = this.initializeElements();
    this.state = this.initializeState();
    this.initializeEventListeners();
    this.loadSearchHistory();
    this.loadPopularSearches();
    this.initializeIntersectionObserver();
  }

  private initializeElements(): SearchUIElements {
    return {
      searchInput: document.getElementById(
        "enterprise-search-input"
      ) as HTMLInputElement,
      searchButton: null, // No search button in current design
      clearButton: document.getElementById(
        "clear-search-btn"
      ) as HTMLButtonElement,
      voiceButton: document.getElementById(
        "voice-search-btn"
      ) as HTMLButtonElement,
      suggestionsContainer: document.getElementById(
        "search-suggestions"
      ) as HTMLElement,
      filtersContainer: document.querySelector(
        ".bg-white.dark\\:bg-gray-800.rounded-lg.border"
      ) as HTMLElement,
      resultsContainer: document.getElementById(
        "results-container"
      ) as HTMLElement,
      statusElement: document.getElementById("search-status") as HTMLElement,
      loadingIndicator: document.getElementById(
        "search-loading"
      ) as HTMLElement,
      noResultsElement: document.getElementById("no-results") as HTMLElement,
      sortDropdown: document.getElementById(
        "sort-dropdown-menu"
      ) as HTMLElement,
      viewToggle: document.querySelector(".view-toggle") as HTMLElement,
    };
  }

  private initializeState(): SearchState {
    return {
      query: "",
      filters: {
        tags: [],
        dateFrom: undefined,
        dateTo: undefined,
        author: "",
        category: "",
      },
      sortBy: "relevance",
      sortOrder: "desc",
      currentView: "grid",
      isLoading: false,
      hasSearched: false,
      currentPage: 1,
      itemsPerPage: 12,
      totalResults: 0,
    };
  }

  private initializeEventListeners(): void {
    // Search input events
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener(
        "input",
        this.handleSearchInput.bind(this)
      );
      this.elements.searchInput.addEventListener(
        "focus",
        this.handleSearchFocus.bind(this)
      );
      this.elements.searchInput.addEventListener(
        "blur",
        this.handleSearchBlur.bind(this)
      );
      this.elements.searchInput.addEventListener(
        "keydown",
        this.handleSearchKeydown.bind(this)
      );
    }

    // Search button
    if (this.elements.searchButton) {
      this.elements.searchButton.addEventListener(
        "click",
        this.handleSearchSubmit.bind(this)
      );
    }

    // Clear button
    if (this.elements.clearButton) {
      this.elements.clearButton.addEventListener(
        "click",
        this.handleClearSearch.bind(this)
      );
    }

    // Voice search
    if (this.elements.voiceButton) {
      this.elements.voiceButton.addEventListener(
        "click",
        this.handleVoiceSearch.bind(this)
      );
    }

    // Sort dropdown
    if (this.elements.sortDropdown) {
      this.elements.sortDropdown.addEventListener(
        "click",
        this.handleSortChange.bind(this)
      );
    }

    // View toggle
    if (this.elements.viewToggle) {
      this.elements.viewToggle.addEventListener(
        "click",
        this.handleViewToggle.bind(this)
      );
    }

    // Filter events
    this.initializeFilterEvents();

    // Keyboard shortcuts
    document.addEventListener("keydown", this.handleGlobalKeydown.bind(this));

    // Window events
    window.addEventListener("beforeunload", this.saveSearchHistory.bind(this));
  }

  private initializeFilterEvents(): void {
    // Tag filters
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("tag-filter")) {
        this.handleTagFilter(target);
      }
    });

    // Date range filters
    const dateFilters = document.querySelectorAll(".date-filter");
    dateFilters.forEach((filter) => {
      filter.addEventListener("click", this.handleDateFilter.bind(this));
    });

    // Quick filters
    const quickFilters = document.querySelectorAll(".quick-filter");
    quickFilters.forEach((filter) => {
      filter.addEventListener("click", this.handleQuickFilter.bind(this));
    });
  }

  private initializeIntersectionObserver(): void {
    const infiniteScrollTrigger = document.getElementById(
      "infinite-scroll-trigger"
    );
    if (infiniteScrollTrigger) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              this.state.hasSearched &&
              !this.state.isLoading
            ) {
              this.loadMoreResults();
            }
          });
        },
        { threshold: 0.1 }
      );
      this.intersectionObserver.observe(infiniteScrollTrigger);
    }
  }

  private handleSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();

    // Clear previous debounce timer
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    // Update state
    this.state.query = query;

    // Show/hide clear button
    this.toggleClearButton(query.length > 0);

    // Debounced search
    this.debounceTimer = window.setTimeout(() => {
      if (query.length >= 2) {
        this.performSearch();
        this.showSuggestions(query);
      } else if (query.length === 0) {
        this.clearResults();
        this.showPopularSearches();
      } else {
        this.hideSuggestions();
      }
    }, 300);
  }

  private handleSearchFocus(): void {
    if (this.state.query.length >= 2) {
      this.showSuggestions(this.state.query);
    } else {
      this.showPopularSearches();
    }
  }

  private handleSearchBlur(): void {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      this.hideSuggestions();
    }, 200);
  }

  private handleSearchKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleSearchSubmit();
    } else if (event.key === "Escape") {
      this.handleClearSearch();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      this.handleSuggestionNavigation(event);
    }
  }

  private handleSearchSubmit(): void {
    if (this.state.query.trim()) {
      this.addToSearchHistory(this.state.query);
      this.performSearch();
      this.hideSuggestions();
    }
  }

  private handleClearSearch(): void {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = "";
      this.elements.searchInput.focus();
    }
    this.state.query = "";
    this.state.currentPage = 1;
    this.clearResults();
    this.clearFilters();
    this.toggleClearButton(false);
    this.showPopularSearches();
  }

  private handleVoiceSearch(): void {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = document.documentElement.lang || "en-US";

      recognition.onstart = () => {
        this.setVoiceSearchState(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (this.elements.searchInput) {
          this.elements.searchInput.value = transcript;
          this.state.query = transcript;
          this.performSearch();
        }
      };

      recognition.onerror = () => {
        this.setVoiceSearchState(false);
      };

      recognition.onend = () => {
        this.setVoiceSearchState(false);
      };

      recognition.start();
    }
  }

  private handleSortChange(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains("sort-option")) {
      const sortValue = target.dataset.sort;
      if (sortValue) {
        const [sortBy, sortOrder] = sortValue.split("-");
        this.state.sortBy = sortBy as any;
        this.state.sortOrder = (sortOrder || "desc") as "asc" | "desc";
        this.updateSortUI(target);
        this.performSearch();
      }
    }
  }

  private handleViewToggle(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest(".view-btn") as HTMLButtonElement;
    if (button) {
      const view = button.dataset.view as "grid" | "list";
      if (view && view !== this.state.currentView) {
        this.state.currentView = view;
        this.updateViewUI(view);
        this.updateResultsView(view);
      }
    }
  }

  private handleTagFilter(element: HTMLElement): void {
    const tag = element.dataset.tag;
    if (tag) {
      const isActive = element.classList.contains("active");
      if (isActive) {
        this.state.filters.tags = (this.state.filters.tags || []).filter(
          (t) => t !== tag
        );
        element.classList.remove("active");
      } else {
        if (!this.state.filters.tags) {
          this.state.filters.tags = [];
        }
        this.state.filters.tags.push(tag);
        element.classList.add("active");
      }
      this.performSearch();
    }
  }

  private handleDateFilter(event: Event): void {
    const target = event.target as HTMLElement;
    const range = target.dataset.range;

    if (range) {
      const now = new Date();
      let startDate: Date | null = null;

      switch (range) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case "all":
        default:
          startDate = null;
          break;
      }

      this.state.filters.dateFrom = startDate || undefined;
      this.state.filters.dateTo = range === "all" ? undefined : now;

      this.updateDateFilterUI(target);
      this.performSearch();
    }
  }

  private handleQuickFilter(event: Event): void {
    const target = event.target as HTMLElement;
    const filterType = target.dataset.filter;

    if (filterType === "popular") {
      this.state.sortBy = "popularity";
      this.state.sortOrder = "desc";
    } else if (filterType === "recent") {
      this.state.sortBy = "date";
      this.state.sortOrder = "desc";
    }

    this.updateQuickFilterUI(target);
    this.performSearch();
  }

  private handleGlobalKeydown(event: KeyboardEvent): void {
    // Cmd/Ctrl + K to focus search
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      this.elements.searchInput?.focus();
    }
  }

  private handleSuggestionNavigation(event: KeyboardEvent): void {
    const suggestions = document.querySelectorAll(".search-suggestion");
    if (suggestions.length === 0) return;

    const currentActive = document.querySelector(".search-suggestion.active");
    let nextIndex = 0;

    if (currentActive) {
      const currentIndex = Array.from(suggestions).indexOf(currentActive);
      if (event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % suggestions.length;
      } else {
        nextIndex =
          currentIndex === 0 ? suggestions.length - 1 : currentIndex - 1;
      }
      currentActive.classList.remove("active");
    }

    suggestions[nextIndex].classList.add("active");
    event.preventDefault();
  }

  private async performSearch(): Promise<void> {
    if (this.state.isLoading) {
      this.abortController?.abort();
    }

    this.abortController = new AbortController();
    this.state.isLoading = true;
    this.state.hasSearched = true;
    this.state.currentPage = 1;

    this.showLoading();
    this.hideSuggestions();

    try {
      const options = {
        limit: this.state.itemsPerPage,
        offset: (this.state.currentPage - 1) * this.state.itemsPerPage,
      };

      const searchResponse = await searchIntegration.search(
        this.state.query,
        this.state.filters,
        options
      );

      if (!this.abortController.signal.aborted) {
        this.displayResults(searchResponse.results);
        this.updateSearchStatus(
          searchResponse.results.length,
          searchResponse.totalCount
        );
        this.state.totalResults = searchResponse.totalCount;
      }
    } catch (error) {
      if (!this.abortController.signal.aborted) {
        console.error("Search error:", error);
        this.showError("An error occurred while searching. Please try again.");
      }
    } finally {
      if (!this.abortController.signal.aborted) {
        this.state.isLoading = false;
        this.hideLoading();
      }
    }
  }

  private async loadMoreResults(): Promise<void> {
    if (this.state.isLoading) return;

    this.state.currentPage++;
    this.state.isLoading = true;

    try {
      const options = {
        limit: this.state.itemsPerPage,
        offset: (this.state.currentPage - 1) * this.state.itemsPerPage,
      };

      const searchResponse = await searchIntegration.search(
        this.state.query,
        this.state.filters,
        options
      );
      this.appendResults(searchResponse.results);
    } catch (error) {
      console.error("Load more error:", error);
      this.state.currentPage--; // Revert page increment
    } finally {
      this.state.isLoading = false;
    }
  }

  private displayResults(results: SearchResult[]): void {
    if (!this.elements.resultsContainer) return;

    const gridContainer =
      this.elements.resultsContainer.querySelector("#grid-results");
    const listContainer =
      this.elements.resultsContainer.querySelector("#list-results");

    if (results.length === 0) {
      this.showNoResults();
      return;
    }

    this.hideNoResults();

    // Clear existing results
    if (gridContainer) gridContainer.innerHTML = "";
    if (listContainer) listContainer.innerHTML = "";

    // Render results
    results.forEach((result, index) => {
      const gridItem = this.createResultElement(result, "grid", index);
      const listItem = this.createResultElement(result, "list", index);

      if (gridContainer) gridContainer.appendChild(gridItem);
      if (listContainer) listContainer.appendChild(listItem);
    });

    // Animate results
    this.animateResults();
  }

  private appendResults(results: SearchResult[]): void {
    if (!this.elements.resultsContainer || results.length === 0) return;

    const gridContainer =
      this.elements.resultsContainer.querySelector("#grid-results");
    const listContainer =
      this.elements.resultsContainer.querySelector("#list-results");
    const currentCount = gridContainer?.children.length || 0;

    results.forEach((result, index) => {
      const gridItem = this.createResultElement(
        result,
        "grid",
        currentCount + index
      );
      const listItem = this.createResultElement(
        result,
        "list",
        currentCount + index
      );

      if (gridContainer) gridContainer.appendChild(gridItem);
      if (listContainer) listContainer.appendChild(listItem);
    });

    // Animate new results
    this.animateResults();
  }

  private createResultElement(
    result: SearchResult,
    view: "grid" | "list",
    index: number
  ): HTMLElement {
    const div = document.createElement("div");
    div.className = view === "grid" ? "post-item" : "post-item-list";
    div.style.transitionDelay = `${(index % 6) * 0.1}s`;

    // Add result data attributes
    div.dataset.score = result.relevanceScore.toString();
    div.dataset.title = result.title;
    div.dataset.url = result.url;

    // Create content based on view type
    if (view === "grid") {
      div.innerHTML = this.createGridResultHTML(result);
    } else {
      div.innerHTML = this.createListResultHTML(result);
    }

    return div;
  }

  private createGridResultHTML(result: SearchResult): string {
    return `
      <article class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300">
        ${
          (result as any).image
            ? `
          <div class="aspect-w-16 aspect-h-9">
            <img src="${(result as any).image}" alt="${
                result.title
              }" class="w-full h-48 object-cover" loading="lazy" />
          </div>
        `
            : ""
        }
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            <a href="${
              result.url
            }" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
              ${result.highlightedTitle || result.title}
            </a>
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            ${result.highlightedDescription || result.description}
          </p>
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <time datetime="${result.pubDate.toISOString()}">
              ${result.pubDate.toLocaleDateString()}
            </time>
            <div class="flex items-center space-x-2">
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-xs">
                ${Math.round(result.relevanceScore * 100)}% match
              </span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  private createListResultHTML(result: SearchResult): string {
    return `
      <article class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300">
        <div class="flex items-start space-x-4">
          ${
            (result as any).image
              ? `
            <div class="flex-shrink-0">
              <img src="${(result as any).image}" alt="${
                  result.title
                }" class="w-24 h-24 object-cover rounded-lg" loading="lazy" />
            </div>
          `
              : ""
          }
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              <a href="${
                result.url
              }" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                ${result.highlightedTitle || result.title}
              </a>
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              ${result.highlightedDescription || result.description}
            </p>
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-4">
                <time datetime="${result.pubDate.toISOString()}">
                  ${result.pubDate.toLocaleDateString()}
                </time>
                ${result.author ? `<span>by ${result.author}</span>` : ""}
              </div>
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-xs">
                ${Math.round(result.relevanceScore * 100)}% match
              </span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  private animateResults(): void {
    const items = document.querySelectorAll(
      ".post-item:not(.visible), .post-item-list:not(.visible)"
    );
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("visible");
      }, index * 50);
    });
  }

  private async showSuggestions(query: string): Promise<void> {
    if (!this.elements.suggestionsContainer) return;

    try {
      const suggestions = await searchIntegration.getSuggestions(query, 8);
      this.renderSuggestions(suggestions);
      this.elements.suggestionsContainer.classList.remove("hidden");
    } catch (error) {
      console.error("Suggestions error:", error);
    }
  }

  private showPopularSearches(): void {
    if (!this.elements.suggestionsContainer) return;

    this.renderSuggestions(this.popularSearches);
    this.elements.suggestionsContainer.classList.remove("hidden");
  }

  private renderSuggestions(suggestions: string[]): void {
    if (!this.elements.suggestionsContainer) return;

    const html = suggestions
      .map(
        (suggestion) => `
      <button class="search-suggestion flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" data-suggestion="${suggestion}">
        <div class="flex items-center space-x-3">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span class="text-gray-900 dark:text-gray-100">${suggestion}</span>
        </div>
      </button>
    `
      )
      .join("");

    this.elements.suggestionsContainer.innerHTML = html;

    // Add click handlers
    this.elements.suggestionsContainer
      .querySelectorAll(".search-suggestion")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          const suggestion = (event.currentTarget as HTMLElement).dataset
            .suggestion;
          if (suggestion && this.elements.searchInput) {
            this.elements.searchInput.value = suggestion;
            this.state.query = suggestion;
            this.performSearch();
            this.hideSuggestions();
          }
        });
      });
  }

  private hideSuggestions(): void {
    this.elements.suggestionsContainer?.classList.add("hidden");
  }

  private showLoading(): void {
    this.elements.loadingIndicator?.classList.remove("hidden");
    this.elements.loadingIndicator?.classList.add("flex");
  }

  private hideLoading(): void {
    this.elements.loadingIndicator?.classList.add("hidden");
    this.elements.loadingIndicator?.classList.remove("flex");
  }

  private showNoResults(): void {
    this.elements.noResultsElement?.classList.remove("hidden");
    this.elements.resultsContainer?.classList.add("hidden");
  }

  private hideNoResults(): void {
    this.elements.noResultsElement?.classList.add("hidden");
    this.elements.resultsContainer?.classList.remove("hidden");
  }

  private showError(message: string): void {
    // Create or update error element
    let errorElement = document.getElementById("search-error");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.id = "search-error";
      errorElement.className =
        "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-4";
      this.elements.resultsContainer?.parentNode?.insertBefore(
        errorElement,
        this.elements.resultsContainer
      );
    }
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }

  private clearResults(): void {
    const gridContainer = document.getElementById("grid-results");
    const listContainer = document.getElementById("list-results");

    if (gridContainer) gridContainer.innerHTML = "";
    if (listContainer) listContainer.innerHTML = "";

    this.hideNoResults();
    this.updateSearchStatus(0, 0);
    this.state.hasSearched = false;
    this.state.totalResults = 0;
  }

  private clearFilters(): void {
    this.state.filters = {
      tags: [],
      dateFrom: undefined,
      dateTo: undefined,
      author: "",
      category: "",
    };

    // Update UI
    document
      .querySelectorAll(".tag-filter.active")
      .forEach((el) => el.classList.remove("active"));
    document
      .querySelectorAll(".date-filter.active")
      .forEach((el) => el.classList.remove("active"));
    document
      .querySelectorAll(".quick-filter.active")
      .forEach((el) => el.classList.remove("active"));
  }

  private updateSearchStatus(displayed: number, total: number): void {
    if (!this.elements.statusElement) return;

    if (total === 0 && this.state.hasSearched) {
      this.elements.statusElement.textContent = "No articles found";
    } else if (total > 0) {
      this.elements.statusElement.textContent = `Showing ${displayed} of ${total} articles`;
    } else {
      this.elements.statusElement.textContent =
        "Enter a search term to find articles";
    }
  }

  private updateSortUI(activeElement: HTMLElement): void {
    // Update dropdown button text
    const currentSortText = document.getElementById("current-sort-text");
    if (currentSortText) {
      currentSortText.textContent =
        activeElement.textContent?.trim() || "Relevance";
    }

    // Update active state
    document
      .querySelectorAll(".sort-option svg")
      .forEach((svg) => svg.classList.add("hidden"));
    const svg = activeElement.querySelector("svg");
    if (svg) svg.classList.remove("hidden");
  }

  private updateViewUI(view: "grid" | "list"): void {
    document
      .querySelectorAll(".view-btn")
      .forEach((btn) => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`[data-view="${view}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  private updateResultsView(view: "grid" | "list"): void {
    if (!this.elements.resultsContainer) return;

    if (view === "list") {
      this.elements.resultsContainer.classList.add("list-view");
    } else {
      this.elements.resultsContainer.classList.remove("list-view");
    }
  }

  private updateDateFilterUI(activeElement: HTMLElement): void {
    document
      .querySelectorAll(".date-filter")
      .forEach((el) => el.classList.remove("active"));
    activeElement.classList.add("active");
  }

  private updateQuickFilterUI(activeElement: HTMLElement): void {
    document
      .querySelectorAll(".quick-filter")
      .forEach((el) => el.classList.remove("active"));
    activeElement.classList.add("active");
  }

  private toggleClearButton(show: boolean): void {
    if (this.elements.clearButton) {
      this.elements.clearButton.classList.toggle("hidden", !show);
    }
  }

  private setVoiceSearchState(active: boolean): void {
    if (this.elements.voiceButton) {
      this.elements.voiceButton.classList.toggle("recording", active);
      const icon = this.elements.voiceButton.querySelector("svg");
      if (icon) {
        icon.classList.toggle("animate-pulse", active);
      }
    }
  }

  private addToSearchHistory(_query: string): void {
    // History is now managed by searchIntegration automatically
  }

  private loadSearchHistory(): void {
    // History is now managed by searchIntegration automatically
  }

  private saveSearchHistory(): void {
    // History is now managed by searchIntegration
  }

  private loadPopularSearches(): void {
    this.popularSearches = searchIntegration.getPopularSearches();
  }

  // Public methods for external integration
  public async indexPosts(posts: SearchableDocument[]): Promise<void> {
    await searchIntegration.initialize(posts);
  }

  public async search(query: string): Promise<void> {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = query;
    }
    this.state.query = query;
    await this.performSearch();
  }

  public getSearchAnalytics() {
    return searchIntegration.getAnalytics();
  }

  public clearCache(): void {
    searchIntegration.clearCache();
  }

  public destroy(): void {
    // Clean up event listeners and observers
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.abortController) {
      this.abortController.abort();
    }
    this.saveSearchHistory();
  }
}

// Note: EnterpriseSearchClient should be manually initialized by the page
// that uses it, not auto-initialized here to avoid conflicts

export { EnterpriseSearchClient };
export type { SearchUIElements, SearchState };
