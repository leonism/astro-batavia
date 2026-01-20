import { getCollection, type CollectionEntry } from 'astro:content';
import { getPostUrl, slugifyTag } from '@/i18n/utils';
import { LOCALES } from '@/consts';

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
    return posts.filter((post) => {
      if (!post.data.tags) return false;
      return post.data.tags.some((t) => slugifyTag(t) === tag);
    });
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
            heroImage: prev.data.heroImage,
            heroImageAlt: prev.data.heroImageAlt,
          }
        : undefined,
      nextPostData: next
        ? {
            url: getPostUrl(next.slug, lang),
            title: next.data.title,
            heroImage: next.data.heroImage,
            heroImageAlt: next.data.heroImageAlt,
          }
        : undefined,
    };
  }

  /**
   * Gets related posts based on tags.
   */
  static getRelatedPosts(
    posts: BlogPost[],
    currentSlug: string,
    currentTags: string[] = [],
    limit: number = 3,
  ): BlogPost[] {
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
      // Extract language from the file ID (folder structure)
      const parts = post.id.split('/');
      const lang = parts[0];

      // Use post.slug as the source of truth for the URL slug
      let finalSlug = post.slug;

      // Strip the language prefix if present (e.g. "en/my-post" -> "my-post")
      if (finalSlug.startsWith(`${lang}/`)) {
        finalSlug = finalSlug.slice(lang.length + 1);
      }

      // Strip the "blog/" prefix if present (e.g. "blog/my-post" -> "my-post")
      // This handles cases where the slug in frontmatter includes "blog/"
      if (finalSlug.startsWith('blog/')) {
        finalSlug = finalSlug.slice(5);
      }

      paths.push({
        params: {
          lang: lang,
          slug: finalSlug,
        },
        props: post,
      });
    });

    return paths;
  }

  /**
   * Generates static paths for all tags.
   * Useful for [lang]/blog/tags/[tag].astro getStaticPaths.
   */
  static async getStaticTagPaths() {
    const languages = Object.keys(LOCALES);
    const paths = [];

    for (const lang of languages) {
      const tags = await this.getUniqueTags(lang);

      // Use a Set to ensure unique slugs per language
      const uniqueSlugs = new Set();

      for (const tag of tags) {
        const slug = slugifyTag(tag);
        if (slug && !uniqueSlugs.has(slug)) {
          uniqueSlugs.add(slug);
          paths.push({
            params: { lang, tag: slug },
            props: { tag },
          });
        }
      }
    }
    return paths;
  }
}
