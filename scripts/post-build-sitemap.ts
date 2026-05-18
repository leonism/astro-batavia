import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

async function processSitemaps() {
  console.log('📄 Processing sitemaps for browser presentation...');
  
  try {
    const files = await fs.readdir(DIST_DIR, { withFileTypes: true });
    const sitemapFiles = files
      .filter(dirent => dirent.isFile() && dirent.name.startsWith('sitemap') && dirent.name.endsWith('.xml'))
      .map(dirent => dirent.name);

    for (const file of sitemapFiles) {
      const filePath = path.join(DIST_DIR, file);
      let content = await fs.readFile(filePath, 'utf-8');

      // Inject stylesheet if not present
      if (!content.includes('xml-stylesheet')) {
        content = content.replace(
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'
        );
        await fs.writeFile(filePath, content);
        console.log(`✅ Injected stylesheet into: ${file}`);
      }
    }

    // Ensure sitemap.xml exists (copy index if it exists, otherwise copy sitemap-0)
    const indexFile = path.join(DIST_DIR, 'sitemap-index.xml');
    const zeroFile = path.join(DIST_DIR, 'sitemap-0.xml');
    const mainSitemap = path.join(DIST_DIR, 'sitemap.xml');

    try {
      await fs.access(indexFile);
      await fs.rm(mainSitemap, { recursive: true, force: true });
      await fs.copyFile(indexFile, mainSitemap);
      console.log('✅ Created sitemap.xml as a copy of sitemap-index.xml');
    } catch {
      try {
        await fs.access(zeroFile);
        await fs.rm(mainSitemap, { recursive: true, force: true });
        await fs.copyFile(zeroFile, mainSitemap);
        console.log('✅ Created sitemap.xml as a copy of sitemap-0.xml');
      } catch (err) {
        console.warn('⚠️ No sitemap files found to copy to sitemap.xml');
      }
    }
  } catch (err) {
    console.error('❌ Error processing sitemaps:', err);
  }
}

processSitemaps();
