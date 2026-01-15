/**
 * @file Blog Service
 * @description Domain service for interacting with the 'blog' content collection.
 * Provides abstraction for fetching, filtering, and sorting blog posts.
 *
 * Astro.js Tip: Content Collections are the best way to manage Markdown/MDX
 * content in Astro. They provide type-safety and automatic validation.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { getPostUrl } from '@/i18n/utils';
import { UI_CONFIG } from '@/consts';

/**
 * Type alias for a single blog post entry.
 */
export type BlogPost = CollectionEntry<'blog'>;

/**
 * Service class for blog-related operations.
 */
export class BlogService {
  /**
   * Retrieves all published (non-draft) blog posts.
   * @returns A promise resolving to an array of blog posts.
   */
  static async getAllPosts(): Promise<BlogPost[]> {
    // Astro Tip: getCollection filters posts at build time,
    // ensuring draft content is not included in production builds.
    return await getCollection('blog', ({ data }) => {
      // In production, we usually want to hide drafts
      return import.meta.env.PROD ? !data.draft : true;
    });
  }

  /**
   * Retrieves all published blog posts for a specific language.
   * @param lang The language code (e.g., 'en', 'es', 'ja').
   */
  static async getPostsByLang(lang: string): Promise<BlogPost[]> {
    const posts = await this.getAllPosts();
    return posts
      .filter((post) => post.slug.startsWith(`${lang}/`))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  }

  /**
   * Retrieves the latest blog posts for a specific language.
   * @param lang The language code.
   * @param limit The maximum number of posts to return. Defaults to UI_CONFIG.relatedPostsLimit.
   */
  static async getLatestPosts(
    lang: string,
    limit: number = UI_CONFIG.relatedPostsLimit,
  ): Promise<BlogPost[]> {
    const posts = await this.getPostsByLang(lang);
    return posts.slice(0, limit);
  }

  /**
   * Retrieves posts filtered by a specific tag.
   * @param lang The language code.
   * @param tag The tag to filter by.
   */
  static async getPostsByTag(lang: string, tag: string): Promise<BlogPost[]> {
    const posts = await this.getPostsByLang(lang);
    return posts.filter((post) => post.data.tags?.includes(tag));
  }

  /**
   * Retrieves unique tags from all posts in a specific language.
   * @param lang The language code.
   */
  static async getUniqueTags(lang: string): Promise<string[]> {
    const posts = await this.getPostsByLang(lang);
    const tags = new Set(posts.flatMap((post) => post.data.tags || []));
    return Array.from(tags).sort();
  }

  /**
   * Calculates navigation links (previous/next) for a specific post.
   * @param posts The list of posts to navigate through.
   * @param currentSlug The slug of the current post.
   * @param lang The current language.
   */
  static getPostNavigation(posts: BlogPost[], currentSlug: string, lang: string) {
    const sortedAsc = [...posts].sort(
      (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
    );
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
   * Finds related posts based on shared tags.
   */
  static getRelatedPosts(
    posts: BlogPost[],
    currentSlug: string,
    currentTags: string[] = [],
    limit: number = UI_CONFIG.relatedPostsLimit,
  ): BlogPost[] {
    return posts
      .filter((post) => post.slug !== currentSlug)
      .filter((post) => post.data.tags && post.data.tags.some((tag) => currentTags.includes(tag)))
      .sort((a, b) => {
        // Sort by number of matching tags
        const aMatches = a.data.tags.filter((tag) => currentTags.includes(tag)).length;
        const bMatches = b.data.tags.filter((tag) => currentTags.includes(tag)).length;
        return bMatches - aMatches;
      })
      .slice(0, limit);
  }
}
