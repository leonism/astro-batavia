import { promises as fs } from 'fs';
import * as path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { performance } from 'perf_hooks';
import os from 'os';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { compress as zstdCompress } from 'zstd-napi';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

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

// Runs gzip, brotli and zstd in parallel for a single file's data
async function compressData(data: Buffer, extension: string) {
  const gzipPromise = gzip(data, { level: zlib.constants.Z_BEST_COMPRESSION });

  const brotliMode =
    extension === '.wasm' ? zlib.constants.BROTLI_MODE_GENERIC : zlib.constants.BROTLI_MODE_TEXT;

  const brotliPromise = brotliCompress(data, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Max quality
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      [zlib.constants.BROTLI_PARAM_LGWIN]: 24, // Max window size for better compression on large files
      [zlib.constants.BROTLI_PARAM_MODE]: brotliMode,
    },
  });

  // zstdCompress from zstd-napi is synchronous but very fast at lower levels.
  // At level 22 it is slow, so we wrap it to keep the async flow.
  const zstdPromise = Promise.resolve().then(() =>
    zstdCompress(data, {
      compressionLevel: 22,
      enableLongDistanceMatching: true, // Helps with larger files
    }),
  );

  // Await all promises to run them in parallel
  return Promise.all([gzipPromise, brotliPromise, zstdPromise]);
}

// Finds all files matching the supported extensions using glob
async function getCompressibleFiles(dir: string) {
  const extensions = Array.from(SUPPORTED_EXTENSIONS).map((ext) => ext.substring(1));
  const pattern = `**/*.{${extensions.join(',')}}`;
  // Use glob for faster file discovery
  const files = await glob(pattern, { cwd: dir, absolute: true, nodir: true });

  // Explicitly add search-index file without extension
  const searchIndexPath = path.join(dir, 'api', 'search-index');
  try {
    await fs.access(searchIndexPath);
    files.push(searchIndexPath);
  } catch {
    // Ignore if not found
  }

  return files;
}

async function runCompressionEngine(distDir = DEFAULT_DIST_DIR, options = { verbose: false }) {
  const startTime = performance.now();
  console.log('🚀 Starting ultra-high-performance compression...');
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

  const numWorkers = Math.min(os.cpus().length, files.length);
  console.log(`🏭 Initializing ${numWorkers} compression worker(s) for maximum efficiency.`);

  const queue = [...files];
  let compressedVariants = 0;
  let filesProcessed = 0;
  const allErrors: Array<{ filePath: string; error: string }> = [];

  const worker = async () => {
    while (true) {
      const filePath = queue.shift();
      if (!filePath) {
        return; // No more files
      }

      try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        const [gzipData, brotliData, zstdData] = await compressData(data, ext);

        const writePromises: Promise<void>[] = [];
        let savedVariantsForFile = 0;

        if (gzipData.length < data.length) {
          writePromises.push(fs.writeFile(`${filePath}.gz`, gzipData));
          savedVariantsForFile++;
        }

        if (brotliData.length < data.length) {
          writePromises.push(fs.writeFile(`${filePath}.br`, brotliData));
          savedVariantsForFile++;
        }

        if (zstdData.length < data.length) {
          writePromises.push(fs.writeFile(`${filePath}.zst`, zstdData));
          savedVariantsForFile++;
        }

        await Promise.all(writePromises);

        if (options.verbose) {
          const relativePath = path.relative(process.cwd(), filePath);
          const savedExts = [];
          if (gzipData.length < data.length) savedExts.push('.gz');
          if (brotliData.length < data.length) savedExts.push('.br');
          if (zstdData.length < data.length) savedExts.push('.zst');

          if (savedVariantsForFile > 0) {
            console.log(`✅ Compressed: ${relativePath} (${savedExts.join(', ')})`);
          } else {
            console.log(`⏭️  Skipped: ${relativePath} (no reduction)`);
          }
        }

        compressedVariants += savedVariantsForFile;
      } catch (err: unknown) {
        console.error(`❌ Failed to compress: ${filePath}`, err);
        allErrors.push({ filePath, error: err instanceof Error ? err.message : String(err) });
      } finally {
        filesProcessed++;
        const progress = ((filesProcessed / files.length) * 100).toFixed(0);
        process.stdout.write(
          `[${'#'.repeat(Math.floor(parseInt(progress) / 5)).padEnd(20, ' ')}] ${progress}% (${filesProcessed}/${files.length})\r`,
        );
      }
    }
  };

  const workerPromises = Array.from({ length: numWorkers }, worker);
  await Promise.all(workerPromises);

  process.stdout.write('\n'); // Final newline after progress indicator

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

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

if (import.meta.url.startsWith('file://') && process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const targetDir = args.find((arg) => !arg.startsWith('--')) || DEFAULT_DIST_DIR;
  const verbose = args.includes('--verbose');
  runCompressionEngine(targetDir, { verbose }).catch((err) => {
    console.error('An unhandled error occurred in the compression engine:', err);
    process.exit(1);
  });
}
