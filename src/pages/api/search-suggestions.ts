/**
 * @file Search Suggestions API Route
 * @description Provides real-time search suggestions based on the blog content.
 *
 * Astro.js Tip: API endpoints are great for building interactive features like
 * "Search as you type" without needing a complex backend.
 */

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

/**
 * Finds matching titles, descriptions, or tags for a search query.
 * @param query The partial text entered by the user.
 * @param lang The language to search in.
 * @param limit Maximum number of suggestions.
 */
export async function getSearchSuggestions(
  query: string,
  lang: string = 'en',
  limit: number = 5,
): Promise<string[]> {
  try {
    if (query.length < 2) return [];

    const allPosts = await getCollection('blog', ({ id, data }) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const suggestions = new Set<string>();
    const lowerCaseQuery = query.toLowerCase();

    allPosts.forEach((post) => {
      // Junior Dev Tip: Searching across multiple fields (title, description, tags)
      // makes the search results more helpful.
      if (post.data.title.toLowerCase().includes(lowerCaseQuery)) {
        suggestions.add(post.data.title);
      }
      if (post.data.description.toLowerCase().includes(lowerCaseQuery)) {
        suggestions.add(post.data.description);
      }
      (post.data.tags || []).forEach((tag) => {
        if (tag.toLowerCase().includes(lowerCaseQuery)) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  } catch (error) {
    console.error('Get search suggestions error:', error);
    return [];
  }
}

/**
 * GET handler for the search suggestions API.
 */
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const lang = url.searchParams.get('lang') || 'en';
  const limit = parseInt(url.searchParams.get('limit') || '5');

  try {
    const suggestions = await getSearchSuggestions(query, lang, limit);
    return new Response(JSON.stringify(suggestions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get search suggestions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
