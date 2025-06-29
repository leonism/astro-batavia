export interface SearchablePost {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
  lang: string;
  author?: string;
  readingTime?: number;
  category?: string;
}

export interface SearchResult extends SearchablePost {
  url: string;
  formattedPubDate: string;
  relevanceScore?: number;
  excerpt?: string;
}

export interface SearchMetrics {
  totalResults: number;
  searchTime: number;
  query: string;
  filters: SearchFilters;
}

// Enhanced search function with fuzzy matching and relevance scoring
export function searchPosts(
  posts: SearchablePost[],
  query: string,
  lang: string = "en"
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const startTime = performance.now();
  const normalizedQuery = normalizeSearchQuery(query);
  const queryTerms = normalizedQuery
    .split(/\s+/)
    .filter((term) => term.length > 1);

  const results = posts
    .filter((post) => post.lang === lang)
    .map((post) => {
      const relevanceScore = calculateRelevanceScore(
        post,
        queryTerms,
        normalizedQuery
      );
      if (relevanceScore === 0) return null;

      return {
        ...post,
        url: generatePostUrl(post.slug, lang),
        formattedPubDate: formatSearchDate(post.pubDate),
        relevanceScore,
        excerpt: generateExcerpt(post.description, queryTerms),
      };
    })
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  const searchTime = performance.now() - startTime;
  console.debug(
    `Search completed in ${searchTime.toFixed(2)}ms, found ${
      results.length
    } results`
  );

  return results;
}

function formatSearchDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Enhanced utility functions for better search quality
function normalizeSearchQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ");
}

function calculateRelevanceScore(
  post: SearchablePost,
  queryTerms: string[],
  fullQuery: string
): number {
  let score = 0;
  const title = post.title.toLowerCase();
  const description = post.description.toLowerCase();
  const tags = (post.tags || []).map((tag) => tag.toLowerCase());
  const author = (post.author || "").toLowerCase();

  // Exact phrase match (highest priority)
  if (title.includes(fullQuery)) score += 100;
  if (description.includes(fullQuery)) score += 50;
  if (tags.some((tag) => tag.includes(fullQuery))) score += 75;

  // Individual term matches
  queryTerms.forEach((term) => {
    if (title.includes(term)) score += 20;
    if (description.includes(term)) score += 10;
    if (tags.some((tag) => tag.includes(term))) score += 15;
    if (author.includes(term)) score += 5;
  });

  // Boost for title word boundaries
  queryTerms.forEach((term) => {
    const titleWords = title.split(/\s+/);
    if (titleWords.some((word) => word.startsWith(term))) score += 10;
  });

  // Recency boost (newer posts get slight advantage)
  const daysSincePublished =
    (Date.now() - post.pubDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePublished < 30) score += 5;
  else if (daysSincePublished < 90) score += 2;

  return score;
}

function generatePostUrl(slug: string, lang: string): string {
  const cleanSlug = slug.replace(new RegExp(`^${lang}/`), "");
  return lang === "en" ? `/blog/${cleanSlug}` : `/${lang}/blog/${cleanSlug}`;
}

function generateExcerpt(
  description: string,
  queryTerms: string[],
  maxLength: number = 150
): string {
  if (description.length <= maxLength) return description;

  // Try to find a sentence containing query terms
  const sentences = description.split(/[.!?]+/);
  const relevantSentence = sentences.find((sentence) =>
    queryTerms.some((term) => sentence.toLowerCase().includes(term))
  );

  if (relevantSentence && relevantSentence.length <= maxLength) {
    return relevantSentence.trim() + ".";
  }

  // Fallback to truncated description
  return description.substring(0, maxLength - 3).trim() + "...";
}

// Advanced search with filters
export interface SearchFilters {
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  author?: string;
  sortBy?: "date" | "title" | "relevance";
  sortOrder?: "asc" | "desc";
}

// Client-side advanced search with pre-fetched data
export function advancedSearchClient(
  posts: SearchablePost[],
  query: string,
  filters: SearchFilters = {},
  lang: string = "en"
): SearchResult[] {
  try {
    let filteredPosts = posts.filter((post) => post.lang === lang);

    // Apply text search
    if (query.trim()) {
      filteredPosts = filteredPosts.filter((post: SearchablePost) => {
        const searchText = `${post.title} ${post.description} ${(
          post.tags || []
        ).join(" ")}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter((post: SearchablePost) => {
        return filters.tags!.some((tag) => (post.tags || []).includes(tag));
      });
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filteredPosts = filteredPosts.filter(
        (post: SearchablePost) => post.pubDate >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      filteredPosts = filteredPosts.filter(
        (post: SearchablePost) => post.pubDate <= filters.dateTo!
      );
    }

    // Sort results
    const sortBy = filters.sortBy || "date";
    const sortOrder = filters.sortOrder || "desc";

    filteredPosts.sort((a: SearchablePost, b: SearchablePost) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          comparison = a.pubDate.getTime() - b.pubDate.getTime();
          break;
        case "relevance":
          // Simple relevance scoring based on query matches in title vs description
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const queryLower = query.toLowerCase();

          const aScore =
            (aTitle.includes(queryLower) ? 2 : 0) +
            (a.description.toLowerCase().includes(queryLower) ? 1 : 0);
          const bScore =
            (bTitle.includes(queryLower) ? 2 : 0) +
            (b.description.toLowerCase().includes(queryLower) ? 1 : 0);

          comparison = bScore - aScore;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filteredPosts.map((post: SearchablePost) => ({
      ...post,
      url:
        lang === "en"
          ? `/blog/${post.slug.replace("en/", "")}`
          : `/${lang}/blog/${post.slug.replace(`${lang}/`, "")}`,
      formattedPubDate: formatSearchDate(post.pubDate),
    }));
  } catch (error) {
    console.error("Advanced search error:", error);
    return [];
  }
}

// Client-side function to get popular tags from pre-fetched data
export function getPopularTagsClient(
  posts: SearchablePost[],
  lang: string = "en",
  limit: number = 10
): { tag: string; count: number }[] {
  try {
    const filteredPosts = posts.filter((post) => post.lang === lang);
    const tagCounts = new Map<string, number>();

    filteredPosts.forEach((post: SearchablePost) => {
      (post.tags || []).forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting popular tags:", error);
    return [];
  }
}

// Client-side search suggestions from pre-fetched data
export function getSearchSuggestionsClient(
  posts: SearchablePost[],
  partialQuery: string,
  lang: string = "en",
  limit: number = 5
): string[] {
  try {
    if (partialQuery.length < 2) return [];

    const filteredPosts = posts.filter((post) => post.lang === lang);
    const suggestions = new Set<string>();
    const queryLower = partialQuery.toLowerCase();

    filteredPosts.forEach((post: SearchablePost) => {
      // Extract words from title and description
      const words = `${post.title} ${post.description}`
        .toLowerCase()
        .split(/\s+/)
        .filter((word: string) => word.length > 2 && word.includes(queryLower));

      words.forEach((word: string) => {
        if (suggestions.size < limit * 3) {
          suggestions.add(word);
        }
      });

      // Add matching tags
      (post.tags || []).forEach((tag: string) => {
        if (
          tag.toLowerCase().includes(queryLower) &&
          suggestions.size < limit * 3
        ) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions)
      .sort((a: string, b: string) => {
        // Prioritize exact matches and shorter words
        const aExact = a.startsWith(queryLower) ? 0 : 1;
        const bExact = b.startsWith(queryLower) ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return a.length - b.length;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    return [];
  }
}
