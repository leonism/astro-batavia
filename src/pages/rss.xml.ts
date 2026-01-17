import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPostUrl } from '@/i18n/utils';
import { BlogService } from '@/services/BlogService';

export async function GET(context: APIContext) {
  const posts = await BlogService.getAllPosts();

  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = context.site || new URL('https://astro-batavia.pages.dev');
  const rssUrl = new URL('rss.xml', site).href;

  return rss({
    stylesheet: '/rss.xsl',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      media: 'http://search.yahoo.com/mrss/',
    },
    customData: `
      <language>en-us</language>
      <atom:link href="${rssUrl}" rel="self" type="application/rss+xml" />
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    `.trim(),
    items: posts.map((post) => {
      const lang = post.slug.split('/')[0];
      const heroImage = post.data.heroImage;
      let mediaContent = '';

      if (heroImage) {
        const imageUrl = heroImage.startsWith('http') ? heroImage : new URL(heroImage, site).href;
        mediaContent = `<media:content url="${imageUrl}" medium="image" />`;
      }

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: getPostUrl(post.slug, lang),
        customData: mediaContent,
      };
    }),
  });
}
