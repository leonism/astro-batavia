/**
 * Enterprise-grade Search Engine for Astro Batavia
 * Features: Instant search, fuzzy matching, search suggestions, analytics, caching
 */

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
  heroImage?: string;
}

export interface SearchResult extends SearchableDocument {
  relevanceScore: number;
  matchedFields: string[];
  highlightedTitle?: string;
  highlightedDescription?: string;
  excerpt?: string;
}

export interface SearchFilters {
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  author?: string;
  category?: string;
  sortBy?: "relevance" | "date" | "title" | "popularity";
  sortOrder?: "asc" | "desc";
}

export interface SearchOptions {
  fuzzyThreshold?: number;
  maxResults?: number;
  enableHighlighting?: boolean;
  enableSuggestions?: boolean;
  minQueryLength?: number;
}

export interface SearchSuggestion {
  text: string;
  type: "query" | "tag" | "title";
  score: number;
}

export interface SearchAnalytics {
  query: string;
  timestamp: Date;
  resultsCount: number;
  clickedResult?: string;
  filters?: SearchFilters;
}

class EnterpriseSearchEngine {
  private documents: SearchableDocument[] = [];
  private searchIndex: Map<string, Set<number>> = new Map();
  private tagIndex: Map<string, Set<number>> = new Map();
  private titleIndex: Map<string, Set<number>> = new Map();
  private cache: Map<string, SearchResult[]> = new Map();
  private analytics: SearchAnalytics[] = [];
  private stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
  ]);

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadAnalyticsFromStorage();
    }
  }

  /**
   * Index documents for fast searching
   */
  indexDocuments(documents: SearchableDocument[]): void {
    this.documents = documents.map(doc => {
      let pubDate: Date;
      if (doc.pubDate instanceof Date) {
        pubDate = doc.pubDate;
      } else {
        pubDate = new Date(doc.pubDate);
        if (isNaN(pubDate.getTime())) {
          pubDate = new Date(0); // Fallback for invalid dates
        }
      }
      return {
        ...doc,
        pubDate: pubDate,
      } as SearchableDocument;
    });
    this.buildSearchIndex();
    this.buildTagIndex();
    this.buildTitleIndex();
    this.cache.clear(); // Clear cache when reindexing
  }

  /**
   * Perform enterprise-grade search with fuzzy matching and relevance scoring
   */
  search(
    query: string,
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): SearchResult[] {
    const {
      fuzzyThreshold = 0.8,
      maxResults = 50,
      enableHighlighting = true,
      minQueryLength = 1,
    } = options;

    // Validate query
    if (!query || query.trim().length < minQueryLength) {
      return this.getFilteredDocuments(filters, maxResults);
    }

    const normalizedQuery = this.normalizeQuery(query);
    const cacheKey = this.getCacheKey(normalizedQuery, filters);

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      this.trackSearch(query, cached.length, filters);
      return cached.slice(0, maxResults);
    }

    // Perform search
    const results = this.performSearch(normalizedQuery, filters, {
      fuzzyThreshold,
      enableHighlighting,
      maxResults,
    });

    // Cache results
    this.cache.set(cacheKey, results);
    this.trackSearch(query, results.length, filters);

    return results;
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(partialQuery: string, limit: number = 5): SearchSuggestion[] {
    if (partialQuery.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];
    const queryLower = partialQuery.toLowerCase();

    // Title suggestions
    this.documents.forEach((doc) => {
      if (doc.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: doc.title,
          type: "title",
          score: this.calculateSuggestionScore(doc.title, queryLower),
        });
      }
    });

    // Tag suggestions
    this.tagIndex.forEach((_, tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: tag,
          type: "tag",
          score: this.calculateSuggestionScore(tag, queryLower),
        });
      }
    });

    // Query suggestions from analytics
    this.analytics.forEach((analytic) => {
      if (
        analytic.query.toLowerCase().includes(queryLower) &&
        analytic.resultsCount > 0
      ) {
        suggestions.push({
          text: analytic.query,
          type: "query",
          score:
            this.calculateSuggestionScore(analytic.query, queryLower) +
            analytic.resultsCount / 100,
        });
      }
    });

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(
        (suggestion, index, arr) =>
          arr.findIndex(
            (s) => s.text.toLowerCase() === suggestion.text.toLowerCase()
          ) === index
      );
  }

  /**
   * Get popular search terms
   */
  getPopularSearches(limit: number = 10): { query: string; count: number }[] {
    const queryCount = new Map<string, number>();

    this.analytics.forEach((analytic) => {
      if (analytic.resultsCount > 0) {
        queryCount.set(
          analytic.query,
          (queryCount.get(analytic.query) || 0) + 1
        );
      }
    });

    return Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get search analytics
   */
  getAnalytics(): SearchAnalytics[] {
    return [...this.analytics];
  }

  /**
   * Track result click for analytics
   */
  trackResultClick(query: string, resultId: string): void {
    const recentSearch = this.analytics
      .filter((a) => a.query === query)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    if (recentSearch) {
      recentSearch.clickedResult = resultId;
      this.saveAnalyticsToStorage();
    }
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  // Private methods

  private buildSearchIndex(): void {
    this.searchIndex.clear();

    this.documents.forEach((doc, index) => {
      const words = this.extractWords(
        `${doc.title} ${doc.description} ${doc.content || ""} ${doc.tags.join(
          " "
        )}`
      );

      words.forEach((word) => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(index);
      });
    });
  }

  private buildTagIndex(): void {
    this.tagIndex.clear();

    this.documents.forEach((doc, index) => {
      doc.tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();
        if (!this.tagIndex.has(normalizedTag)) {
          this.tagIndex.set(normalizedTag, new Set());
        }
        this.tagIndex.get(normalizedTag)!.add(index);
      });
    });
  }

  private buildTitleIndex(): void {
    this.titleIndex.clear();

    this.documents.forEach((doc, index) => {
      const words = this.extractWords(doc.title);
      words.forEach((word) => {
        if (!this.titleIndex.has(word)) {
          this.titleIndex.set(word, new Set());
        }
        this.titleIndex.get(word)!.add(index);
      });
    });
  }

  private performSearch(
    query: string,
    filters: SearchFilters,
    options: {
      fuzzyThreshold: number;
      enableHighlighting: boolean;
      maxResults: number;
    }
  ): SearchResult[] {
    const queryWords = this.extractWords(query);
    const candidateIndices = new Set<number>();
    const relevanceScores = new Map<number, number>();

    // Find candidate documents
    queryWords.forEach((word) => {
      // Exact matches
      if (this.searchIndex.has(word)) {
        this.searchIndex.get(word)!.forEach((index) => {
          candidateIndices.add(index);
          relevanceScores.set(index, (relevanceScores.get(index) || 0) + 2);
        });
      }

      // Fuzzy matches
      this.searchIndex.forEach((indices, indexedWord) => {
        const similarity = this.calculateSimilarity(word, indexedWord);
        if (similarity >= options.fuzzyThreshold) {
          indices.forEach((index) => {
            candidateIndices.add(index);
            relevanceScores.set(
              index,
              (relevanceScores.get(index) || 0) + similarity
            );
          });
        }
      });
    });

    // Convert to results and apply filters
    const results: SearchResult[] = [];

    candidateIndices.forEach((index) => {
      const doc = this.documents[index];
      if (this.matchesFilters(doc, filters)) {
        const result: SearchResult = {
          ...doc,
          relevanceScore: this.calculateRelevanceScore(
            doc,
            query,
            relevanceScores.get(index) || 0
          ),
          matchedFields: this.getMatchedFields(doc, query),
          excerpt: this.generateExcerpt(doc, query),
        };

        if (options.enableHighlighting) {
          result.highlightedTitle = this.highlightText(doc.title, query);
          result.highlightedDescription = this.highlightText(
            doc.description,
            query
          );
        }

        results.push(result);
      }
    });

    // Sort by relevance and apply sorting preferences
    return this.sortResults(
      results,
      filters.sortBy || "relevance",
      filters.sortOrder || "desc"
    ).slice(0, options.maxResults);
  }

  private getFilteredDocuments(
    filters: SearchFilters,
    maxResults: number
  ): SearchResult[] {
    return this.documents
      .filter((doc) => this.matchesFilters(doc, filters))
      .map((doc) => ({
        ...doc,
        relevanceScore: 0,
        matchedFields: [],
        excerpt:
          doc.description.substring(0, 150) +
          (doc.description.length > 150 ? "..." : ""),
      }))
      .sort((a, b) => {
        let dateA: Date;
        if (a.pubDate === null || a.pubDate === undefined) {
          dateA = new Date(0);
        } else if (a.pubDate instanceof Date) {
          dateA = a.pubDate;
        } else {
          dateA = new Date(a.pubDate);
        }

        let dateB: Date;
        if (b.pubDate === null || b.pubDate === undefined) {
          dateB = new Date(0);
        } else if (b.pubDate instanceof Date) {
          dateB = b.pubDate;
        } else {
          dateB = new Date(b.pubDate);
        }
        console.log("getFilteredDocuments sort: dateA", dateA, "typeof dateA", typeof dateA, "instanceof Date", dateA instanceof Date);
        console.log("getFilteredDocuments sort: dateB", dateB, "typeof dateB", typeof dateB, "instanceof Date", dateB instanceof Date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, maxResults);
  }

  private calculateRelevanceScore(
    doc: SearchableDocument,
    query: string,
    baseScore: number
  ): number {
    let score = baseScore;
    const queryLower = query.toLowerCase();

    // Title matches get higher score
    if (doc.title.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Tag matches
    doc.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 3;
      }
    });

    // Description matches
    if (doc.description.toLowerCase().includes(queryLower)) {
      score += 2;
    }

    // Boost recent content
    let effectivePubDate: Date;
    if (doc.pubDate === null || doc.pubDate === undefined) {
      effectivePubDate = new Date(0); // Default for null/undefined
    } else if (doc.pubDate instanceof Date) {
      effectivePubDate = doc.pubDate;
    } else {
      effectivePubDate = new Date(doc.pubDate);
    }

    const daysSincePublished =
      (Date.now() - effectivePubDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 30) {
      score += 1;
    }

    return score;
  }

  private getMatchedFields(doc: SearchableDocument, query: string): string[] {
    const fields: string[] = [];
    const queryLower = query.toLowerCase();

    if (doc.title.toLowerCase().includes(queryLower)) fields.push("title");
    if (doc.description.toLowerCase().includes(queryLower))
      fields.push("description");
    if (doc.tags.some((tag) => tag.toLowerCase().includes(queryLower)))
      fields.push("tags");
    if (doc.content && doc.content.toLowerCase().includes(queryLower))
      fields.push("content");

    return fields;
  }

  private generateExcerpt(doc: SearchableDocument, query: string): string {
    const queryLower = query.toLowerCase();
    const text = doc.content || doc.description;
    const index = text.toLowerCase().indexOf(queryLower);

    if (index === -1) {
      return (
        doc.description.substring(0, 150) +
        (doc.description.length > 150 ? "..." : "")
      );
    }

    const start = Math.max(0, index - 75);
    const end = Math.min(text.length, index + query.length + 75);
    const excerpt = text.substring(start, end);

    return (
      (start > 0 ? "..." : "") + excerpt + (end < text.length ? "..." : "")
    );
  }

  private highlightText(text: string, query: string): string {
    const queryWords = this.extractWords(query);
    let highlightedText = text;

    queryWords.forEach((word) => {
      const regex = new RegExp(`(${this.escapeRegex(word)})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="search-highlight">$1</mark>'
      );
    });

    return highlightedText;
  }

  private matchesFilters(
    doc: SearchableDocument,
    filters: SearchFilters
  ): boolean {
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some((tag) => doc.tags.includes(tag))) return false;
    }

    if (filters.dateFrom) {
      let docPubDate: Date;
      if (doc.pubDate === null || doc.pubDate === undefined) {
        docPubDate = new Date(0);
      } else if (doc.pubDate instanceof Date) {
        docPubDate = doc.pubDate;
      } else {
        docPubDate = new Date(doc.pubDate);
      }
      if (docPubDate < filters.dateFrom) return false;
    }
    if (filters.dateTo) {
      let docPubDate: Date;
      if (doc.pubDate === null || doc.pubDate === undefined) {
        docPubDate = new Date(0);
      } else if (doc.pubDate instanceof Date) {
        docPubDate = doc.pubDate;
      } else {
        docPubDate = new Date(doc.pubDate);
      }
      if (docPubDate > filters.dateTo) return false;
    }

    if (
      filters.author &&
      doc.author &&
      !doc.author.toLowerCase().includes(filters.author.toLowerCase())
    ) {
      return false;
    }

    if (filters.category && doc.category && doc.category !== filters.category) {
      return false;
    }

    return true;
  }

  private sortResults(
    results: SearchResult[],
    sortBy: string,
    sortOrder: string
  ): SearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          let dateA: Date;
          if (a.pubDate === null || a.pubDate === undefined) {
            dateA = new Date(0);
          } else if (a.pubDate instanceof Date) {
            dateA = a.pubDate;
          } else {
            dateA = new Date(a.pubDate);
          }

          let dateB: Date;
          if (b.pubDate === null || b.pubDate === undefined) {
            dateB = new Date(0);
          } else if (b.pubDate instanceof Date) {
            dateB = b.pubDate;
          } else {
            dateB = new Date(b.pubDate);
          }
          comparison = dateA.getTime() - dateB.getTime();
          break;
        case "popularity":
          // Could be based on view count, likes, etc.
          comparison = (b.readingTime || 0) - (a.readingTime || 0);
          break;
        case "relevance":
        default:
          comparison = b.relevanceScore - a.relevanceScore;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }

  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !this.stopWords.has(word));
  }

  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  private getCacheKey(query: string, filters: SearchFilters): string {
    return `${query}:${JSON.stringify(filters)}`;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private calculateSuggestionScore(suggestion: string, query: string): number {
    const similarity = this.calculateSimilarity(
      suggestion.toLowerCase(),
      query
    );
    const startsWithBonus = suggestion.toLowerCase().startsWith(query)
      ? 0.5
      : 0;
    const lengthPenalty = suggestion.length / 100; // Prefer shorter suggestions

    return similarity + startsWithBonus - lengthPenalty;
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private trackSearch(
    query: string,
    resultsCount: number,
    filters?: SearchFilters
  ): void {
    this.analytics.push({
      query,
      timestamp: new Date(),
      resultsCount,
      filters,
    });

    // Keep only last 1000 searches
    if (this.analytics.length > 1000) {
      this.analytics = this.analytics.slice(-1000);
    }

    this.saveAnalyticsToStorage();
  }

  private loadAnalyticsFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem("search-analytics");
      if (stored) {
        const parsed = JSON.parse(stored);
        this.analytics = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          filters: item.filters || {},
        }));
      }
    } catch (error) {
      console.warn("Failed to load search analytics from storage:", error);
    }
  }

  private saveAnalyticsToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem("search-analytics", JSON.stringify(this.analytics));
    } catch (error) {
      console.warn("Failed to save search analytics to storage:", error);
    }
  }
}

export default EnterpriseSearchEngine;
