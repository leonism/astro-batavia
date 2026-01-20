import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Service for handling blog post logic and data fetching.
 * Extracts business logic from Astro components to ensure Clean Architecture.
 */
export class BlogService {
  /**
   * Retrieves the latest blog posts for a specific language.
   * Filters out drafts (unless in dev mode, but typically handled by content collections config or here if needed)
   * and sorts by publication date.
   *
   * @param {string} lang - The language code (e.g., 'en', 'es', 'ja').
   * @param {number} limit - The maximum number of posts to return.
   * @returns {Promise<CollectionEntry<'blog'>[]>} A promise that resolves to an array of blog post entries.
   */
  static async getLatestPosts(lang: string, limit: number): Promise<CollectionEntry<'blog'>[]> {
    const allPosts = await getCollection('blog', (post) => {
      // Ensure post belongs to the requested language and is not a draft
      // Assuming slug format or id starts with lang/
      return post.id.startsWith(`${lang}/`) && !post.data.draft;
    });

    const sortedPosts = allPosts.sort(
      (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    );

    return sortedPosts.slice(0, limit);
  }

  /**
   * Retrieves all blog posts for a specific language, sorted by date.
   *
   * @param {string} lang - The language code.
   * @returns {Promise<CollectionEntry<'blog'>[]>} A promise that resolves to all sorted blog posts.
   */
  static async getPostsByLocale(lang: string): Promise<CollectionEntry<'blog'>[]> {
    const allPosts = await getCollection('blog', (post) => {
      return post.id.startsWith(`${lang}/`) && !post.data.draft;
    });

    return allPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  }

  /**
   * Alias for getPostsByLocale to maintain backward compatibility.
   * @deprecated Use getPostsByLocale instead.
   */
  static async getPostsByLang(lang: string): Promise<CollectionEntry<'blog'>[]> {
    return BlogService.getPostsByLocale(lang);
  }

  /**
   * Calculates previous and next post navigation for a given post.
   *
   * @param {CollectionEntry<'blog'>[]} allPosts - The sorted list of all posts.
   * @param {string} currentSlug - The slug of the current post.
   * @returns {{ previousPost: CollectionEntry<'blog'> | null, nextPost: CollectionEntry<'blog'> | null }} The previous and next posts.
   */
  static getPostNavigation(allPosts: CollectionEntry<'blog'>[], currentSlug: string) {
    const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);
    
    // Determine next and previous posts
    // Note: Since posts are sorted descending by date (newest first),
    // next index is older (Next Post in UI usually means next in sequence, but often blogs show "Next" as newer)
    // Actually, "Next Article" usually means the one published after (newer), and "Previous" means older.
    // If list is [Newest, ..., Oldest]
    // Previous in array (index - 1) is Newer. Next in array (index + 1) is Older.
    // Let's standardise: Next = Newer (index - 1), Previous = Older (index + 1)
    
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    return { previousPost, nextPost };
  }

  /**
   * Finds related posts based on tags.
   *
   * @param {CollectionEntry<'blog'>[]} allPosts - The list of all posts to search within.
   * @param {string} currentSlug - The slug of the current post to exclude.
   * @param {string[]} tags - The tags of the current post.
   * @param {number} limit - The maximum number of related posts to return (default 3).
   * @returns {CollectionEntry<'blog'>[]} An array of related posts.
   */
  static getRelatedPosts(allPosts: CollectionEntry<'blog'>[], currentSlug: string, tags: string[] = [], limit: number = 3): CollectionEntry<'blog'>[] {
    if (!tags || tags.length === 0) return [];

    const relatedPosts = allPosts.filter((post) => {
      if (post.slug === currentSlug) return false;
      const otherTags = post.data.tags || [];
      return tags.some((tag) => otherTags.includes(tag));
    });

    // Sort by number of matching tags, then date
    relatedPosts.sort((a, b) => {
      const aCommonTags = (a.data.tags || []).filter((tag) => tags.includes(tag)).length;
      const bCommonTags = (b.data.tags || []).filter((tag) => tags.includes(tag)).length;
      
      if (bCommonTags !== aCommonTags) {
        return bCommonTags - aCommonTags;
      }
      return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    });

    return relatedPosts.slice(0, limit);
  }

  /**
   * Retrieves all unique tags for a specific language.
   *
   * @param {string} lang - The language code.
   * @returns {Promise<string[]>} A promise that resolves to an array of unique tags.
   */
  static async getUniqueTags(lang: string): Promise<string[]> {
    const allPosts = await BlogService.getPostsByLocale(lang);
    const tags = new Set<string>();
    
    allPosts.forEach((post) => {
      if (post.data.tags) {
        post.data.tags.forEach((tag) => tags.add(tag));
      }
    });

    return Array.from(tags);
  }


  

      /**


  

       * Retrieves all blog posts across all languages, sorted by date.


  

       * Useful for RSS feeds and search indexing.


  

       *


  

       * @returns {Promise<CollectionEntry<'blog'>[]>} A promise that resolves to all sorted blog posts.


  

       */


  

      static async getAllPosts(): Promise<CollectionEntry<'blog'>[]> {


  

        const allPosts = await getCollection('blog', (post) => {


  

          return !post.data.draft;


  

        });


  

    


  

        return allPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());


  

      }


  

    


  

      /**


  

       * Retrieves all posts for a specific language filtered by a tag.


  

       *


  

       * @param {string} lang - The language code.


  

       * @param {string} tagSlugOrName - The tag to filter by (slugified or raw).


  

       * @returns {Promise<CollectionEntry<'blog'>[]>} A promise that resolves to an array of filtered blog posts.


  

       */


  

      static async getPostsByTag(lang: string, tagSlugOrName: string): Promise<CollectionEntry<'blog'>[]> {


  

        const allPosts = await BlogService.getPostsByLocale(lang);


  

        const { slugifyTag } = await import('@/i18n/utils');


  

    


  

        return allPosts.filter((post) => {


  

          const postTags = post.data.tags || [];


  

          return postTags.some(t => slugifyTag(t) === tagSlugOrName || t === tagSlugOrName);


  

        });


  

      }


  

    


  

        /**


  

    


  

         * Retrieves popular tags and their counts for a specific language.


  

    


  

         *


  

    


  

         * @param {string} lang - The language code.


  

    


  

         * @param {number} limit - The maximum number of tags to return.


  

    


  

         * @returns {Promise<{ tag: string; count: number }[]>} A promise that resolves to an array of tags with counts.


  

    


  

         */


  

    


  

        static async getPopularTags(lang: string, limit: number = 10): Promise<{ tag: string; count: number }[]> {


  

    


  

          const allPosts = await BlogService.getPostsByLocale(lang);


  

    


  

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


  

    


  

        }


  

    


  

      


  

    


  

          /**


  

    


  

      


  

    


  

           * Generates static paths for tag pages.


  

    


  

      


  

    


  

           * 


  

    


  

      


  

    


  

           * @returns {Promise<Array<{ params: { lang: string; tag: string }, props: { tag: string } }>>}


  

    


  

      


  

    


  

           */


  

    


  

      


  

    


  

          static async getStaticTagPaths(): Promise<Array<{ params: { lang: string; tag: string }, props: { tag: string } }>> {


  

    


  

      


  

    


  

            const { slugifyTag } = await import('@/i18n/utils');


  

    


  

      


  

    


  

            const languages = ['en', 'es', 'ja']; // Should ideally come from config


  

    


  

      


  

    


  

            const paths = [];


  

    


  

      


  

    


  

        


  

    


  

      


  

    


  

            for (const lang of languages) {


  

    


  

      


  

    


  

              const uniqueTags = await BlogService.getUniqueTags(lang);


  

    


  

      


  

    


  

              


  

    


  

      


  

    


  

              for (const tag of uniqueTags) {


  

    


  

      


  

    


  

                const tagSlug = slugifyTag(tag);


  

    


  

      


  

    


  

                if (tagSlug) {


  

    


  

      


  

    


  

                  paths.push({


  

    


  

      


  

    


  

                    params: { lang, tag: tagSlug },


  

    


  

      


  

    


  

                    props: { tag: tag }, // Pass original tag name for display if needed, but the slug is in params


  

    


  

      


  

    


  

                  });


  

    


  

      


  

    


  

                }


  

    


  

      


  

    


  

              }


  

    


  

      


  

    


  

            }


  

    


  

      


  

    


  

            return paths;


  

    


  

      


  

    


  

          }


  

    


  

      


  

    


  

        


  

    


  

      


  

    


  

          /**


  

    


  

      


  

    


  

           * Generates static paths for all blog posts.


  

    


  

      


  

    


  

           * Used in [lang]/blog/[...slug].astro.


  

    


  

      


  

    


  

           * 


  

    


  

      


  

    


  

           * @returns {Promise<Array<{ params: { lang: string; slug: string }, props: CollectionEntry<'blog'> }>>}


  

    


  

      


  

    


  

           */


  

    


  

      


  

    


  

          static async getStaticPaths(): Promise<Array<{ params: { lang: string; slug: string }, props: CollectionEntry<'blog'> }>> {


  

    


  

      


  

    


  

            const posts = await BlogService.getAllPosts();


  

    


  

      


  

    


  

            return posts.map((post) => {


  

    


  

      


  

    


  

              const [lang, ...slugParts] = post.slug.split('/');


  

    


  

      


  

    


  

              const slug = slugParts.join('/');


  

    


  

      


  

    


  

              return {


  

    


  

      


  

    


  

                params: { lang, slug },


  

    


  

      


  

    


  

                props: post,


  

    


  

      


  

    


  

              };


  

    


  

      


  

    


  

            });


  

    


  

      


  

    


  

          }


  

    


  

      


  

    


  

        }


  

    


  

      


  

    


  

        


  

    


  

      

  