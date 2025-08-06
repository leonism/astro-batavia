import { promises as fs } from 'fs';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';
import os from 'os';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

const SUPPORTED_EXTENSIONS = new Set([
  '.html', '.css', '.js', '.json', '.xml', '.svg', '.txt', '.wasm', '.webmanifest'
]);

const DEFAULT_DIST_DIR = 'dist';

async function compressFile(filePath, data) {
  const results = {
    success: [],
    errors: [],
  };
  const gzipPath = `${filePath}.gz`;
  const brotliPath = `${filePath}.br`;

  try {
    const gzipData = await gzip(data, { level: zlib.constants.Z_BEST_COMPRESSION });
    await fs.writeFile(gzipPath, gzipData);
    results.success.push(gzipPath);
  } catch (err) {
    results.errors.push({ type: 'Gzip', error: err });
  }

  try {
    const brotliData = await brotliCompress(data, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    });
    await fs.writeFile(brotliPath, brotliData);
    results.success.push(brotliPath);
  } catch (err) {
    results.errors.push({ type: 'Brotli', error: err });
  }

  return results;
}

async function* walkDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDirectory(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

async function getCompressibleFiles(dir) {
  const compressible = [];
  for await (const file of walkDirectory(dir)) {
    const ext = path.extname(file).toLowerCase();
    if (SUPPORTED_EXTENSIONS.has(ext)) {
      compressible.push(file);
    }
  }
  return compressible;
}

async function runCompressionEngine(distDir = DEFAULT_DIST_DIR) {
  const startTime = performance.now();
  console.log('🚀 Starting enterprise-grade compression build tool...');
  console.log(`🔍 Scanning for compressible files in: ${distDir}`);

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
  let filesWithErrors = 0;
  const allErrors = [];

  const worker = async () => {
    while (queue.length > 0) {
      const filePath = queue.shift();
      if (!filePath) continue;

      try {
        const data = await fs.readFile(filePath);
        const result = await compressFile(filePath, data);

        result.success.forEach((out) => console.log(`✅ Compressed: ${path.relative(process.cwd(), out)}`));
        compressedVariants += result.success.length;

        if (result.errors.length > 0) {
          filesWithErrors++;
          result.errors.forEach(e => {
            console.error(`❌ ${e.type} failed for: ${filePath}`, e.error);
            allErrors.push({ filePath, error: `[${e.type}] ${e.error.message}` });
          });
        }
      } catch (err) {
        filesWithErrors++;
        console.error(`❌ Failed to read file: ${filePath}`, err);
        allErrors.push({ filePath, error: `Failed to read file: ${err.message}` });
      } finally {
        filesProcessed++;
      }
    }
  };

  const workerPromises = Array.from({ length: numWorkers }, worker);
  await Promise.all(workerPromises);

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

  console.log('\n' + '-'.repeat(50));
  console.log('🏁 Compression Task Summary');
  console.log('-'.repeat(50));
  console.log(`- Files Scanned: ${files.length}`);
  console.log(`- Files Processed: ${filesProcessed}`);
  console.log(`- Compressed Variants Created: ${compressedVariants}`);
  console.log(`- Files with Errors: ${filesWithErrors}`);
  
  if (filesWithErrors > 0) {
    console.log('\n🚨 Error Details:');
    allErrors.forEach(e => {
      console.log(`  - File: ${e.filePath}\n    Error: ${e.error}`);
    });
  }
  
  console.log(`\n⏱️  Total Execution Time: ${duration}ms`);
  console.log('-'.repeat(50));

  if (filesWithErrors > 0) {
    console.log('\n❌ Build finished with errors.');
    process.exit(1);
  } else {
    console.log('\n🎉 Build finished successfully.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const targetDir = args[0] || DEFAULT_DIST_DIR;
  runCompressionEngine(targetDir).catch((err) => {
    console.error('An unhandled error occurred in the compression engine:', err);
    process.exit(1);
  });
}
