/**
 * @file Popular Tags API Route
 * @description Analyzes the content collection to find the most frequently used tags.
 *
 * Astro.js Tip: You can share logic between your API routes and your Astro components.
 * The 'getPopularTags' function can be used for both server-side rendering (SSR)
 * and client-side AJAX requests.
 */

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

/**
 * Logic to calculate tag frequency across blog posts.
 * @param lang The language to filter by.
 * @param limit Maximum number of tags to return.
 */
export async function getPopularTags(
  lang: string = 'en',
  limit: number = 10,
): Promise<{ tag: string; count: number }[]> {
  try {
    const allPosts = await getCollection('blog', ({ id, data }) => {
      return id.startsWith(`${lang}/`) && !data.draft;
    });

    const tagCounts = new Map<string, number>();

    allPosts.forEach((post) => {
      (post.data.tags || []).forEach((tag) => {
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

/**
 * GET handler for the popular tags API.
 * Accepts 'lang' and 'limit' as query parameters.
 */
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';
  const limit = parseInt(url.searchParams.get('limit') || '10');

  try {
    const tags = await getPopularTags(lang, limit);
    return new Response(JSON.stringify(tags), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get popular tags' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
