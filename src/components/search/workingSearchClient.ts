import EnterpriseSearchEngine, { type SearchResult } from '../../features/search/EnterpriseSearchEngine';

interface CategoryInfo {
  name: string;
  count: number;
  color: string;
}

interface TagInfo {
  name: string;
  count: number;
  color: string;
}

interface AuthorInfo {
  name: string;
  count: number;
}

class WorkingSearchUI {
  private searchEngine: EnterpriseSearchEngine;
  private allDocuments: any[] = [];
  private currentQuery: string = '';

  // DOM Elements
  private searchOverlay!: HTMLElement;
  private searchInput!: HTMLInputElement;
  private searchResultsContainer!: HTMLElement;
  private searchSuggestions!: HTMLElement;
  private searchResultsSection!: HTMLElement;
  private noResultsSection!: HTMLElement;
  private searchPerformance!: HTMLElement;
  private searchTime!: HTMLElement;

  constructor() {
    this.searchEngine = new EnterpriseSearchEngine();
    this.initializeElements();
    this.setupEventListeners();
    this.loadSearchIndex();
  }

  private initializeElements(): void {
    this.searchOverlay = document.getElementById('search-overlay')!;
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.searchResultsContainer = document.getElementById('search-results-container')!;
    this.searchSuggestions = document.getElementById('search-suggestions')!;
    this.searchResultsSection = document.getElementById('search-results-section')!;
    this.noResultsSection = document.getElementById('no-results-section')!;
    this.searchPerformance = document.getElementById('search-performance')!;
    this.searchTime = document.getElementById('search-time')!;

    console.log('Search elements initialized:', {
      overlay: !!this.searchOverlay,
      input: !!this.searchInput,
      resultsContainer: !!this.searchResultsContainer,
      suggestions: !!this.searchSuggestions,
      resultsSection: !!this.searchResultsSection,
      noResults: !!this.noResultsSection
    });
  }

  private async loadSearchIndex(): Promise<void> {
    try {
      console.log('Loading search index...');
      const response = await fetch('/api/search-index');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.allDocuments = await response.json();
      this.searchEngine.indexDocuments(this.allDocuments);
      console.log(`Search engine initialized with ${this.allDocuments.length} documents.`);
      
      // Initialize suggestions
      this.initializeSuggestions();
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }

  private setupEventListeners(): void {
    // Search input
    this.searchInput.addEventListener('input', () => this.handleSearchInput());
    this.searchInput.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));

    // Overlay controls
    const openButton = document.getElementById('open-search-overlay');
    const closeButton = document.getElementById('close-search-overlay');
    
    openButton?.addEventListener('click', () => this.openSearchOverlay());
    closeButton?.addEventListener('click', () => this.closeSearchOverlay());

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));

    // Click outside to close
    this.searchOverlay.addEventListener('click', (e) => this.handleOverlayClick(e));
  }

  private handleSearchInput(): void {
    const query = this.searchInput.value.trim();
    this.currentQuery = query;
    this.performSearch(query);
  }

  private performSearch(query: string): void {
    const startTime = performance.now();

    if (query.length === 0) {
      this.showSuggestions();
      return;
    }

    if (query.length < 2) {
      this.showSuggestions();
      return;
    }

    // Simple search using basic filtering
    const results = this.allDocuments.filter(doc => 
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.description.toLowerCase().includes(query.toLowerCase()) ||
      doc.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())) ||
      (doc.content && doc.content.toLowerCase().includes(query.toLowerCase()))
    ).map(doc => ({
      ...doc,
      relevanceScore: this.calculateSimpleRelevance(doc, query),
      highlightedTitle: this.highlightText(doc.title, query),
      highlightedDescription: this.highlightText(doc.description, query)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);

    const endTime = performance.now();
    const searchTime = Math.round(endTime - startTime);

    this.displayResults(results, query, searchTime);
  }

  private calculateSimpleRelevance(doc: any, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Title matches get higher score
    if (doc.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Description matches
    if (doc.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Tag matches
    doc.tags.forEach((tag: string) => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 3;
      }
    });

    // Content matches (if available)
    if (doc.content && doc.content.toLowerCase().includes(queryLower)) {
      score += 2;
    }

    return score;
  }

  private highlightText(text: string, query: string): string {
    if (!query) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private displayResults(results: any[], query: string, searchTime: number): void {
    // Update performance indicator
    if (this.searchTime) {
      this.searchTime.textContent = `${searchTime}ms`;
      this.searchPerformance?.classList.remove('hidden');
    }

    if (results.length === 0) {
      this.showNoResults(query);
      return;
    }

    // Show results section
    this.searchSuggestions?.classList.add('hidden');
    this.noResultsSection?.classList.add('hidden');
    this.searchResultsSection?.classList.remove('hidden');

    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      resultsCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`;
    }

    // Display results
    this.searchResultsContainer.innerHTML = results.map((result, index) => 
      this.createResultCard(result, index)
    ).join('');

    // Add click handlers for results
    this.addResultClickHandlers(results);
  }

  private createResultCard(result: any, index: number): string {
    const tags = result.tags.slice(0, 3).map((tag: string) => 
      `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">${tag}</span>`
    ).join('');

    const author = result.author || 'Unknown Author';
    const pubDate = new Date(result.pubDate).toLocaleDateString();

    return `
      <div class="search-result-item p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 cursor-pointer" data-index="${index}" data-url="${result.url}">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              ${result.highlightedTitle || result.title}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
              ${result.highlightedDescription || result.description}
            </p>
            <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span class="flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                ${author}
              </span>
              <span class="flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                ${pubDate}
              </span>
            </div>
            <div class="flex flex-wrap gap-1">
              ${tags}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private addResultClickHandlers(results: any[]): void {
    this.searchResultsContainer.querySelectorAll('.search-result-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        if (url) {
          console.log('Navigating to:', url);
          window.location.href = url;
        }
      });
    });
  }

  private showNoResults(query: string): void {
    this.searchSuggestions?.classList.add('hidden');
    this.searchResultsSection?.classList.add('hidden');
    this.noResultsSection?.classList.remove('hidden');
  }

  private showSuggestions(): void {
    this.searchResultsSection?.classList.add('hidden');
    this.noResultsSection?.classList.add('hidden');
    this.searchSuggestions?.classList.remove('hidden');
    this.searchPerformance?.classList.add('hidden');
  }

  private initializeSuggestions(): void {
    const categories = this.extractCategories();
    const tags = this.extractTags();
    const authors = this.extractAuthors();

    // Populate categories
    const categoriesContainer = document.getElementById('categories-list');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = categories.map(cat => 
        `<button class="suggestion-item px-3 py-1 text-sm rounded-full transition-colors ${cat.color}" onclick="document.getElementById('search-input').value='${cat.name}'; document.getElementById('search-input').dispatchEvent(new Event('input'));">
          ${cat.name} (${cat.count})
        </button>`
      ).join('');
    }

    // Populate tags
    const tagsContainer = document.getElementById('tags-list');
    if (tagsContainer) {
      tagsContainer.innerHTML = tags.slice(0, 10).map(tag => 
        `<button class="suggestion-item px-3 py-1 text-sm rounded-full transition-colors ${tag.color}" onclick="document.getElementById('search-input').value='${tag.name}'; document.getElementById('search-input').dispatchEvent(new Event('input'));">
          # ${tag.name}
        </button>`
      ).join('');
    }

    // Populate authors
    const authorsContainer = document.getElementById('authors-list');
    if (authorsContainer) {
      authorsContainer.innerHTML = authors.map(author => 
        `<button class="suggestion-item px-3 py-1 text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors" onclick="document.getElementById('search-input').value='${author.name}'; document.getElementById('search-input').dispatchEvent(new Event('input'));">
          ${author.name}
        </button>`
      ).join('');
    }
  }

  private extractCategories(): CategoryInfo[] {
    const categoryMap = new Map<string, number>();
    this.allDocuments.forEach(doc => {
      if (doc.category) {
        categoryMap.set(doc.category, (categoryMap.get(doc.category) || 0) + 1);
      }
    });

    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800',
    ];

    return Array.from(categoryMap.entries()).map(([name, count], index) => ({
      name,
      count,
      color: colors[index % colors.length]
    }));
  }

  private extractTags(): TagInfo[] {
    const tagMap = new Map<string, number>();
    this.allDocuments.forEach(doc => {
      if (doc.tags) {
        doc.tags.forEach((tag: string) => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
      }
    });

    const colors = [
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-800',
      'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800',
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800',
    ];

    return Array.from(tagMap.entries())
      .sort(([,a], [,b]) => b - a)
      .map(([name, count], index) => ({
        name,
        count,
        color: colors[index % colors.length]
      }));
  }

  private extractAuthors(): AuthorInfo[] {
    const authorMap = new Map<string, number>();
    this.allDocuments.forEach(doc => {
      if (doc.author) {
        authorMap.set(doc.author, (authorMap.get(doc.author) || 0) + 1);
      }
    });

    return Array.from(authorMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
  }

  private handleKeyboardNavigation(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.closeSearchOverlay();
    }
  }

  private handleGlobalKeyboard(e: KeyboardEvent): void {
    // Ctrl+K or Cmd+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.openSearchOverlay();
    }
  }

  private handleOverlayClick(e: Event): void {
    const contentArea = this.searchOverlay.querySelector('.max-w-4xl');
    if (contentArea && !contentArea.contains(e.target as Node)) {
      this.closeSearchOverlay();
    }
  }

  public openSearchOverlay(): void {
    console.log('Opening search overlay');
    this.searchOverlay.classList.remove('hidden');
    this.searchOverlay.setAttribute('aria-hidden', 'false');
    this.searchInput.focus();
    document.body.style.overflow = 'hidden';
    
    if (this.currentQuery.length === 0) {
      this.showSuggestions();
    }
  }

  public closeSearchOverlay(): void {
    console.log('Closing search overlay');
    this.searchOverlay.classList.add('hidden');
    this.searchOverlay.setAttribute('aria-hidden', 'true');
    this.searchInput.value = '';
    this.currentQuery = '';
    document.body.style.overflow = '';
    
    // Clear results and show suggestions
    this.showSuggestions();
    this.searchResultsContainer.innerHTML = '';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing WorkingSearchUI');
  new WorkingSearchUI();
});

export default WorkingSearchUI;

