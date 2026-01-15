/**
 * @file Blog Data Utilities
 * @description Helper functions for managing and filtering blog post data.
 *
 * Astro.js Tip: Keeping data fetching logic separate from your UI components
 * makes them easier to test and reuse across different pages.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { getPostUrl } from '@/i18n/utils';
import { UI_CONFIG } from '@/consts';

/**
 * Type representing a single blog post entry.
 */
export type Post = CollectionEntry<'blog'>;

/**
 * Fetches and sorts blog posts for a specific language.
 * @param lang The language code (e.g., 'en', 'es', 'ja').
 * @returns Sorted array of blog posts.
 */
export async function getSortedPostsByLang(lang: string): Promise<Post[]> {
  const allPosts = await getCollection('blog', (entry: Post) => {
    // Junior Dev Tip: We filter by both language prefix in the slug and the draft status.
    return entry.slug.startsWith(`${lang}/`) && !entry.data.draft;
  });

  return allPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Calculates previous and next navigation data for a post.
 */
export function getPostNavigation(posts: Post[], currentSlug: string, lang: string) {
  const sortedAsc = [...posts].sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  const currentIndex = sortedAsc.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) return { prev: undefined, next: undefined };

  const prev = currentIndex > 0 ? sortedAsc[currentIndex - 1] : undefined;
  const next = currentIndex < sortedAsc.length - 1 ? sortedAsc[currentIndex + 1] : undefined;

  return {
    previousPostData: prev
      ? {
          url: getPostUrl(prev.slug, lang),
          title: prev.data.title,
        }
      : undefined,
    nextPostData: next
      ? {
          url: getPostUrl(next.slug, lang),
          title: next.data.title,
        }
      : undefined,
  };
}

/**
 * Retrieves related posts based on shared tags.
 */
export function getRelatedPosts(posts: Post[], currentSlug: string, currentTags: string[] = []) {
  return posts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.data.tags && post.data.tags.some((tag) => currentTags.includes(tag)))
    .slice(0, UI_CONFIG.relatedPostsLimit);
}

/**
 * Helper to get English posts specifically.
 */
export async function getSortedEnglishPosts(): Promise<Post[]> {
  return getSortedPostsByLang('en');
}

/**
 * Extracts all unique tags from a list of posts.
 */
export function getAllUniqueTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags || []))].sort();
}

/**
 * Global pagination limit.
 */
export const POSTS_PER_PAGE = UI_CONFIG.postsPerPage;
