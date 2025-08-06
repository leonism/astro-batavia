import { minify } from 'html-minifier-terser';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { performance } from 'perf_hooks';

/**
 * @returns {import('astro').AstroIntegration}
 */
export default function htmlMinifier() {
  return {
    name: 'enterprise-html-minifier',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const startTime = performance.now();
        console.log('🚀 Starting enterprise-grade HTML minification...');

        const htmlFiles = await glob('**/*.html', {
          cwd: dir.pathname,
          absolute: true,
        });

        if (htmlFiles.length === 0) {
          console.log('✅ No HTML files found to minify. Exiting.');
          return;
        }

        console.log(`📦 Found ${htmlFiles.length} HTML files to minify.`);

        const numWorkers = Math.min(os.cpus().length, htmlFiles.length);
        console.log(`🏭 Initializing ${numWorkers} minification worker(s) for maximum efficiency.`);

        const queue = [...htmlFiles];
        let processedCount = 0;
        /** @type {{ file: string; error: Error }[]} */
        const errors = [];

        const worker = async () => {
          while (queue.length > 0) {
            const file = queue.shift();
            if (!file) continue;

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
              console.log(`✅ Minified: ${path.relative(dir.pathname, file)}`);
            } catch (error) {
              console.error(`❌ Error minifying ${file}:`, error);
              const err = error instanceof Error ? error : new Error(String(error));
              errors.push({ file, error: err });
            } finally {
              processedCount++;
            }
          }
        };

        const workerPromises = Array.from({ length: numWorkers }, worker);
        await Promise.all(workerPromises);

        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);

        console.log('\n' + '-'.repeat(50));
        console.log('🏁 HTML Minification Summary');
        console.log('-'.repeat(50));
        console.log(`- Files Scanned: ${htmlFiles.length}`);
        console.log(`- Files Processed: ${processedCount}`);
        console.log(`- Files with Errors: ${errors.length}`);

        if (errors.length > 0) {
          console.log('\n🚨 Error Details:');
          errors.forEach(e => {
            console.log(`  - File: ${e.file}\n    Error: ${e.error.message}`);
          });
          // Throwing an error will stop the build process in Astro
          throw new Error('HTML minification failed for one or more files.');
        } else {
          console.log(`\n⏱️ Total Execution Time: ${duration}ms`);
          console.log('🎉 HTML minification completed successfully.');
        }
      },
    },
  };
}
