import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

async function main() {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // Keep code blocks intact if possible, or remove them, turndown handles them ok.

  const htmlFiles = await glob('**/*.html', { cwd: DIST_DIR, absolute: true });

  for (const filePath of htmlFiles) {
    if (filePath.includes('/admin/')) continue; // Skip Decap CMS

    let htmlContent = await fs.readFile(filePath, 'utf-8');

    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    const relativePath = path.relative(DIST_DIR, filePath);
    // "en/services/index.html" -> "/en/services/index.md"
    let mdRelativePath = '/' + relativePath.replace(/\.html$/, '.md');
    // Normalize windows separators just in case
    mdRelativePath = mdRelativePath.replace(/\\/g, '/');

    const mdFilePath = filePath.replace(/\.html$/, '.md');

    // 1. Inject link tag
    if (!document.querySelector('link[type="text/markdown"]')) {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.type = 'text/markdown';
      link.href = mdRelativePath;
      link.title = 'Markdown version';
      document.head.appendChild(link);

      await fs.writeFile(filePath, dom.serialize(), 'utf-8');
    }

    // 2. Extract content for markdown
    let contentNode = document.querySelector('main');
    if (!contentNode) {
      contentNode = document.body;
    }

    // Clone the node so we don't modify the HTML file content if we serialized later
    // but we already serialized, so it's safe to mutate contentNode
    const unwantedSelectors = [
      'nav',
      'footer',
      'script',
      'style',
      'noscript',
      '.no-print',
      '#cookie-banner',
      '[role="navigation"]',
      'aside',
    ];
    unwantedSelectors.forEach((selector) => {
      contentNode.querySelectorAll(selector).forEach((el: Element) => el.remove());
    });

    const markdown = turndownService.turndown(contentNode.innerHTML);

    // Save markdown file
    await fs.writeFile(mdFilePath, markdown, 'utf-8');
    console.log(`Generated Markdown for ${mdRelativePath}`);
  }
}

main().catch(console.error);
