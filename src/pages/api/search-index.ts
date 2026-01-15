/**
 * @file Search Index API Route
 * @description Generates a JSON index of all published blog posts for client-side search.
 *
 * Astro.js Tip: API routes (Endpoints) are defined by exporting a function
 * named after the HTTP method (GET, POST, etc.). They allow you to serve
 * dynamic data or generate static JSON files at build time.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPostUrl } from '@/i18n/utils';

/**
 * GET handler for the search index.
 * Fetches all non-draft posts and transforms them into a search-friendly format.
 */
export const GET: APIRoute = async () => {
  try {
    const allBlogPosts = await getCollection('blog', ({ data }) => {
      // Junior Dev Tip: Always exclude drafts from your public indexes!
      return !data.draft;
    });

    const documents = allBlogPosts.map((post) => {
      // Extract language from the first part of the slug (e.g., 'en/post' -> 'en')
      const lang = post.slug.split('/')[0];

      return {
        id: post.id,
        title: post.data.title,
        description: post.data.description,
        content: post.body,
        tags: post.data.tags || [],
        url: getPostUrl(post.slug, lang),
        pubDate: post.data.pubDate,
        author: post.data.author,
        lang: lang,
        slug: post.slug.split('/').slice(1).join('/'),
        heroImage: post.data.heroImage,
      };
    });

    /**
     * Optimization Tip: For very large sites, you should pre-calculate
     * this index at build time and serve it as a static JSON file.
     */
    return new Response(JSON.stringify(documents), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Performance: Cache the response to reduce server load
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating search index:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate search index' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
