import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

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
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get popular tags' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
