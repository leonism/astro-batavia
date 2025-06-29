import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { SearchablePost, SearchResult, SearchFilters } from './search';

// Server-side function to get all posts for a language
export async function getAllPosts(lang: string = 'en'): Promise<SearchablePost[]> {
  try {
    const allPosts = await getCollection('blog', ({ id, data }: CollectionEntry<'blog'>) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    return allPosts.map((post: CollectionEntry<'blog'>) => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      tags: post.data.tags,
      lang: lang,
    }));
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

// Server-side advanced search with filters
export async function advancedSearchServer(
  query: string,
  filters: SearchFilters = {},
  lang: string = 'en'
): Promise<SearchResult[]> {
  try {
    const allPosts = await getCollection('blog', ({ id, data }: CollectionEntry<'blog'>) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    let filteredPosts = allPosts;

    // Apply text search
    if (query.trim()) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<'blog'>) => {
        const searchText = `${post.data.title} ${post.data.description} ${(post.data.tags || []).join(' ')}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<'blog'>) => {
        return filters.tags!.some(tag => (post.data.tags || []).includes(tag));
      });
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<'blog'>) => post.data.pubDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<'blog'>) => post.data.pubDate <= filters.dateTo!);
    }

    // Apply author filter
    if (filters.author) {
      filteredPosts = filteredPosts.filter((post: CollectionEntry<'blog'>) =>
        post.data.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    // Sort results
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';

    filteredPosts.sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
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

    return filteredPosts.map((post: CollectionEntry<'blog'>) => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      url: lang === 'en' ? `/blog/${post.slug.replace('en/', '')}` : `/${lang}/blog/${post.slug.replace(`${lang}/`, '')}`,
      pubDate: post.data.pubDate,
      formattedPubDate: formatSearchDate(post.data.pubDate),
      tags: post.data.tags,
      lang: lang,
    }));
  } catch (error) {
    console.error('Advanced search error:', error);
    return [];
  }
}

// Server-side function to get popular tags
export async function getPopularTagsServer(lang: string = 'en', limit: number = 10): Promise<{ tag: string; count: number }[]> {
  try {
    const allPosts = await getCollection('blog', ({ id, data }: CollectionEntry<'blog'>) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const tagCounts = new Map<string, number>();

    allPosts.forEach((post: CollectionEntry<'blog'>) => {
      (post.data.tags || []).forEach((tag: string) => {
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

// Server-side function to get search suggestions
export async function getSearchSuggestionsServer(partialQuery: string, lang: string = 'en', limit: number = 5): Promise<string[]> {
  try {
    if (partialQuery.length < 2) return [];

    const allPosts = await getCollection('blog', ({ id, data }: CollectionEntry<'blog'>) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const suggestions = new Set<string>();
    const queryLower = partialQuery.toLowerCase();

    allPosts.forEach((post: CollectionEntry<'blog'>) => {
      // Extract words from title and description
      const words = `${post.data.title} ${post.data.description}`
        .toLowerCase()
        .split(/\s+/)
        .filter((word: string) => word.length > 2 && word.includes(queryLower));

      words.forEach((word: string) => {
        if (suggestions.size < limit * 3) {
          suggestions.add(word);
        }
      });

      // Add matching tags
      (post.data.tags || []).forEach((tag: string) => {
        if (tag.toLowerCase().includes(queryLower) && suggestions.size < limit * 3) {
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
    console.error('Error getting search suggestions:', error);
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