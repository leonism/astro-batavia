/**
 * @file RSS Feed Generator
 * @description Generates an RSS 2.0 feed for the blog content.
 *
 * Astro.js Tip: The '@astrojs/rss' package makes it easy to generate
 * standards-compliant RSS feeds. This feed helps users stay updated with
 * your latest content via RSS readers.
 */

import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_METADATA } from '../consts';
import { getPostUrl } from '@/i18n/utils';

/**
 * GET handler for the RSS feed.
 */
export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => {
    // Junior Dev Tip: Only include published posts in your feed!
    return !data.draft;
  });

  // Sort posts by date, newest first
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = context.site || new URL(SITE_METADATA.siteUrl);
  const rssUrl = new URL('rss.xml', site).href;

  return rss({
    stylesheet: '/rss.xsl',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
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

      // Junior Dev Tip: Adding media content allows RSS readers to display images.
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
