import { getCollection, type CollectionEntry } from 'astro:content';
import { getPostUrl } from '@/i18n/utils';

export type BlogPost = CollectionEntry<'blog'>;

export class BlogService {
  /**
   * Retrieves all published blog posts.
   */
  static async getAllPosts(): Promise<BlogPost[]> {
    return await getCollection('blog', ({ data }) => !data.draft);
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
   * @param limit The maximum number of posts to return.
   */
  static async getLatestPosts(lang: string, limit: number = 3): Promise<BlogPost[]> {
    const posts = await this.getPostsByLang(lang);
    return posts.slice(0, limit);
  }

  /**
   * Retrieves posts filtered by a tag for a specific language.
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
   * Gets navigation links (previous/next) for a specific post.
   */
  static getPostNavigation(posts: BlogPost[], currentSlug: string, lang: string) {
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
   * Gets related posts based on tags.
   */
  static getRelatedPosts(posts: BlogPost[], currentSlug: string, currentTags: string[] = [], limit: number = 3): BlogPost[] {
    return posts
      .filter((post) => post.slug !== currentSlug)
      .filter((post) => post.data.tags && post.data.tags.some((tag) => currentTags.includes(tag)))
      .slice(0, limit);
  }

  /**
   * Generates static paths for all blog posts.
   * Useful for [lang]/blog/[...slug].astro getStaticPaths.
   */
  static async getStaticPaths() {
    const allPosts = await this.getAllPosts();
    const paths: Array<{ params: { lang: string; slug: string }; props: BlogPost }> = [];

    allPosts.forEach((post) => {
      const parts = post.id.split('/');
      const lang = parts[0];
      const slugPart = parts[1] === 'blog' ? parts.slice(2).join('/') : parts.slice(1).join('/');

      // Remove the file extension (.mdx or .md) from the slug part
      const finalSlug = slugPart.replace(/\.(mdx?)$/, '');

      paths.push({
        params: {
          lang: lang,
          slug: finalSlug // Use the carefully constructed slug
        },
        props: post,
      });
    });

    return paths;
  }
}
