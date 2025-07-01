import { minify } from 'html-minifier-terser';

export default function htmlMinifier() {
  return {
    name: 'html-minifier',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const { glob } = await import('glob');
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Find all HTML files in the dist directory
        const htmlFiles = await glob('**/*.html', {
          cwd: dir.pathname,
          absolute: true,
        });
        
        // Minify each HTML file
        for (const file of htmlFiles) {
          try {
            const content = await fs.readFile(file, 'utf-8');
            const minified = await minify(content, {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
              minifyCSS: true,
              minifyJS: true,
              removeEmptyAttributes: true,
              removeOptionalTags: true,
              sortAttributes: true,
              sortClassName: true,
            });
            
            await fs.writeFile(file, minified);
            console.log(`Minified: ${path.relative(dir.pathname, file)}`);
          } catch (error) {
            console.error(`Error minifying ${file}:`, error);
          }
        }
      },
    },
  };
}