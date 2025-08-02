/**
 * Enterprise Search Integration
 * Connects all search components and provides a unified API
 */

import EnterpriseSearchEngine from './EnterpriseSearchEngine';
import type { SearchableDocument, SearchResult, SearchFilters, SearchSuggestion } from './EnterpriseSearchEngine';

export interface SearchIntegrationConfig {
  enableAnalytics?: boolean;
  enableCache?: boolean;
  enableVoiceSearch?: boolean;
  maxResults?: number;
  debounceMs?: number;
  fuzzyThreshold?: number;
}

export class SearchIntegration {
  private searchEngine: EnterpriseSearchEngine;
  private config: Required<SearchIntegrationConfig>;
  private isInitialized = false;
  constructor(config: SearchIntegrationConfig = {}) {
    this.config = {
      enableAnalytics: true,
      enableCache: true,
      enableVoiceSearch: true,
      maxResults: 50,
      debounceMs: 300,
      fuzzyThreshold: 0.6,
      ...config
    };

    this.searchEngine = new EnterpriseSearchEngine();
  }

  /**
   * Initialize the search integration with documents
   */
  async initialize(documents: SearchableDocument[]): Promise<void> {
    try {
      await this.searchEngine.indexDocuments(documents);
      this.isInitialized = true;
      console.log(`Search engine initialized with ${documents.length} documents`);
    } catch (error) {
      console.error('Failed to initialize search engine:', error);
      throw error;
    }
  }

  /**
   * Perform a search with enhanced features
   */
  async search(
    query: string,
    filters: SearchFilters = {},
    options: { limit?: number; offset?: number } = {}
  ): Promise<{
    results: SearchResult[];
    totalCount: number;
    searchTime: number;
    suggestions: string[];
  }> {
    if (!this.isInitialized) {
      throw new Error('Search engine not initialized. Call initialize() first.');
    }

    const startTime = performance.now();
    
    try {
      // Perform the search
      const results = this.searchEngine.search(query, filters, {
        maxResults: options.limit || this.config.maxResults,
        fuzzyThreshold: this.config.fuzzyThreshold
      });

      // Get search suggestions
      const suggestions = await this.searchEngine.getSuggestions(query, 5);
      const suggestionTexts = suggestions.map((s: SearchSuggestion) => s.text);

      const searchTime = performance.now() - startTime;

      return {
        results,
        totalCount: results.length,
        searchTime: Math.round(searchTime * 100) / 100,
        suggestions: suggestionTexts
      };
    } catch (error) {
      console.error('Search failed:', error);
      return {
        results: [],
        totalCount: 0,
        searchTime: 0,
        suggestions: []
      };
    }
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(partialQuery: string, limit = 8): Promise<string[]> {
    if (!this.isInitialized || !partialQuery.trim()) {
      return [];
    }

    try {
      const suggestions = this.searchEngine.getSuggestions(partialQuery, limit);
      return suggestions.map((s: SearchSuggestion) => s.text);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  /**
   * Track when a user clicks on a search result
   */
  trackResultClick(query: string, resultId: string): void {
    if (this.config.enableAnalytics) {
      this.searchEngine.trackResultClick(query, resultId);
    }
  }

  /**
   * Get search analytics data
   */
  getAnalytics(): any {
    if (!this.config.enableAnalytics) {
      return null;
    }
    return this.searchEngine.getAnalytics();
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.searchEngine.clearCache();
  }

  /**
   * Check if search engine is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get search engine configuration
   */
  getConfig(): Required<SearchIntegrationConfig> {
    return { ...this.config };
  }

  /**
   * Update search engine configuration
   */
  updateConfig(newConfig: Partial<SearchIntegrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const searchIntegration = new SearchIntegration();

// Export utility functions
export const searchUtils = {
  /**
   * Highlight search terms in text
   */
  highlightText(text: string, query: string): string {
    if (!query.trim()) return text;
    
    const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    let highlightedText = text;
    
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="search-highlight">$1</mark>');
    });
    
    return highlightedText;
  },

  /**
   * Truncate text with ellipsis
   */
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Format search time for display
   */
  formatSearchTime(timeMs: number): string {
    if (timeMs < 1) return '< 1ms';
    if (timeMs < 1000) return `${Math.round(timeMs)}ms`;
    return `${(timeMs / 1000).toFixed(2)}s`;
  },

  /**
   * Format result count for display
   */
  formatResultCount(count: number): string {
    if (count === 0) return 'No results';
    if (count === 1) return '1 result';
    if (count < 1000) return `${count} results`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K results`;
    return `${(count / 1000000).toFixed(1)}M results`;
  },

  /**
   * Debounce function for search input
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  /**
   * Check if browser supports voice search
   */
  supportsVoiceSearch(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  /**
   * Get readable file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};