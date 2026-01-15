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
      },
    },
  };
}
