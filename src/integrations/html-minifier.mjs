import { minify } from 'html-minifier-terser';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { performance } from 'perf_hooks';

/**
 * @param {import('html-minifier-terser').Options} [userOptions]
 * @returns {import('astro').AstroIntegration}
 */
export default function htmlMinifier(userOptions = {}) {
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
        let totalOriginalSize = 0;
        let totalMinifiedSize = 0;
        /** @type {{ file: string; error: Error }[]} */
        const errors = [];

        const defaultOptions = {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          html5: true,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeOptionalTags: false,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          sortAttributes: true,
          sortClassName: true,
          useShortDoctype: true,
        };

        const minifyOptions = { ...defaultOptions, ...userOptions };

        const worker = async () => {
          while (queue.length > 0) {
            const file = queue.shift();
            if (!file) continue;

            try {
              const content = await fs.readFile(file, 'utf-8');
              const originalSize = Buffer.byteLength(content, 'utf-8');
              totalOriginalSize += originalSize;

              const minified = await minify(content, minifyOptions);
              const minifiedSize = Buffer.byteLength(minified, 'utf-8');
              totalMinifiedSize += minifiedSize;

              await fs.writeFile(file, minified);
              const saved = originalSize - minifiedSize;
              const savedPercent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
              console.log(`✅ Minified: ${path.relative(dir.pathname, file)} | Saved: ${formatBytes(saved)} (${savedPercent.toFixed(2)}%)`);
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
        const totalSaved = totalOriginalSize - totalMinifiedSize;
        const totalSavedPercent = totalOriginalSize > 0 ? (totalSaved / totalOriginalSize) * 100 : 0;

        console.log('\n' + '-'.repeat(50));
        console.log('🏁 HTML Minification Summary');
        console.log('-'.repeat(50));
        console.log(`- Files Scanned: ${htmlFiles.length}`);
        console.log(`- Files Processed: ${processedCount}`);
        console.log(`- Files with Errors: ${errors.length}`);
        console.log(`- Original Size: ${formatBytes(totalOriginalSize)}`);
        console.log(`- Minified Size: ${formatBytes(totalMinifiedSize)}`);
        console.log(`- Total Saved: ${formatBytes(totalSaved)} (${totalSavedPercent.toFixed(2)}%)`);

        if (errors.length > 0) {
          console.log('\n🚨 Error Details:');
          errors.forEach(e => {
            console.log(`  - File: ${e.file}\n    Error: ${e.error.message}`);
          });
          throw new Error('HTML minification failed for one or more files.');
        } else {
          console.log(`\n⏱️ Total Execution Time: ${duration}ms`);
          console.log('🎉 HTML minification completed successfully.');
        }
      },
    },
  };
}

function formatBytes(/** @type {number} */ bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
