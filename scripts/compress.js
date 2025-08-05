#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import zlib, { constants as zlibConstants } from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

const COMPRESSION_EXTENSIONS = new Set([
  '.html', '.css', '.js', '.json', '.xml', '.svg', '.txt', '.wasm', '.webmanifest'
]);

async function compressFile(filePath, data) {
  try {
    // Create Gzip version
    const gzipData = await gzip(data, { level: 9 });
    await fs.writeFile(`${filePath}.gz`, gzipData);

    // Create Brotli version
    const brotliData = await brotliCompress(data, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    });
    await fs.writeFile(`${filePath}.br`, brotliData);

    console.log(`Compressed: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error.message);
  }
}

async function getFilesToCompress(dir) {
  let filesToProcess = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      filesToProcess = filesToProcess.concat(await getFilesToCompress(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (COMPRESSION_EXTENSIONS.has(ext)) {
        filesToProcess.push(fullPath);
      }
    }
  }
  return filesToProcess;
}

async function main() {
  const distDir = path.join(process.cwd(), 'dist');

  try {
    await fs.access(distDir);
  } catch (error) {
    console.error('Error: dist directory not found. Please run the build first.');
    process.exit(1);
  }

  console.log('Starting compression...');
  const files = await getFilesToCompress(distDir);

  // Read all file data in parallel
  const fileReadPromises = files.map(async (filePath) => ({
    filePath,
    data: await fs.readFile(filePath),
  }));
  const fileData = await Promise.all(fileReadPromises);

  // Compress all files in parallel
  const compressionPromises = fileData.map(({ filePath, data }) =>
    compressFile(filePath, data)
  );
  await Promise.all(compressionPromises);

  console.log('Compression completed!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
