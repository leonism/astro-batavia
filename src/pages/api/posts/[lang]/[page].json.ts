import type { APIRoute } from 'astro';
import { BlogService } from '@/services/BlogService';
import { ContentService } from '@/services/ContentService';
import { PAGINATION_POSTS_PER_PAGE } from '@/consts';
import { getPostUrl } from '@/i18n/utils';

export async function getStaticPaths() {
  const languages = ['en', 'es', 'ja'];
  const paths = [];

  for (const lang of languages) {
    const posts = await BlogService.getPostsByLang(lang);
    const totalPages = Math.ceil(posts.length / PAGINATION_POSTS_PER_PAGE);

    // Generate a path for each page
    // Start from page 2 because page 1 is rendered by the Astro component
    // But LoadMore might request page 1 if logic is weird? No, usually next page.
    // However, for completeness and testing, we can generate all.
    // The Client requests `nextPage`.
    for (let i = 1; i <= totalPages; i++) {
      paths.push({
        params: { lang, page: i.toString() },
        props: {
          posts: posts.slice((i - 1) * PAGINATION_POSTS_PER_PAGE, i * PAGINATION_POSTS_PER_PAGE),
          lang,
        },
      });
    }
  }
  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const { posts, lang } = props as { posts: any[]; lang: string };

  const postsData = posts.map((post: any) => ({
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
    excerpt: ContentService.getExcerpt(post.body, post.data.description, 150),
  }));

  return new Response(JSON.stringify(postsData), {
    headers: { 'Content-Type': 'application/json' },
  });
};
