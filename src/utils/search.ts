// Removed astro:content imports as they are server-side only
import { getLocalizedPath } from '@/i18n/utils';

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  pubDate: string;
  tags?: string[];
  lang: string;
  slug: string;
}

// Simple client-side search implementation
export async function searchPosts(query: string, lang: string = 'en'): Promise<SearchResult[]> {
  try {
    // Fetch posts from API endpoint
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&lang=${lang}`);
    if (!response.ok) {
      throw new Error('Search API request failed');
    }
    
    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

function formatSearchDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Advanced search with filters
export interface SearchFilters {
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  author?: string;
  sortBy?: 'date' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export async function advancedSearch(
  query: string,
  filters: SearchFilters = {},
  lang: string = 'en'
): Promise<SearchResult[]> {
  try {
    const allPosts = await getCollection('blog', ({ id, data }) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    let filteredPosts = allPosts;

    // Apply text search
    if (query.trim()) {
      filteredPosts = filteredPosts.filter(post => {
        const searchText = `${post.data.title} ${post.data.description} ${(post.data.tags || []).join(' ')}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => {
        return filters.tags!.some(tag => (post.data.tags || []).includes(tag));
      });
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filteredPosts = filteredPosts.filter(post => post.data.pubDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filteredPosts = filteredPosts.filter(post => post.data.pubDate <= filters.dateTo!);
    }

    // Apply author filter
    if (filters.author) {
      filteredPosts = filteredPosts.filter(post =>
        post.data.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    // Sort results
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';

    filteredPosts.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.data.title.localeCompare(b.data.title);
          break;
        case 'date':
          comparison = a.data.pubDate.getTime() - b.data.pubDate.getTime();
          break;
        case 'relevance':
          // Simple relevance scoring based on query matches in title vs description
          const aTitle = a.data.title.toLowerCase();
          const bTitle = b.data.title.toLowerCase();
          const queryLower = query.toLowerCase();

          const aScore = (aTitle.includes(queryLower) ? 2 : 0) +
                        (a.data.description.toLowerCase().includes(queryLower) ? 1 : 0);
          const bScore = (bTitle.includes(queryLower) ? 2 : 0) +
                        (b.data.description.toLowerCase().includes(queryLower) ? 1 : 0);

          comparison = bScore - aScore;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filteredPosts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      url: getLocalizedPath(`/blog/${post.slug.replace(/^(en|es|ja)\//g, '')}`, lang),
      pubDate: formatSearchDate(post.data.pubDate),
      tags: post.data.tags,
      lang: lang,
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Advanced search error:', error);
    return [];
  }
}

// Get popular tags for search suggestions
export async function getPopularTags(lang: string = 'en', limit: number = 10): Promise<{ tag: string; count: number }[]> {
  try {
    const allPosts = await getCollection('blog', ({ id, data }) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const tagCounts = new Map<string, number>();

    allPosts.forEach(post => {
      (post.data.tags || []).forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting popular tags:', error);
    return [];
  }
}

// Search suggestions based on partial query
export async function getSearchSuggestions(partialQuery: string, lang: string = 'en', limit: number = 5): Promise<string[]> {
  try {
    if (partialQuery.length < 2) return [];

    const allPosts = await getCollection('blog', ({ id, data }) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const suggestions = new Set<string>();
    const queryLower = partialQuery.toLowerCase();

    allPosts.forEach(post => {
      // Extract words from title and description
      const words = `${post.data.title} ${post.data.description}`
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2 && word.includes(queryLower));

      words.forEach(word => {
        if (suggestions.size < limit * 3) {
          suggestions.add(word);
        }
      });

      // Add matching tags
      (post.data.tags || []).forEach(tag => {
        if (tag.toLowerCase().includes(queryLower) && suggestions.size < limit * 3) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions)
      .sort((a, b) => {
        // Prioritize exact matches and shorter words
        const aExact = a.startsWith(queryLower) ? 0 : 1;
        const bExact = b.startsWith(queryLower) ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return a.length - b.length;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    return [];
  }
}
