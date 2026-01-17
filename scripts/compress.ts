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

// Runs gzip and brotli in parallel for a single file's data
async function compressData(data: Buffer) {
  const gzipPromise = gzip(data, { level: zlib.constants.Z_BEST_COMPRESSION });
  const brotliPromise = brotliCompress(data, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // Max quality
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
    },
  });
  // Await both promises to run them in parallel
  return Promise.all([gzipPromise, brotliPromise]);
}

// Finds all files matching the supported extensions using glob
async function getCompressibleFiles(dir: string) {
  const extensions = Array.from(SUPPORTED_EXTENSIONS).map((ext) => ext.substring(1));
  const pattern = `**/*.{${extensions.join(',')}}`;
  // Use glob for faster file discovery
  return glob(pattern, { cwd: dir, absolute: true, nodir: true });
}

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
        const [gzipData, brotliData] = await compressData(data);

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
