import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.href || 'https://your-blog.com';
  
  // Get all published blog posts
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  // Generate sitemap URLs
  const urls: string[] = [];
  
  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/search',
    '/es',
    '/es/blog', 
    '/es/search',
    '/ja',
    '/ja/blog',
    '/ja/search',
  ];
  
  staticPages.forEach(page => {
    urls.push(`
    <url>
      <loc>${siteUrl}${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`);
  });
  
  // Blog posts
  posts.forEach(post => {
    const lang = post.id.split('/')[0];
    const slug = post.slug.replace(`${lang}/`, '');
    const url = lang === 'en' 
      ? `${siteUrl}/blog/${slug}`
      : `${siteUrl}/${lang}/blog/${slug}`;
    
    const lastmod = post.data.updatedDate || post.data.pubDate;
    
    urls.push(`
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod.toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`);
  });
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
