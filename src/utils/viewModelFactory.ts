/**
 * @file View Model Factory
 * @description Decouples raw content data from the UI representation.
 *
 * Astro.js Tip: Using View Models (or Data Transfer Objects) is a great way
 * to keep your components clean. It ensures that components only receive
 * the exact data they need in the format they expect.
 */

import { getPostUrl } from '@/i18n/utils';

/**
 * Clean data structure for a blog post card or hero.
 */
export interface BlogPostViewModel {
  title: string;
  excerpt: string;
  url: string;
  pubDate: string;
  author: string;
  tags: string[];
  heroImage?: string;
  heroImageAlt?: string;
  readingTime?: string;
  isFeatured: boolean;
}

/**
 * Transforms a raw blog post entry into a simplified View Model.
 * @param post The raw post data from the collection.
 * @param lang The current language for URL generation.
 * @param isFeatured Whether this post is being displayed as a featured item.
 * @returns A formatted BlogPostViewModel.
 */
export function createBlogPostViewModel(
  post: any,
  lang: string,
  isFeatured: boolean = false,
): BlogPostViewModel {
  // Logic: Prefer the explicit description, otherwise generate a snippet from the body
  const excerpt =
    post.data.description || (post.body ? post.body.slice(0, isFeatured ? 300 : 150) + '...' : '');

  return {
    title: post.data.title,
    excerpt,
    url: getPostUrl(post.slug, lang),
    pubDate: post.data.pubDate,
    author: post.data.author,
    tags: post.data.tags || [],
    heroImage: post.data.heroImage,
    heroImageAlt: post.data.heroImageAlt || post.data.title,
    readingTime: post.data.readingTime,
    isFeatured,
  };
}
