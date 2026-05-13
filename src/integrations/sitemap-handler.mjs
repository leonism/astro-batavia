import fs from 'fs/promises';

/**
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

          if (sitemap0Exists) {
            // 1. Read the content from the first sitemap part
            const content = await fs.readFile(sitemap0Path, 'utf-8');
            
            // 2. Write the final sitemap.xml exactly as Astro generated it
            // Astro already includes all necessary xmlns namespaces and valid XML declaration.
            await fs.writeFile(targetPath, content);
            console.log('✅ Renamed sitemap-0.xml to sitemap.xml');

            // 3. Clean up ALL temporary files
            await fs.unlink(sitemap0Path).catch(() => {});
            await fs.unlink(indexPath).catch(() => {});
            
            const files = await fs.readdir(dir);
            for (const file of files) {
              if (file.startsWith('sitemap-') && file.endsWith('.xml')) {
                await fs.unlink(new URL(file, dir)).catch(() => {});
              }
            }
          }
        } catch (error) {
          console.error('❌ Error refactoring sitemap:', error);
        }
      },
    },
  };
}
