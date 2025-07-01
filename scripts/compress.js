#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function compressFile(filePath) {
  try {
    const data = await readFile(filePath);
    
    // Create Gzip version
    const gzipData = await gzip(data, { level: 9 });
    await writeFile(`${filePath}.gz`, gzipData);
    
    // Create Brotli version
    const brotliData = await brotliCompress(data, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: data.length,
      },
    });
    await writeFile(`${filePath}.br`, brotliData);
    
    console.log(`Compressed: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error.message);
  }
}

async function walkDirectory(dir) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      await walkDirectory(filePath);
    } else if (fileStat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      
      // Compress HTML, CSS, JS, JSON, XML, and SVG files
      if (['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt'].includes(ext)) {
        await compressFile(filePath);
      }
    }
  }
}

async function main() {
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('dist directory not found. Please run the build first.');
    process.exit(1);
  }
  
  console.log('Starting compression...');
  await walkDirectory(distDir);
  console.log('Compression completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { compressFile, walkDirectory };