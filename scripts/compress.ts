/**
 * @file High-Performance Compression Script
 * @description Automatically generates .gz and .br (Brotli) versions of static assets.
 * This is meant to be run after the Astro build process.
 *
 * Junior Dev Tip: Pre-compressing your files helps servers (like Nginx or Cloudflare)
 * serve your site even faster, as they don't have to compress on-the-fly.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { performance } from 'perf_hooks';
import os from 'os';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

/**
 * List of file extensions that benefit from text-based compression.
 */
const SUPPORTED_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.xml',
  '.svg',
  '.txt',
  '.wasm',
  '.webmanifest',
]);

const DEFAULT_DIST_DIR = 'dist';

/**
 * Runs gzip and brotli in parallel for maximum efficiency.
 * @param data Buffer containing the file content.
 */
async function compressData(data: Buffer) {
  const gzipPromise = gzip(data, { level: zlib.constants.Z_BEST_COMPRESSION });
  const brotliPromise = brotliCompress(data, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Max quality (11) for smallest size
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
    },
  });
  return Promise.all([gzipPromise, brotliPromise]);
}

/**
 * Scans the output directory for compressible files.
 */
async function getCompressibleFiles(dir: string) {
  const extensions = Array.from(SUPPORTED_EXTENSIONS).map((ext) => ext.substring(1));
  const pattern = `**/*.{${extensions.join(',')}}`;
  return glob(pattern, { cwd: dir, absolute: true, nodir: true });
}

/**
 * Orchestrates the compression engine.
 * @param distDir The directory containing built assets.
 * @param options Verbosity and other settings.
 */
async function runCompressionEngine(distDir = DEFAULT_DIST_DIR, options = { verbose: false }) {
  const startTime = performance.now();
  console.log('🚀 Starting high-performance compression...');
  console.log(`🔍 Finding compressible files in: ${distDir}`);

  try {
    await fs.access(distDir);
  } catch (err) {
    console.error(`❌ Target directory not found: ${distDir}`);
    process.exit(1);
  }

  const files = await getCompressibleFiles(distDir);
  if (files.length === 0) {
    console.log('✅ No compressible files found. Exiting.');
    return;
  }

  console.log(`📦 Found ${files.length} files to compress.`);

  // Optimization: Use all available CPU cores
  const numWorkers = Math.min(os.cpus().length, files.length);
  console.log(`🏭 Initializing ${numWorkers} compression worker(s) for maximum efficiency.`);

  const queue = [...files];
  let compressedVariants = 0;
  let filesProcessed = 0;
  const allErrors: Array<{ filePath: string; error: string }> = [];

  /**
   * Worker function to process files from the queue.
   */
  const worker = async () => {
    while (true) {
      const filePath = queue.shift();
      if (!filePath) {
        return; // Work finished
      }

      try {
        const data = await fs.readFile(filePath);
        const [gzipData, brotliData] = await compressData(data);

        // Write compressed files back to disk in parallel
        const writeGzipPromise = fs.writeFile(`${filePath}.gz`, gzipData);
        const writeBrotliPromise = fs.writeFile(`${filePath}.br`, brotliData);

        await Promise.all([writeGzipPromise, writeBrotliPromise]);

        if (options.verbose) {
          const relativePath = path.relative(process.cwd(), filePath);
          console.log(`✅ Compressed: ${relativePath} (.gz, .br)`);
        }

        compressedVariants += 2;
      } catch (err: unknown) {
        console.error(`❌ Failed to compress: ${filePath}`, err);
        allErrors.push({ filePath, error: err instanceof Error ? err.message : String(err) });
      } finally {
        filesProcessed++;
        // Update progress bar in console
        const progress = ((filesProcessed / files.length) * 100).toFixed(0);
        process.stdout.write(
          `[${'#'.repeat(Math.floor(parseInt(progress) / 5)).padEnd(20, ' ')}] ${progress}% (${filesProcessed}/${files.length})\r`,
        );
      }
    }
  };

  // Start workers
  const workerPromises = Array.from({ length: numWorkers }, worker);
  await Promise.all(workerPromises);

  process.stdout.write('\n'); // Reset console cursor

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

  // Summary Report
  console.log('\n' + '-'.repeat(50));
  console.log('🏁 Compression Task Summary');
  console.log('-'.repeat(50));
  console.log(`- Files Scanned & Processed: ${filesProcessed}`);
  console.log(`- Compressed Variants Created: ${compressedVariants}`);
  console.log(`- Errors: ${allErrors.length}`);

  if (allErrors.length > 0) {
    console.log('\n🚨 Error Details:');
    allErrors.forEach((e) => {
      console.log(`  - File: ${e.filePath}\n    Error: ${e.error}`);
    });
  }

  console.log(`\n⏱️  Total Execution Time: ${duration}ms`);
  console.log('-'.repeat(50));

  if (allErrors.length > 0) {
    console.log('\n❌ Build finished with errors.');
    process.exit(1);
  } else {
    console.log('\n🎉 Build finished successfully.');
  }
}

// CLI entry point
if (import.meta.url.startsWith('file://') && process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const targetDir = args.find((arg) => !arg.startsWith('--')) || DEFAULT_DIST_DIR;
  const verbose = args.includes('--verbose');
  runCompressionEngine(targetDir, { verbose }).catch((err) => {
    console.error('An unhandled error occurred in the compression engine:', err);
    process.exit(1);
  });
}
