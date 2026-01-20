import type { APIRoute } from 'astro';
import { BlogService } from '@/services/BlogService';
import { PAGINATION_POSTS_PER_PAGE } from '@/consts';
import { getPostUrl, slugifyTag } from '@/i18n/utils';
import { getExcerpt } from '@/utils/content-helpers';

export async function getStaticPaths() {
  const languages = ['en', 'es', 'ja'];
  const paths = [];

  for (const lang of languages) {
    const tags = await BlogService.getUniqueTags(lang);
    
    for (const tag of tags) {
        const tagSlug = slugifyTag(tag);
        if (!tagSlug) continue;

        const posts = await BlogService.getPostsByTag(lang, tagSlug);
        const totalPages = Math.ceil(posts.length / PAGINATION_POSTS_PER_PAGE);

        for (let i = 1; i <= totalPages; i++) {
            paths.push({
                params: { lang, tag: tagSlug, page: i.toString() },
                props: { 
                    posts: posts.slice((i - 1) * PAGINATION_POSTS_PER_PAGE, i * PAGINATION_POSTS_PER_PAGE),
                    lang 
                },
            });
        }
    }
  }
  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const { posts, lang } = props;
  
  const postsData = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.data.title,
    author: post.data.author,
    pubDate: post.data.pubDate,
    description: post.data.description,
    heroImage: post.data.heroImage,
    heroImageAlt: post.data.heroImageAlt,
    tags: post.data.tags,
    readingTime: post.data.readingTime,
    url: getPostUrl(post.slug, lang),
    excerpt: getExcerpt(post.body, post.data.description, 150),
  }));

  return new Response(JSON.stringify(postsData), {
    headers: { 'Content-Type': 'application/json' },
  });
};
