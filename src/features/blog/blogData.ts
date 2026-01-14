import { getCollection, type CollectionEntry } from "astro:content";
import { getPostUrl } from "@/i18n/utils";

// Define a type for a blog post for better type safety
export type Post = CollectionEntry<"blog">;

/**
 * Fetches all blog posts for a specific language, filters out drafts, and sorts them by publication date.
 */
export async function getSortedPostsByLang(lang: string): Promise<Post[]> {
  const allPosts = await getCollection("blog", (entry: Post) => {
    return entry.slug.startsWith(`${lang}/`) && !entry.data.draft;
  });

  return allPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Finds the previous and next posts for a given slug within a sorted array of posts.
 */
export function getPostNavigation(posts: Post[], currentSlug: string, lang: string) {
  const sortedAsc = [...posts].sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  const currentIndex = sortedAsc.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) return { prev: undefined, next: undefined };

  const prev = currentIndex > 0 ? sortedAsc[currentIndex - 1] : undefined;
  const next = currentIndex < sortedAsc.length - 1 ? sortedAsc[currentIndex + 1] : undefined;

  return {
    previousPostData: prev ? { url: getPostUrl(prev.slug, lang), title: prev.data.title } : undefined,
    nextPostData: next ? { url: getPostUrl(next.slug, lang), title: next.data.title } : undefined,
  };
}

/**
 * Gets up to 3 related posts based on shared tags.
 */
export function getRelatedPosts(posts: Post[], currentSlug: string, currentTags: string[] = []) {
  return posts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.data.tags && post.data.tags.some((tag) => currentTags.includes(tag)))
    .slice(0, 3);
}

/**
 * Fetches all English blog posts, filters out drafts, and sorts them by publication date.
 * @returns A promise that resolves to an array of sorted blog posts.
 */
export async function getSortedEnglishPosts(): Promise<Post[]> {
  return getSortedPostsByLang("en");
}

/**
 * Extracts all unique tags from a list of posts.
 * @param posts - An array of blog posts.
 * @returns An array of unique tag strings.
 */
export function getAllUniqueTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags || []))];
}

export const POSTS_PER_PAGE = 9;