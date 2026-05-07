import fs from 'fs/promises';
import { glob } from 'glob';

/**
 * @returns {import('astro').AstroIntegration}
 */
export default function sitemapStyler() {
  return {
    name: 'sitemap-styler',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const sitemapFiles = await glob('sitemap*.xml', {
          cwd: dir.pathname,
          absolute: true,
        });

        for (const file of sitemapFiles) {
          try {
            let content = await fs.readFile(file, 'utf-8');

            // 1. Add XSL stylesheet reference if not present
            if (!content.includes('<?xml-stylesheet')) {
              content = content.replace(
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
              );
            }

            // 2. Simple pretty print (add a newline after tags to make it readable in source)
            // This is a very basic replacement as a full XML parser would be heavy here
            content = content.replace(/></g, '>\n<');

            await fs.writeFile(file, content);
            console.log(`✨ Applied styling to: ${file.split('/').pop()}`);
          } catch (error) {
            console.error(`❌ Error styling sitemap ${file}:`, error);
          }
        }

        // 3. Rename sitemap-index.xml or sitemap-0.xml to sitemap.xml
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
            await fs.rename(indexPath, targetPath);
            console.log('📦 Renamed sitemap-index.xml to sitemap.xml');
          } else if (sitemap0Exists) {
            await fs.rename(sitemap0Path, targetPath);
            console.log('📦 Renamed sitemap-0.xml to sitemap.xml');
          }
        } catch (renameError) {
          console.error('❌ Error renaming sitemap files:', renameError);
        }
      },
    },
  };
}
