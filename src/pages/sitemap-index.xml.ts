import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${url.origin}/sitemap-0.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
