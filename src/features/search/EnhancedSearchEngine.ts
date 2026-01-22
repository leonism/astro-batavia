/**
 * Enhanced Search Engine for Astro Batavia.
 * Features: Semantic search, instant results, accessibility, debouncing, caching.
 */

/**
 * Interface representing a document that can be indexed and searched.
 */
export interface SearchableDocument {
  /** Unique identifier for the document. */
  id: string;
  /** Title of the document. */
  title: string;
  /** Description or summary of the document. */
  description: string;
  /** Full content of the document (optional). */
  content?: string;
  /** Array of tags associated with the document. */
  tags: string[];
  /** URL to the document. */
  url: string;
  /** Publication date of the document. */
  pubDate: Date | string | number;
  /** Author of the document (optional). */
  author?: string;
  /** Category of the document (optional). */
  category?: string;
  /** Language code of the document. */
  lang: string;
  /** URL slug of the document. */
  slug: string;
  /** Estimated reading time in minutes (optional). */
  readingTime?: number;
  /** URL to the hero image (optional). */
  heroImage?: string;
}

/**
 * Interface representing a search result with relevance scores and highlights.
 * Extends SearchableDocument.
 */
export interface SearchResult extends SearchableDocument {
  /** Overall relevance score for the search query. */
  relevanceScore: number;
  /** List of fields that matched the search query. */
  matchedFields: string[];
  /** Title with search terms highlighted (optional). */
  highlightedTitle?: string;
  /** Description with search terms highlighted (optional). */
  highlightedDescription?: string;
  /** Content with search terms highlighted (optional). */
  highlightedContent?: string;
  /** Excerpt with search terms highlighted (optional). */
  highlightedExcerpt?: string;
  /** Generated excerpt relevant to the search query (optional). */
  excerpt?: string;
  /** Score based on semantic relevance (optional). */
  semanticScore?: number;
  /** Score based on contextual relevance (optional). */
  contextualRelevance?: number;
}

/**
 * Interface for filtering search results.
 */
export interface SearchFilters {
  /** Filter by tags. */
  tags?: string[];
  /** Filter by publication date (start). */
  dateFrom?: Date;
  /** Filter by publication date (end). */
  dateTo?: Date;
  /** Filter by author. */
  author?: string;
  /** Filter by category. */
  category?: string;
  /** Filter by language. */
  lang?: string;
  /** Sort criteria. */
  sortBy?: 'relevance' | 'date' | 'title' | 'semantic' | 'hybrid';
  /** Sort order. */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interface for configuring search options.
 */
export interface SearchOptions {
  /** Threshold for fuzzy matching (0.0 to 1.0). */
  fuzzyThreshold?: number;
  /** Maximum number of results to return. */
  maxResults?: number;
  /** Whether to enable term highlighting. */
  enableHighlighting?: boolean;
  /** Whether to enable search suggestions. */
  enableSuggestions?: boolean;
  /** Minimum query length to trigger search. */
  minQueryLength?: number;
  /** Boost factor for semantic matches. */
  semanticBoost?: number;
  /** Boost factor for contextual matches. */
  contextualBoost?: number;
  /** Whether to enable typo tolerance. */
  typoTolerance?: boolean;
  /** Whether to enable phrase matching. */
  phraseMatching?: boolean;
}

/**
 * Interface representing a search suggestion.
 */
export interface SearchSuggestion {
  /** The suggested text. */
  text: string;
  /** The type of suggestion. */
  type: 'query' | 'tag' | 'title' | 'semantic' | 'completion';
  /** The relevance score of the suggestion. */
  score: number;
  /** Description of the suggestion (optional). */
  description?: string;
  /** Category of the suggestion (optional). */
  category?: string;
}

/**
 * Interface representing a semantic cluster of related terms.
 */
interface SemanticCluster {
  /** List of related terms in the cluster. */
  terms: string[];
  /** Weight of the cluster for relevance calculation. */
  weight: number;
  /** Category name of the cluster. */
  category: string;
}

/**
 * Enhanced Search Engine class providing advanced search capabilities.
 * Includes semantic search, caching, and performance optimization.
 */
class EnhancedSearchEngine {
  private documents: SearchableDocument[] = [];
  private searchIndex: Map<string, Set<number>> = new Map();
  private tagIndex: Map<string, Set<number>> = new Map();
  private titleIndex: Map<string, Set<number>> = new Map();
  private semanticIndex: Map<string, Set<number>> = new Map();
  private cache: Map<string, SearchResult[]> = new Map();
  private suggestionCache: Map<string, SearchSuggestion[]> = new Map();

  // Enhanced indexes for better performance
  private ngramIndex: Map<string, Set<number>> = new Map();
  private phraseIndex: Map<string, Set<number>> = new Map();
  private synonymIndex: Map<string, string[]> = new Map();

  // Semantic clusters for better understanding
  private semanticClusters: SemanticCluster[] = [
    {
      terms: [
        'ai',
        'artificial intelligence',
        'machine learning',
        'ml',
        'deep learning',
        'neural network',
        'genai',
        'llm',
      ],
      weight: 1.2,
      category: 'technology',
    },
    {
      terms: [
        'web',
        'frontend',
        'backend',
        'fullstack',
        'javascript',
        'typescript',
        'react',
        'vue',
        'angular',
        'nextjs',
        'astro',
      ],
      weight: 1.1,
      category: 'development',
    },
    {
      terms: [
        'blockchain',
        'cryptocurrency',
        'bitcoin',
        'ethereum',
        'defi',
        'smart contract',
        'web3',
      ],
      weight: 1.1,
      category: 'blockchain',
    },
    {
      terms: [
        'cloud',
        'aws',
        'azure',
        'gcp',
        'serverless',
        'microservices',
        'kubernetes',
        'docker',
        'devops',
      ],
      weight: 1.1,
      category: 'cloud',
    },
    {
      terms: [
        'mobile',
        'ios',
        'android',
        'app development',
        'native',
        'react native',
        'flutter',
        'kotlin',
        'swift',
      ],
      weight: 1.0,
      category: 'mobile',
    },
    {
      terms: [
        'security',
        'cybersecurity',
        'encryption',
        'vulnerability',
        'penetration testing',
        'security audit',
        'auth',
      ],
      weight: 1.2,
      category: 'security',
    },
    {
      terms: ['vr', 'ar', 'xr', 'virtual reality', 'augmented reality', 'metaverse', 'immersive'],
      weight: 1.1,
      category: 'immersive',
    },
  ];

  private stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'can',
    'must',
    'shall',
    'ought',
    'it',
    'if',
    'as',
    'my',
    'me',
    'so',
    'up',
    'out',
    'no',
    'not',
    'how',
    'why',
    'what',
    'who',
    'when',
    'where',
  ]);

  // Performance tracking
  private performanceMetrics = {
    searchCount: 0,
    avgSearchTime: 0,
    cacheHitRate: 0,
    popularQueries: new Map<string, number>(),
  };

  // Analytics tracking
  private analytics = {
    totalSearches: 0,
    totalClicks: 0,
    totalSearchTime: 0,
    cacheHits: 0,
    queryFrequency: new Map<string, number>(),
    clickTracking: new Map<string, number>(),
  };

  // Search cache separate from main cache
  private searchCache: Map<string, SearchResult[]> = new Map();

  /**
   * Creates an instance of EnhancedSearchEngine.
   * Initializes synonyms and sets up keyboard shortcuts if in a browser environment.
   */
  constructor() {
    this.initializeSynonyms();
    if (typeof window !== 'undefined') {
      this.setupKeyboardShortcuts();
    }
  }

  /**
   * Index documents with enhanced semantic analysis.
   * Builds multiple indexes in parallel for optimized search performance.
   *
   * @param {SearchableDocument[]} documents - The list of documents to index.
   * @returns {Promise<void>} A promise that resolves when indexing is complete.
   */
  async indexDocuments(documents: SearchableDocument[]): Promise<void> {
    const startTime = performance.now();

    this.documents = documents.map((doc) => ({
      ...doc,
      pubDate: this.normalizePubDate(doc.pubDate),
    }));

    // Clear existing indexes
    this.clearIndexes();

    // Build multiple indexes in parallel for better performance
    await Promise.all([
      this.buildSearchIndex(),
      this.buildTagIndex(),
      this.buildTitleIndex(),
      this.buildSemanticIndex(),
      this.buildNgramIndex(),
      this.buildPhraseIndex(),
    ]);

    console.log(`Indexing completed in ${performance.now() - startTime}ms`);
  }

  /**
   * Enhanced search with semantic understanding and typo tolerance.
   *
   * @param {string} query - The search query.
   * @param {SearchFilters} filters - Optional filters to apply.
   * @param {SearchOptions} options - Optional search configuration.
   * @returns {SearchResult[]} An array of search results sorted by relevance.
   */
  search(query: string, filters: SearchFilters = {}, options: SearchOptions = {}): SearchResult[] {
    const startTime = performance.now();

    const {
      fuzzyThreshold = 0.7,
      maxResults = 50,
      enableHighlighting = true,
      minQueryLength = 1,
      semanticBoost = 1.2,
      contextualBoost = 1.1,
      typoTolerance = true,
      phraseMatching = true,
    } = options;

    // Validate and normalize query
    const normalizedQuery = this.normalizeQuery(query);
    if (!normalizedQuery || normalizedQuery.length < minQueryLength) {
      return this.getFilteredDocuments(filters, maxResults);
    }

    // Check cache first
    const cacheKey = this.getCacheKey(normalizedQuery, filters, options);
    if (this.cache.has(cacheKey)) {
      this.updatePerformanceMetrics(normalizedQuery, performance.now() - startTime, true);
      return this.cache.get(cacheKey)!.slice(0, maxResults);
    }

    // Perform enhanced search
    const results = this.performEnhancedSearch(normalizedQuery, filters, {
      fuzzyThreshold,
      enableHighlighting,
      maxResults,
      semanticBoost,
      contextualBoost,
      typoTolerance,
      phraseMatching,
    });

    // Cache results
    this.cache.set(cacheKey, results);
    this.updatePerformanceMetrics(normalizedQuery, performance.now() - startTime, false);

    return results;
  }

  /**
   * Get intelligent search suggestions with context awareness.
   *
   * @param {string} partialQuery - The partial search query.
   * @param {number} limit - The maximum number of suggestions to return (default: 8).
   * @returns {SearchSuggestion[]} An array of search suggestions.
   */
  getSuggestions(partialQuery: string, limit: number = 8): SearchSuggestion[] {
    if (partialQuery.length < 2) return [];

    const cacheKey = `suggestions_${partialQuery}_${limit}`;
    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey)!;
    }

    const suggestions: SearchSuggestion[] = [];
    const queryLower = partialQuery.toLowerCase();

    // 1. Query completions based on popular searches
    this.performanceMetrics.popularQueries.forEach((count, query) => {
      if (query.toLowerCase().startsWith(queryLower) && query !== partialQuery) {
        suggestions.push({
          text: query,
          type: 'completion',
          score: count + (query.toLowerCase() === queryLower ? 10 : 0),
          description: `${count} searches`,
        });
      }
    });

    // 2. Title suggestions with semantic relevance
    this.documents.forEach((doc) => {
      const titleLower = doc.title.toLowerCase();
      if (titleLower.includes(queryLower)) {
        const semanticScore = this.calculateSemanticRelevance(partialQuery, doc.title);
        suggestions.push({
          text: doc.title,
          type: 'title',
          score: this.calculateSuggestionScore(doc.title, queryLower) + semanticScore,
          description: doc.description.substring(0, 80) + '...',
          category: doc.category,
        });
      }
    });

    // 3. Tag suggestions with clustering
    const tagSuggestions = new Map<string, number>();
    this.tagIndex.forEach((docIndices, tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        tagSuggestions.set(tag, docIndices.size);
      }
    });

    tagSuggestions.forEach((count, tag) => {
      suggestions.push({
        text: tag,
        type: 'tag',
        score: this.calculateSuggestionScore(tag, queryLower) + count / 10,
        description: `${count} articles`,
        category: 'tag',
      });
    });

    // 4. Semantic suggestions
    this.semanticClusters.forEach((cluster) => {
      cluster.terms.forEach((term) => {
        if (term.includes(queryLower) && term !== partialQuery) {
          suggestions.push({
            text: term,
            type: 'semantic',
            score: this.calculateSuggestionScore(term, queryLower) * cluster.weight,
            description: `Related to ${cluster.category}`,
            category: cluster.category,
          });
        }
      });
    });

    const finalSuggestions = suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(
        (suggestion, index, arr) =>
          arr.findIndex((s) => s.text.toLowerCase() === suggestion.text.toLowerCase()) === index,
      );

    this.suggestionCache.set(cacheKey, finalSuggestions);
    return finalSuggestions;
  }

  /**
   * Get popular search terms.
   *
   * @param {number} limit - The maximum number of popular terms to return (default: 10).
   * @returns {{ query: string; count: number }[]} An array of popular search terms and their counts.
   */
  getPopularSearches(limit: number = 10): { query: string; count: number }[] {
    return Array.from(this.performanceMetrics.popularQueries.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get search insights and analytics.
   *
   * @returns {object} An object containing search metrics and analytics.
   */
  getSearchInsights() {
    return {
      ...this.performanceMetrics,
      totalDocuments: this.documents.length,
      indexSize: this.searchIndex.size,
      cacheSize: this.cache.size,
      topQueries: Array.from(this.performanceMetrics.popularQueries.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([query, count]) => ({ query, count })),
    };
  }

  // Private methods

  /**
   * Performs the core search logic using various matching strategies.
   *
   * @param {string} query - The search query.
   * @param {SearchFilters} filters - Filters to apply.
   * @param {object} options - Search options.
   * @returns {SearchResult[]} The list of matching results.
   */
  private performEnhancedSearch(
    query: string,
    filters: SearchFilters,
    options: {
      fuzzyThreshold: number;
      enableHighlighting: boolean;
      maxResults: number;
      semanticBoost: number;
      contextualBoost: number;
      typoTolerance: boolean;
      phraseMatching: boolean;
    },
  ): SearchResult[] {
    const queryWords = this.extractWords(query);
    const candidateScores = new Map<number, number>();

    // 1. Exact word matches
    queryWords.forEach((word) => {
      if (this.searchIndex.has(word)) {
        this.searchIndex.get(word)!.forEach((index) => {
          candidateScores.set(index, (candidateScores.get(index) || 0) + 3);
        });
      }
    });

    // 2. Fuzzy matches with typo tolerance
    if (options.typoTolerance) {
      this.addFuzzyMatches(queryWords, candidateScores, options.fuzzyThreshold);
    }

    // 3. Phrase matching
    if (options.phraseMatching && queryWords.length > 1) {
      this.addPhraseMatches(query, candidateScores);
    }

    // 4. Semantic matches
    this.addSemanticMatches(query, candidateScores, options.semanticBoost);

    // 5. N-gram matches for partial word matching
    this.addNgramMatches(query, candidateScores);

    // Convert to results and apply filters
    const results: SearchResult[] = [];

    candidateScores.forEach((baseScore, index) => {
      const doc = this.documents[index];
      if (this.matchesFilters(doc, filters)) {
        const relevanceScore = this.calculateEnhancedRelevance(doc, query, baseScore, options);
        const semanticScore = this.calculateSemanticRelevance(
          query,
          doc.title + ' ' + doc.description,
        );

        const result: SearchResult = {
          ...doc,
          relevanceScore,
          semanticScore,
          contextualRelevance: this.calculateContextualRelevance(doc, query),
          matchedFields: this.getMatchedFields(doc, query),
          excerpt: this.generateSmartExcerpt(doc, query),
        };

        if (options.enableHighlighting) {
          result.highlightedTitle = this.highlightText(doc.title, query);
          result.highlightedDescription = this.highlightText(doc.description, query);
          if (result.excerpt) {
            result.highlightedExcerpt = this.highlightText(result.excerpt, query);
          }
          if (doc.content) {
            result.highlightedContent = this.highlightText(doc.content.substring(0, 300), query);
          }
        }

        results.push(result);
      }
    });

    return this.sortResultsIntelligently(
      results,
      filters.sortBy || 'relevance',
      filters.sortOrder || 'desc',
    );
  }

  /**
   * Adds fuzzy matches to candidate scores.
   *
   * @param {string[]} queryWords - The words in the query.
   * @param {Map<number, number>} candidateScores - The map of candidate scores to update.
   * @param {number} threshold - The fuzzy matching threshold.
   */
  private addFuzzyMatches(
    queryWords: string[],
    candidateScores: Map<number, number>,
    threshold: number,
  ): void {
    queryWords.forEach((word) => {
      this.searchIndex.forEach((indices, indexedWord) => {
        const similarity = this.calculateSimilarity(word, indexedWord);
        if (similarity >= threshold && similarity < 1.0) {
          indices.forEach((index) => {
            candidateScores.set(index, (candidateScores.get(index) || 0) + similarity * 2);
          });
        }
      });
    });
  }

  /**
   * Adds phrase matches to candidate scores.
   *
   * @param {string} query - The full search query.
   * @param {Map<number, number>} candidateScores - The map of candidate scores to update.
   */
  private addPhraseMatches(query: string, candidateScores: Map<number, number>): void {
    if (this.phraseIndex.has(query)) {
      this.phraseIndex.get(query)!.forEach((index) => {
        candidateScores.set(index, (candidateScores.get(index) || 0) + 5);
      });
    }
  }

  /**
   * Adds semantic matches to candidate scores based on clusters.
   *
   * @param {string} query - The search query.
   * @param {Map<number, number>} candidateScores - The map of candidate scores to update.
   * @param {number} boost - The boost factor for semantic matches.
   */
  private addSemanticMatches(
    query: string,
    candidateScores: Map<number, number>,
    boost: number,
  ): void {
    this.semanticClusters.forEach((cluster) => {
      if (cluster.terms.some((term) => query.toLowerCase().includes(term))) {
        cluster.terms.forEach((term) => {
          if (this.semanticIndex.has(term)) {
            this.semanticIndex.get(term)!.forEach((index) => {
              candidateScores.set(
                index,
                (candidateScores.get(index) || 0) + boost * cluster.weight,
              );
            });
          }
        });
      }
    });
  }

  /**
   * Adds n-gram matches to candidate scores.
   *
   * @param {string} query - The search query.
   * @param {Map<number, number>} candidateScores - The map of candidate scores to update.
   */
  private addNgramMatches(query: string, candidateScores: Map<number, number>): void {
    const ngrams = this.generateNgrams(query, 3);
    ngrams.forEach((ngram) => {
      if (this.ngramIndex.has(ngram)) {
        this.ngramIndex.get(ngram)!.forEach((index) => {
          candidateScores.set(index, (candidateScores.get(index) || 0) + 0.5);
        });
      }
    });
  }

  /**
   * Calculates the enhanced relevance score for a document.
   *
   * @param {SearchableDocument} doc - The document to score.
   * @param {string} query - The search query.
   * @param {number} baseScore - The base match score.
   * @param {any} options - Search options.
   * @returns {number} The calculated relevance score.
   */
  private calculateEnhancedRelevance(
    doc: SearchableDocument,
    query: string,
    baseScore: number,
    options: any,
  ): number {
    let score = baseScore;
    const queryLower = query.toLowerCase();

    // Title boost (highest priority)
    if (doc.title.toLowerCase().includes(queryLower)) {
      score += 8;
      // Extra boost for title starting with query
      if (doc.title.toLowerCase().startsWith(queryLower)) {
        score += 4;
      }
    }

    // Tag matching
    doc.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 6;
        if (tag.toLowerCase() === queryLower) {
          score += 3; // Exact tag match
        }
      }
    });

    // Description relevance
    if (doc.description.toLowerCase().includes(queryLower)) {
      score += 4;
    }

    // Recency boost
    const daysSincePublished =
      (Date.now() - new Date(doc.pubDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 30) {
      score += 2;
    } else if (daysSincePublished < 90) {
      score += 1;
    }

    // Reading time penalty for very long articles
    if (doc.readingTime && doc.readingTime > 20) {
      score -= 0.5;
    }

    return score;
  }

  /**
   * Calculates semantic relevance score between query and text.
   *
   * @param {string} query - The search query.
   * @param {string} text - The text to compare against.
   * @returns {number} The semantic relevance score.
   */
  private calculateSemanticRelevance(query: string, text: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    this.semanticClusters.forEach((cluster) => {
      const queryMatchesCluster = cluster.terms.some(
        (term) => queryLower.includes(term) || this.calculateSimilarity(queryLower, term) > 0.8,
      );
      const textMatchesCluster = cluster.terms.some(
        (term) => textLower.includes(term) || this.calculateSimilarity(textLower, term) > 0.8,
      );

      if (queryMatchesCluster && textMatchesCluster) {
        score += cluster.weight;
      }
    });

    return score;
  }

  /**
   * Calculates contextual relevance based on related words.
   *
   * @param {SearchableDocument} doc - The document to check.
   * @param {string} query - The search query.
   * @returns {number} The contextual relevance score.
   */
  private calculateContextualRelevance(doc: SearchableDocument, query: string): number {
    let score = 0;
    const queryWords = this.extractWords(query);

    // Check for contextual word relationships
    queryWords.forEach((queryWord) => {
      doc.tags.forEach((tag) => {
        if (this.areWordsRelated(queryWord, tag)) {
          score += 0.5;
        }
      });
    });

    return score;
  }

  /**
   * Checks if two words are related using a predefined list.
   *
   * @param {string} word1 - The first word.
   * @param {string} word2 - The second word.
   * @returns {boolean} True if the words are related, false otherwise.
   */
  private areWordsRelated(word1: string, word2: string): boolean {
    // Simple related word detection - can be enhanced with NLP libraries
    const relatedPairs = [
      ['javascript', 'typescript'],
      ['react', 'vue'],
      ['frontend', 'backend'],
      ['ai', 'machine learning'],
      ['blockchain', 'cryptocurrency'],
      ['cloud', 'serverless'],
    ];

    return relatedPairs.some(
      (pair) => pair.includes(word1.toLowerCase()) && pair.includes(word2.toLowerCase()),
    );
  }

  /**
   * Sorts search results based on specified criteria.
   *
   * @param {SearchResult[]} results - The results to sort.
   * @param {string} sortBy - The sort criteria.
   * @param {string} sortOrder - The sort order ('asc' or 'desc').
   * @returns {SearchResult[]} The sorted results.
   */
  private sortResultsIntelligently(
    results: SearchResult[],
    sortBy: string,
    sortOrder: string,
  ): SearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'semantic':
          comparison = (b.semanticScore || 0) - (a.semanticScore || 0);
          break;
        case 'hybrid':
          const aHybrid = a.relevanceScore * 0.6 + (a.semanticScore || 0) * 0.4;
          const bHybrid = b.relevanceScore * 0.6 + (b.semanticScore || 0) * 0.4;
          comparison = bHybrid - aHybrid;
          break;
        case 'date':
          comparison = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = b.relevanceScore - a.relevanceScore;
      }

      return sortOrder === 'desc' ? comparison : -comparison;
    });
  }

  /**
   * Builds the main search index.
   *
   * @returns {Promise<void>} A promise that resolves when the index is built.
   */
  private buildSearchIndex(): Promise<void> {
    return new Promise((resolve) => {
      this.documents.forEach((doc, index) => {
        const words = this.extractWords(
          `${doc.title} ${doc.description} ${doc.content || ''} ${doc.tags.join(' ')}`,
        );

        words.forEach((word) => {
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Set());
          }
          this.searchIndex.get(word)!.add(index);
        });
      });
      resolve();
    });
  }

  /**
   * Builds the semantic index based on clusters.
   *
   * @returns {Promise<void>} A promise that resolves when the index is built.
   */
  private buildSemanticIndex(): Promise<void> {
    return new Promise((resolve) => {
      this.documents.forEach((doc, index) => {
        this.semanticClusters.forEach((cluster) => {
          cluster.terms.forEach((term) => {
            const content =
              `${doc.title} ${doc.description} ${doc.content || ''} ${doc.tags.join(' ')}`.toLowerCase();
            if (content.includes(term)) {
              if (!this.semanticIndex.has(term)) {
                this.semanticIndex.set(term, new Set());
              }
              this.semanticIndex.get(term)!.add(index);
            }
          });
        });
      });
      resolve();
    });
  }

  /**
   * Builds the n-gram index for partial matching.
   *
   * @returns {Promise<void>} A promise that resolves when the index is built.
   */
  private buildNgramIndex(): Promise<void> {
    return new Promise((resolve) => {
      this.documents.forEach((doc, index) => {
        const text = `${doc.title} ${doc.description}`.toLowerCase();
        const ngrams = this.generateNgrams(text, 3);

        ngrams.forEach((ngram) => {
          if (!this.ngramIndex.has(ngram)) {
            this.ngramIndex.set(ngram, new Set());
          }
          this.ngramIndex.get(ngram)!.add(index);
        });
      });
      resolve();
    });
  }

  /**
   * Builds the phrase index for phrase matching.
   *
   * @returns {Promise<void>} A promise that resolves when the index is built.
   */
  private buildPhraseIndex(): Promise<void> {
    return new Promise((resolve) => {
      this.documents.forEach((doc, index) => {
        const text = `${doc.title} ${doc.description}`.toLowerCase();
        // Extract 2-4 word phrases
        for (let phraseLength = 2; phraseLength <= 4; phraseLength++) {
          const phrases = this.extractPhrases(text, phraseLength);
          phrases.forEach((phrase) => {
            if (!this.phraseIndex.has(phrase)) {
              this.phraseIndex.set(phrase, new Set());
            }
            this.phraseIndex.get(phrase)!.add(index);
          });
        }
      });
      resolve();
    });
  }

  /**
   * Builds the tag index for tag-based filtering.
   *
   * @returns {Promise<void>} A promise that resolves when the index is built.
   */
  private buildTagIndex(): Promise<void> {
    return new Promise((resolve) => {
      this.documents.forEach((doc, index) => {
        doc.tags.forEach((tag) => {
          const normalizedTag = tag.toLowerCase();
          if (!this.tagIndex.has(normalizedTag)) {
            this.tagIndex.set(normalizedTag, new Set());
          }
          this.tagIndex.get(normalizedTag)!.add(index);
        });
      });
      resolve();
    });
  }

  /**
   * Builds the title index for title matching.
   *
   * @returns {Promise<void>} A promise that resolves when the index is built.
   */
  private buildTitleIndex(): Promise<void> {
    return new Promise((resolve) => {
      this.documents.forEach((doc, index) => {
        const words = this.extractWords(doc.title);
        words.forEach((word) => {
          if (!this.titleIndex.has(word)) {
            this.titleIndex.set(word, new Set());
          }
          this.titleIndex.get(word)!.add(index);
        });
      });
      resolve();
    });
  }

  /**
   * Generates n-grams from text.
   *
   * @param {string} text - The input text.
   * @param {number} n - The size of n-grams.
   * @returns {string[]} An array of n-grams.
   */
  private generateNgrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.substring(i, i + n));
    }
    return ngrams;
  }

  /**
   * Extracts phrases of a specific length from text.
   *
   * @param {string} text - The input text.
   * @param {number} length - The number of words in the phrase.
   * @returns {string[]} An array of phrases.
   */
  private extractPhrases(text: string, length: number): string[] {
    const words = text.split(/\s+/);
    const phrases: string[] = [];

    for (let i = 0; i <= words.length - length; i++) {
      const phrase = words.slice(i, i + length).join(' ');
      if (phrase.length > 3 && !this.stopWords.has(phrase)) {
        phrases.push(phrase);
      }
    }

    return phrases;
  }

  /**
   * Generates a smart excerpt containing the query terms.
   *
   * @param {SearchableDocument} doc - The document.
   * @param {string} query - The search query.
   * @returns {string} The generated excerpt.
   */
  private generateSmartExcerpt(doc: SearchableDocument, query: string): string {
    const queryWords = this.extractWords(query);
    const content = this.stripMarkdown(doc.content || doc.description);

    // Find the best sentence containing query terms
    const sentences = content.split(/[.!?]+/);
    let bestSentence = '';
    let maxMatches = 0;

    sentences.forEach((sentence) => {
      const matches = queryWords.filter((word) =>
        sentence.toLowerCase().includes(word.toLowerCase()),
      ).length;

      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence.trim();
      }
    });

    if (bestSentence && bestSentence.length > 50) {
      return bestSentence.substring(0, 200) + (bestSentence.length > 200 ? '...' : '');
    }

    return doc.description.substring(0, 150) + (doc.description.length > 150 ? '...' : '');
  }

  /**
   * Sets up keyboard shortcuts for search.
   */
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('main-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape to clear search
      if (e.key === 'Escape') {
        const searchInput = document.getElementById('main-search-input') as HTMLInputElement;
        if (searchInput && document.activeElement === searchInput) {
          searchInput.value = '';
          searchInput.blur();
        }
      }
    });
  }

  /**
   * Initializes default synonyms.
   */
  private initializeSynonyms(): void {
    // Basic synonym mapping - can be expanded
    this.synonymIndex.set('javascript', ['js', 'ecmascript']);
    this.synonymIndex.set('artificial intelligence', ['ai', 'machine learning', 'ml']);
    this.synonymIndex.set('user interface', ['ui', 'frontend']);
    this.synonymIndex.set('application programming interface', ['api', 'rest api']);
  }

  /**
   * Updates performance metrics after a search.
   *
   * @param {string} query - The search query.
   * @param {number} searchTime - The time taken for the search.
   * @param {boolean} cacheHit - Whether the result was from cache.
   */
  private updatePerformanceMetrics(query: string, searchTime: number, cacheHit: boolean): void {
    this.performanceMetrics.searchCount++;
    this.performanceMetrics.avgSearchTime =
      (this.performanceMetrics.avgSearchTime * (this.performanceMetrics.searchCount - 1) +
        searchTime) /
      this.performanceMetrics.searchCount;

    if (cacheHit) {
      this.performanceMetrics.cacheHitRate =
        (this.performanceMetrics.cacheHitRate * (this.performanceMetrics.searchCount - 1) + 1) /
        this.performanceMetrics.searchCount;
    }

    const queryCount = this.performanceMetrics.popularQueries.get(query) || 0;
    this.performanceMetrics.popularQueries.set(query, queryCount + 1);
  }

  /**
   * Clears all indexes and caches.
   */
  private clearIndexes(): void {
    this.searchIndex.clear();
    this.tagIndex.clear();
    this.titleIndex.clear();
    this.semanticIndex.clear();
    this.ngramIndex.clear();
    this.phraseIndex.clear();
    this.cache.clear();
    this.suggestionCache.clear();
  }

  /**
   * Cleans up indexes by removing references to invalid documents.
   */
  private cleanupIndexes(): void {
    // Remove entries that point to non-existent documents
    const validIndices = new Set(Array.from({ length: this.documents.length }, (_, i) => i));

    [
      this.searchIndex,
      this.tagIndex,
      this.titleIndex,
      this.semanticIndex,
      this.ngramIndex,
      this.phraseIndex,
    ].forEach((index) => {
      index.forEach((docIndices, key) => {
        const filteredIndices = new Set([...docIndices].filter((i) => validIndices.has(i)));
        if (filteredIndices.size === 0) {
          index.delete(key);
        } else {
          index.set(key, filteredIndices);
        }
      });
    });
  }

  // Utility methods from base class with enhancements

  /**
   * Extracts words from text, removing stop words and short words.
   *
   * @param {string} text - The input text.
   * @returns {string[]} An array of extracted words.
   */
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s+#]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 2 && !this.stopWords.has(word))
      .filter((word) => word.length >= 2 && !this.stopWords.has(word));
  }

  /**
   * Normalizes a search query.
   *
   * @param {string} query - The search query.
   * @returns {string} The normalized query.
   */
  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  /**
   * Normalizes a publication date.
   *
   * @param {Date | string | number} pubDate - The publication date.
   * @returns {Date} The normalized date object.
   */
  private normalizePubDate(pubDate: Date | string | number): Date {
    if (pubDate instanceof Date) return pubDate;
    const date = new Date(pubDate);
    return isNaN(date.getTime()) ? new Date(0) : date;
  }

  /**
   * Generates a unique cache key for search parameters.
   *
   * @param {string} query - The search query.
   * @param {SearchFilters} filters - The search filters.
   * @param {SearchOptions} options - The search options.
   * @returns {string} The cache key.
   */
  private getCacheKey(query: string, filters: SearchFilters, options: SearchOptions): string {
    return `${query}:${JSON.stringify(filters)}:${JSON.stringify(options)}`;
  }

  /**
   * Returns documents filtered only by basic filters (no text search).
   *
   * @param {SearchFilters} filters - The filters to apply.
   * @param {number} maxResults - The maximum number of results.
   * @returns {SearchResult[]} The filtered results.
   */
  private getFilteredDocuments(filters: SearchFilters, maxResults: number): SearchResult[] {
    return this.documents
      .filter((doc) => this.matchesFilters(doc, filters))
      .map((doc) => ({
        ...doc,
        relevanceScore: 0,
        matchedFields: [],
        excerpt: doc.description.substring(0, 150) + (doc.description.length > 150 ? '...' : ''),
      }))
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, maxResults);
  }

  /**
   * Checks if a document matches the specified filters.
   *
   * @param {SearchableDocument} doc - The document to check.
   * @param {SearchFilters} filters - The filters to apply.
   * @returns {boolean} True if the document matches the filters, false otherwise.
   */
  private matchesFilters(doc: SearchableDocument, filters: SearchFilters): boolean {
    if (filters.tags?.length && !filters.tags.some((tag) => doc.tags.includes(tag))) return false;
    if (filters.dateFrom && new Date(doc.pubDate) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(doc.pubDate) > filters.dateTo) return false;
    if (
      filters.author &&
      doc.author &&
      !doc.author.toLowerCase().includes(filters.author.toLowerCase())
    )
      return false;
    if (filters.category && doc.category !== filters.category) return false;
    if (filters.lang && filters.lang !== 'all' && doc.lang !== filters.lang) return false;
    return true;
  }

  /**
   * Identifies which fields matched the query.
   *
   * @param {SearchableDocument} doc - The document.
   * @param {string} query - The search query.
   * @returns {string[]} An array of matched field names.
   */
  private getMatchedFields(doc: SearchableDocument, query: string): string[] {
    const fields: string[] = [];
    const queryLower = query.toLowerCase();

    if (doc.title.toLowerCase().includes(queryLower)) fields.push('title');
    if (doc.description.toLowerCase().includes(queryLower)) fields.push('description');
    if (doc.tags.some((tag) => tag.toLowerCase().includes(queryLower))) fields.push('tags');
    if (doc.content?.toLowerCase().includes(queryLower)) fields.push('content');

    return fields;
  }

  /**
   * Highlights occurrences of query terms in text.
   *
   * @param {string} text - The input text.
   * @param {string} query - The search query.
   * @returns {string} The text with highlights applied.
   */
  private highlightText(text: string, query: string): string {
    const queryWords = this.extractWords(query);
    let highlightedText = text;

    queryWords.forEach((word) => {
      const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="search-highlight bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>',
      );
    });

    return highlightedText;
  }

  /**
   * Calculates similarity between two strings (0.0 to 1.0).
   *
   * @param {string} str1 - The first string.
   * @param {string} str2 - The second string.
   * @returns {number} The similarity score.
   */
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    return (longer.length - this.levenshteinDistance(longer, shorter)) / longer.length;
  }

  /**
   * Calculates Levenshtein distance between two strings.
   *
   * @param {string} str1 - The first string.
   * @param {string} str2 - The second string.
   * @returns {number} The Levenshtein distance.
   */
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
          matrix[j - 1][i - 1] + indicator,
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculates a score for a suggestion based on the query.
   *
   * @param {string} suggestion - The suggestion text.
   * @param {string} query - The search query.
   * @returns {number} The calculated score.
   */
  private calculateSuggestionScore(suggestion: string, query: string): number {
    const similarity = this.calculateSimilarity(suggestion.toLowerCase(), query);
    const startsWithBonus = suggestion.toLowerCase().startsWith(query) ? 0.5 : 0;
    const lengthPenalty = Math.max(0, (suggestion.length - 20) / 100);
    return similarity + startsWithBonus - lengthPenalty;
  }

  /**
   * Escapes special characters for use in a regular expression.
   *
   * @param {string} string - The input string.
   * @returns {string} The escaped string.
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Strips Markdown formatting from text.
   *
   * @param {string} text - The Markdown text.
   * @returns {string} The plain text.
   */
  private stripMarkdown(text: string): string {
    if (!text) return '';
    return text
      .replace(/!\[(.*?)\]\(.*?\)/g, '') // Images
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      .replace(/#{1,6}\s+(.*)/g, '$1') // Headers
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
      .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
      .replace(/`(.+?)`/g, '$1') // Inline code
      .replace(/^\s*>\s+(.*)/g, '$1') // Blockquotes
      .replace(/\n+/g, ' ') // Normalize newlines
      .trim();
  }

  /**
   * Track result click for analytics.
   *
   * @param {string} query - The search query.
   * @param {string} resultId - The ID of the clicked result.
   */
  trackResultClick(query: string, resultId: string): void {
    if (!this.analytics.clickTracking) {
      this.analytics.clickTracking = new Map();
    }

    const key = `${query}:${resultId}`;
    const currentCount = this.analytics.clickTracking.get(key) || 0;
    this.analytics.clickTracking.set(key, currentCount + 1);

    this.analytics.totalClicks++;
    console.log(`Tracked click: ${query} -> ${resultId}`);
  }

  /**
   * Optimize performance by clearing old cache entries.
   * Checks both search cache and analytics data.
   */
  optimizePerformance(): void {
    // Clear old cache entries if cache is too large
    if (this.searchCache.size > 1000) {
      // Keep only the most recent 500 entries
      const entries = Array.from(this.searchCache.entries());
      this.searchCache.clear();
      entries.slice(-500).forEach(([key, value]) => {
        this.searchCache.set(key, value);
      });
      console.log('Search cache optimized - reduced to 500 entries');
    }

    // Reset analytics if they get too large
    if (this.analytics.queryFrequency.size > 1000) {
      this.analytics.queryFrequency.clear();
      console.log('Query frequency analytics reset');
    }
  }
}

export default EnhancedSearchEngine;
