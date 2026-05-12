import fs from 'fs/promises';

/**
 * @returns {import('astro').AstroIntegration}
 */
export default function sitemapHandler() {
  return {
    name: 'sitemap-handler',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        // 1. Rename sitemap-index.xml or sitemap-0.xml to sitemap.xml
        try {
          const indexPath = dir.pathname + 'sitemap-index.xml';
          const sitemap0Path = dir.pathname + 'sitemap-0.xml';
          const targetPath = dir.pathname + 'sitemap.xml';

          const indexExists = await fs
            .access(indexPath)
            .then(() => true)
            .catch(() => false);
          const sitemap0Exists = await fs
            .access(sitemap0Path)
            .then(() => true)
            .catch(() => false);

          if (indexExists) {
            await fs.copyFile(indexPath, targetPath);
            console.log('📦 Copied sitemap-index.xml → sitemap.xml');
          } else if (sitemap0Exists) {
            await fs.copyFile(sitemap0Path, targetPath);
            console.log('📦 Copied sitemap-0.xml → sitemap.xml');
          }
        } catch (renameError) {
          console.error('❌ Error renaming sitemap files:', renameError);
        }
      },
    },
  };
}
