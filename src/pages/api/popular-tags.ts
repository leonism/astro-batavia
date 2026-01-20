import type { APIRoute } from 'astro';
import { BlogService } from '@/services/BlogService';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';
  const limit = parseInt(url.searchParams.get('limit') || '10');

  try {
    const tags = await BlogService.getPopularTags(lang, limit);
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
