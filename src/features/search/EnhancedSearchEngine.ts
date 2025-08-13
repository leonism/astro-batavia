/**
 * Enhanced Search Engine for Astro Batavia
 * Features: Semantic search, instant results, accessibility, debouncing, caching
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
  sortBy?: "relevance" | "date" | "title" | "semantic" | "hybrid";
  sortOrder?: "asc" | "desc";
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
  type: "query" | "tag" | "title" | "semantic" | "completion";
  score: number;
  description?: string;
  category?: string;
}

interface SemanticCluster {
  terms: string[];
  weight: number;
  category: string;
}

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
      terms: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network'],
      weight: 1.2,
      category: 'technology'
    },
    {
      terms: ['web', 'frontend', 'backend', 'fullstack', 'javascript', 'typescript', 'react', 'vue', 'angular'],
      weight: 1.1,
      category: 'development'
    },
    {
      terms: ['blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'defi', 'smart contract'],
      weight: 1.1,
      category: 'blockchain'
    },
    {
      terms: ['cloud', 'aws', 'azure', 'gcp', 'serverless', 'microservices', 'kubernetes', 'docker'],
      weight: 1.1,
      category: 'cloud'
    },
    {
      terms: ['mobile', 'ios', 'android', 'app development', 'native', 'react native', 'flutter'],
      weight: 1.0,
      category: 'mobile'
    },
    {
      terms: ['security', 'cybersecurity', 'encryption', 'vulnerability', 'penetration testing', 'security audit'],
      weight: 1.2,
      category: 'security'
    }
  ];
  
  private stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "will", "would", "could", "should", "may", "might", "can", "must", "shall", "ought"
  ]);

  // Performance tracking
  private performanceMetrics = {
    searchCount: 0,
    avgSearchTime: 0,
    cacheHitRate: 0,
    popularQueries: new Map<string, number>()
  };

  constructor() {
    this.initializeSynonyms();
    if (typeof window !== 'undefined') {
      this.setupKeyboardShortcuts();
    }
  }

  /**
   * Index documents with enhanced semantic analysis
   */
  indexDocuments(documents: SearchableDocument[]): void {
    const startTime = performance.now();
    
    this.documents = documents.map(doc => ({
      ...doc,
      pubDate: this.normalizePubDate(doc.pubDate)
    }));

    // Clear existing indexes
    this.clearIndexes();
    
    // Build multiple indexes in parallel for better performance
    Promise.all([
      this.buildSearchIndex(),
      this.buildTagIndex(),
      this.buildTitleIndex(),
      this.buildSemanticIndex(),
      this.buildNgramIndex(),
      this.buildPhraseIndex()
    ]).then(() => {
      console.log(`Indexing completed in ${performance.now() - startTime}ms`);
    });
  }

  /**
   * Enhanced search with semantic understanding and typo tolerance
   */
  search(
    query: string,
    filters: SearchFilters = {},
    options: SearchOptions = {}
  ): SearchResult[] {
    const startTime = performance.now();
    
    const {
      fuzzyThreshold = 0.7,
      maxResults = 50,
      enableHighlighting = true,
      minQueryLength = 1,
      semanticBoost = 1.2,
      contextualBoost = 1.1,
      typoTolerance = true,
      phraseMatching = true
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
    const results = this.performEnhancedSearch(
      normalizedQuery,
      filters,
      {
        fuzzyThreshold,
        enableHighlighting,
        maxResults,
        semanticBoost,
        contextualBoost,
        typoTolerance,
        phraseMatching
      }
    );

    // Cache results
    this.cache.set(cacheKey, results);
    this.updatePerformanceMetrics(normalizedQuery, performance.now() - startTime, false);

    return results;
  }

  /**
   * Get intelligent search suggestions with context awareness
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
          type: "completion",
          score: count + (query.toLowerCase() === queryLower ? 10 : 0),
          description: `${count} searches`
        });
      }
    });

    // 2. Title suggestions with semantic relevance
    this.documents.forEach(doc => {
      const titleLower = doc.title.toLowerCase();
      if (titleLower.includes(queryLower)) {
        const semanticScore = this.calculateSemanticRelevance(partialQuery, doc.title);
        suggestions.push({
          text: doc.title,
          type: "title",
          score: this.calculateSuggestionScore(doc.title, queryLower) + semanticScore,
          description: doc.description.substring(0, 80) + "...",
          category: doc.category
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
        type: "tag",
        score: this.calculateSuggestionScore(tag, queryLower) + (count / 10),
        description: `${count} articles`,
        category: "tag"
      });
    });

    // 4. Semantic suggestions
    this.semanticClusters.forEach(cluster => {
      cluster.terms.forEach(term => {
        if (term.includes(queryLower) && term !== partialQuery) {
          suggestions.push({
            text: term,
            type: "semantic",
            score: this.calculateSuggestionScore(term, queryLower) * cluster.weight,
            description: `Related to ${cluster.category}`,
            category: cluster.category
          });
        }
      });
    });

    const finalSuggestions = suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter((suggestion, index, arr) =>
        arr.findIndex(s => s.text.toLowerCase() === suggestion.text.toLowerCase()) === index
      );

    this.suggestionCache.set(cacheKey, finalSuggestions);
    return finalSuggestions;
  }

  /**
   * Get search insights and analytics
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
        .map(([query, count]) => ({ query, count }))
    };
  }

  /**
   * Clear cache and optimize performance
   */
  optimizePerformance(): void {
    // Clear old cache entries
    if (this.cache.size > 100) {
      const entries = Array.from(this.cache.entries());
      this.cache.clear();
      // Keep the 50 most recent entries
      entries.slice(-50).forEach(([key, value]) => {
        this.cache.set(key, value);
      });
    }

    // Clear suggestion cache
    if (this.suggestionCache.size > 50) {
      this.suggestionCache.clear();
    }

    // Garbage collect unused indexes
    this.cleanupIndexes();
  }

  // Private methods
  
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
    }
  ): SearchResult[] {
    const queryWords = this.extractWords(query);
    const candidateScores = new Map<number, number>();
    
    // 1. Exact word matches
    queryWords.forEach(word => {
      if (this.searchIndex.has(word)) {
        this.searchIndex.get(word)!.forEach(index => {
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
        const semanticScore = this.calculateSemanticRelevance(query, doc.title + " " + doc.description);
        
        const result: SearchResult = {
          ...doc,
          relevanceScore,
          semanticScore,
          contextualRelevance: this.calculateContextualRelevance(doc, query),
          matchedFields: this.getMatchedFields(doc, query),
          excerpt: this.generateSmartExcerpt(doc, query)
        };

        if (options.enableHighlighting) {
          result.highlightedTitle = this.highlightText(doc.title, query);
          result.highlightedDescription = this.highlightText(doc.description, query);
          if (doc.content) {
            result.highlightedContent = this.highlightText(
              doc.content.substring(0, 300),
              query
            );
          }
        }

        results.push(result);
      }
    });

    return this.sortResultsIntelligently(results, filters.sortBy || "relevance", filters.sortOrder || "desc");
  }

  private addFuzzyMatches(
    queryWords: string[],
    candidateScores: Map<number, number>,
    threshold: number
  ): void {
    queryWords.forEach(word => {
      this.searchIndex.forEach((indices, indexedWord) => {
        const similarity = this.calculateSimilarity(word, indexedWord);
        if (similarity >= threshold && similarity < 1.0) {
          indices.forEach(index => {
            candidateScores.set(index, (candidateScores.get(index) || 0) + similarity * 2);
          });
        }
      });
    });
  }

  private addPhraseMatches(query: string, candidateScores: Map<number, number>): void {
    if (this.phraseIndex.has(query)) {
      this.phraseIndex.get(query)!.forEach(index => {
        candidateScores.set(index, (candidateScores.get(index) || 0) + 5);
      });
    }
  }

  private addSemanticMatches(
    query: string,
    candidateScores: Map<number, number>,
    boost: number
  ): void {
    this.semanticClusters.forEach(cluster => {
      if (cluster.terms.some(term => query.toLowerCase().includes(term))) {
        cluster.terms.forEach(term => {
          if (this.semanticIndex.has(term)) {
            this.semanticIndex.get(term)!.forEach(index => {
              candidateScores.set(index, (candidateScores.get(index) || 0) + (boost * cluster.weight));
            });
          }
        });
      }
    });
  }

  private addNgramMatches(query: string, candidateScores: Map<number, number>): void {
    const ngrams = this.generateNgrams(query, 3);
    ngrams.forEach(ngram => {
      if (this.ngramIndex.has(ngram)) {
        this.ngramIndex.get(ngram)!.forEach(index => {
          candidateScores.set(index, (candidateScores.get(index) || 0) + 0.5);
        });
      }
    });
  }

  private calculateEnhancedRelevance(
    doc: SearchableDocument,
    query: string,
    baseScore: number,
    options: any
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
    doc.tags.forEach(tag => {
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
    const daysSincePublished = (Date.now() - new Date(doc.pubDate).getTime()) / (1000 * 60 * 60 * 24);
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

  private calculateSemanticRelevance(query: string, text: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    this.semanticClusters.forEach(cluster => {
      const queryMatchesCluster = cluster.terms.some(term => 
        queryLower.includes(term) || this.calculateSimilarity(queryLower, term) > 0.8
      );
      const textMatchesCluster = cluster.terms.some(term => 
        textLower.includes(term) || this.calculateSimilarity(textLower, term) > 0.8
      );

      if (queryMatchesCluster && textMatchesCluster) {
        score += cluster.weight;
      }
    });

    return score;
  }

  private calculateContextualRelevance(doc: SearchableDocument, query: string): number {
    let score = 0;
    const queryWords = this.extractWords(query);
    
    // Check for contextual word relationships
    queryWords.forEach(queryWord => {
      doc.tags.forEach(tag => {
        if (this.areWordsRelated(queryWord, tag)) {
          score += 0.5;
        }
      });
    });

    return score;
  }

  private areWordsRelated(word1: string, word2: string): boolean {
    // Simple related word detection - can be enhanced with NLP libraries
    const relatedPairs = [
      ['javascript', 'typescript'], ['react', 'vue'], ['frontend', 'backend'],
      ['ai', 'machine learning'], ['blockchain', 'cryptocurrency'], ['cloud', 'serverless']
    ];

    return relatedPairs.some(pair => 
      (pair.includes(word1.toLowerCase()) && pair.includes(word2.toLowerCase()))
    );
  }

  private sortResultsIntelligently(
    results: SearchResult[],
    sortBy: string,
    sortOrder: string
  ): SearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "semantic":
          comparison = (b.semanticScore || 0) - (a.semanticScore || 0);
          break;
        case "hybrid":
          const aHybrid = (a.relevanceScore * 0.6) + ((a.semanticScore || 0) * 0.4);
          const bHybrid = (b.relevanceScore * 0.6) + ((b.semanticScore || 0) * 0.4);
          comparison = bHybrid - aHybrid;
          break;
        case "date":
          comparison = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = b.relevanceScore - a.relevanceScore;
      }

      return sortOrder === "desc" ? comparison : -comparison;
    });
  }

  private buildSearchIndex(): Promise<void> {
    return new Promise(resolve => {
      this.documents.forEach((doc, index) => {
        const words = this.extractWords(
          `${doc.title} ${doc.description} ${doc.content || ""} ${doc.tags.join(" ")}`
        );

        words.forEach(word => {
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Set());
          }
          this.searchIndex.get(word)!.add(index);
        });
      });
      resolve();
    });
  }

  private buildSemanticIndex(): Promise<void> {
    return new Promise(resolve => {
      this.documents.forEach((doc, index) => {
        this.semanticClusters.forEach(cluster => {
          cluster.terms.forEach(term => {
            const content = `${doc.title} ${doc.description} ${doc.content || ""} ${doc.tags.join(" ")}`.toLowerCase();
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

  private buildNgramIndex(): Promise<void> {
    return new Promise(resolve => {
      this.documents.forEach((doc, index) => {
        const text = `${doc.title} ${doc.description}`.toLowerCase();
        const ngrams = this.generateNgrams(text, 3);
        
        ngrams.forEach(ngram => {
          if (!this.ngramIndex.has(ngram)) {
            this.ngramIndex.set(ngram, new Set());
          }
          this.ngramIndex.get(ngram)!.add(index);
        });
      });
      resolve();
    });
  }

  private buildPhraseIndex(): Promise<void> {
    return new Promise(resolve => {
      this.documents.forEach((doc, index) => {
        const text = `${doc.title} ${doc.description}`.toLowerCase();
        // Extract 2-4 word phrases
        for (let phraseLength = 2; phraseLength <= 4; phraseLength++) {
          const phrases = this.extractPhrases(text, phraseLength);
          phrases.forEach(phrase => {
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

  private buildTagIndex(): Promise<void> {
    return new Promise(resolve => {
      this.documents.forEach((doc, index) => {
        doc.tags.forEach(tag => {
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

  private buildTitleIndex(): Promise<void> {
    return new Promise(resolve => {
      this.documents.forEach((doc, index) => {
        const words = this.extractWords(doc.title);
        words.forEach(word => {
          if (!this.titleIndex.has(word)) {
            this.titleIndex.set(word, new Set());
          }
          this.titleIndex.get(word)!.add(index);
        });
      });
      resolve();
    });
  }

  private generateNgrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.substring(i, i + n));
    }
    return ngrams;
  }

  private extractPhrases(text: string, length: number): string[] {
    const words = text.split(/\s+/);
    const phrases: string[] = [];
    
    for (let i = 0; i <= words.length - length; i++) {
      const phrase = words.slice(i, i + length).join(" ");
      if (phrase.length > 3 && !this.stopWords.has(phrase)) {
        phrases.push(phrase);
      }
    }
    
    return phrases;
  }

  private generateSmartExcerpt(doc: SearchableDocument, query: string): string {
    const queryWords = this.extractWords(query);
    const content = doc.content || doc.description;
    
    // Find the best sentence containing query terms
    const sentences = content.split(/[.!?]+/);
    let bestSentence = "";
    let maxMatches = 0;
    
    sentences.forEach(sentence => {
      const matches = queryWords.filter(word => 
        sentence.toLowerCase().includes(word.toLowerCase())
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence.trim();
      }
    });
    
    if (bestSentence && bestSentence.length > 50) {
      return bestSentence.substring(0, 200) + (bestSentence.length > 200 ? "..." : "");
    }
    
    return doc.description.substring(0, 150) + (doc.description.length > 150 ? "..." : "");
  }

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

  private initializeSynonyms(): void {
    // Basic synonym mapping - can be expanded
    this.synonymIndex.set('javascript', ['js', 'ecmascript']);
    this.synonymIndex.set('artificial intelligence', ['ai', 'machine learning', 'ml']);
    this.synonymIndex.set('user interface', ['ui', 'frontend']);
    this.synonymIndex.set('application programming interface', ['api', 'rest api']);
  }

  private updatePerformanceMetrics(query: string, searchTime: number, cacheHit: boolean): void {
    this.performanceMetrics.searchCount++;
    this.performanceMetrics.avgSearchTime = 
      (this.performanceMetrics.avgSearchTime * (this.performanceMetrics.searchCount - 1) + searchTime) / 
      this.performanceMetrics.searchCount;
    
    if (cacheHit) {
      this.performanceMetrics.cacheHitRate = 
        (this.performanceMetrics.cacheHitRate * (this.performanceMetrics.searchCount - 1) + 1) / 
        this.performanceMetrics.searchCount;
    }

    const queryCount = this.performanceMetrics.popularQueries.get(query) || 0;
    this.performanceMetrics.popularQueries.set(query, queryCount + 1);
  }

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

  private cleanupIndexes(): void {
    // Remove entries that point to non-existent documents
    const validIndices = new Set(Array.from({ length: this.documents.length }, (_, i) => i));
    
    [this.searchIndex, this.tagIndex, this.titleIndex, this.semanticIndex, this.ngramIndex, this.phraseIndex]
      .forEach(index => {
        index.forEach((docIndices, key) => {
          const filteredIndices = new Set([...docIndices].filter(i => validIndices.has(i)));
          if (filteredIndices.size === 0) {
            index.delete(key);
          } else {
            index.set(key, filteredIndices);
          }
        });
      });
  }

  // Utility methods from base class with enhancements
  private extractWords(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word))
      .slice(0, 50); // Limit to prevent performance issues
  }

  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  private normalizePubDate(pubDate: Date | string | number): Date {
    if (pubDate instanceof Date) return pubDate;
    const date = new Date(pubDate);
    return isNaN(date.getTime()) ? new Date(0) : date;
  }

  private getCacheKey(query: string, filters: SearchFilters, options: SearchOptions): string {
    return `${query}:${JSON.stringify(filters)}:${JSON.stringify(options)}`;
  }

  private getFilteredDocuments(filters: SearchFilters, maxResults: number): SearchResult[] {
    return this.documents
      .filter(doc => this.matchesFilters(doc, filters))
      .map(doc => ({
        ...doc,
        relevanceScore: 0,
        matchedFields: [],
        excerpt: doc.description.substring(0, 150) + (doc.description.length > 150 ? "..." : "")
      }))
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, maxResults);
  }

  private matchesFilters(doc: SearchableDocument, filters: SearchFilters): boolean {
    if (filters.tags?.length && !filters.tags.some(tag => doc.tags.includes(tag))) return false;
    if (filters.dateFrom && new Date(doc.pubDate) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(doc.pubDate) > filters.dateTo) return false;
    if (filters.author && doc.author && !doc.author.toLowerCase().includes(filters.author.toLowerCase())) return false;
    if (filters.category && doc.category !== filters.category) return false;
    if (filters.lang && doc.lang !== filters.lang) return false;
    return true;
  }

  private getMatchedFields(doc: SearchableDocument, query: string): string[] {
    const fields: string[] = [];
    const queryLower = query.toLowerCase();

    if (doc.title.toLowerCase().includes(queryLower)) fields.push("title");
    if (doc.description.toLowerCase().includes(queryLower)) fields.push("description");
    if (doc.tags.some(tag => tag.toLowerCase().includes(queryLower))) fields.push("tags");
    if (doc.content?.toLowerCase().includes(queryLower)) fields.push("content");

    return fields;
  }

  private highlightText(text: string, query: string): string {
    const queryWords = this.extractWords(query);
    let highlightedText = text;

    queryWords.forEach(word => {
      const regex = new RegExp(`(${this.escapeRegex(word)})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="search-highlight bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
      );
    });

    return highlightedText;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - this.levenshteinDistance(longer, shorter)) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

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
    const similarity = this.calculateSimilarity(suggestion.toLowerCase(), query);
    const startsWithBonus = suggestion.toLowerCase().startsWith(query) ? 0.5 : 0;
    const lengthPenalty = Math.max(0, (suggestion.length - 20) / 100);
    return similarity + startsWithBonus - lengthPenalty;
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

export default EnhancedSearchEngine;
