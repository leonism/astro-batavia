import type { APIContext } from "astro";
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPostUrl } from "@/i18n/utils";

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site || 'https://example.com', // Provide a default or handle undefined
    items: posts.map((post) => {
      const lang = post.slug.split('/')[0];
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: getPostUrl(post.slug, lang),
      };
    }),
  });
}
