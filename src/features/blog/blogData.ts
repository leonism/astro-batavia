import { getCollection, type CollectionEntry } from "astro:content";

// Define a type for a blog post for better type safety
export interface Post {
  id: string;
  slug: string;
  body: string;
  collection: "blog";
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    heroImage?: string;
    tags?: string[];
    draft?: boolean;
  };
  render: () => Promise<{
    Content: unknown;
    headings: { depth: number; slug: string; text: string }[];
    remarkPluginFrontmatter: Record<string, unknown>;
  }>;
}

/**
 * Fetches all English blog posts, filters out drafts, and sorts them by publication date.
 * @returns A promise that resolves to an array of sorted blog posts.
 */
export async function getSortedEnglishPosts(): Promise<Post[]> {
  const allPosts = await getCollection("blog", ({ id, data }: CollectionEntry<"blog">) => {
    return id.startsWith("en/") && !data.draft;
  });

  // Sort posts by publication date (newest first)
  const sortedPosts = allPosts.sort(
    (a: Post, b: Post) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return sortedPosts as Post[];
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
