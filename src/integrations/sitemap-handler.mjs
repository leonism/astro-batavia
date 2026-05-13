import fs from 'fs/promises';

/**
 * Astro integration to refactor the generated sitemap.
 * By default, @astrojs/sitemap generates sitemap-index.xml and sitemap-0.xml (when i18n is enabled).
 * This integration ensures we have a single, clean, and properly formatted sitemap.xml.
 * 
 * @returns {import('astro').AstroIntegration}
 */
export default function sitemapHandler() {
  return {
    name: 'sitemap-handler',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          const indexPath = new URL('sitemap-index.xml', dir);
          const sitemap0Path = new URL('sitemap-0.xml', dir);
          const targetPath = new URL('sitemap.xml', dir);

          const sitemap0Exists = await fs.access(sitemap0Path).then(() => true).catch(() => false);
          const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
          const sitemapExists = await fs.access(targetPath).then(() => true).catch(() => false);

          // If we have an index and the first part, but no sitemap.xml yet,
          // we consolidate them into a single sitemap.xml.
          if (indexExists && sitemap0Exists && !sitemapExists) {
            const content = await fs.readFile(sitemap0Path, 'utf-8');
            
            // Format XML: add newlines between tags to avoid extremely long lines
            // which can cause issues with some SEO tools and validators.
            const formattedContent = content
              .replace(/></g, '>\n<')
              .replace(/<\?xml(.*?)\?>/, '<?xml$1?>\n');

            await fs.writeFile(targetPath, formattedContent);
            console.log('✅ Created consolidated and formatted sitemap.xml');

            // Clean up temporary files
            await fs.unlink(sitemap0Path).catch(() => {});
            await fs.unlink(indexPath).catch(() => {});
          } else if (indexExists && !sitemapExists) {
            // If only index exists, rename it to sitemap.xml
            await fs.rename(indexPath, targetPath);
            console.log('✅ Renamed sitemap-index.xml to sitemap.xml');
          }

          // Final cleanup: remove any remaining sitemap-*.xml files except the final sitemap.xml
          const files = await fs.readdir(dir);
          for (const file of files) {
            if (file.startsWith('sitemap-') && file.endsWith('.xml') && file !== 'sitemap.xml') {
              await fs.unlink(new URL(file, dir)).catch(() => {});
            }
          }
        } catch (error) {
          console.error('❌ Error refactoring sitemap:', error);
        }
      },
    },
  };
}
