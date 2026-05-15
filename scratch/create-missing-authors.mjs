
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Simple slugify function matching the one in the codebase
function slugify(tag) {
  return tag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .trim();
}

const BLOG_DIR = './src/content/blog';
const AUTHORS_DIR = './src/content/authors';

if (!fs.existsSync(AUTHORS_DIR)) {
  fs.mkdirSync(AUTHORS_DIR, { recursive: true });
}

const existingAuthors = new Set(
  fs.readdirSync(AUTHORS_DIR)
    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx?$/, ''))
);

const blogFiles = fs.readdirSync(BLOG_DIR, { recursive: true })
  .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

const authorsInBlog = new Set();

blogFiles.forEach(file => {
  const filePath = path.join(BLOG_DIR, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    if (data.author) {
      authorsInBlog.add(data.author);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
});

console.log('Authors found in blog:', Array.from(authorsInBlog));

authorsInBlog.forEach(author => {
  const slug = slugify(author);
  if (!existingAuthors.has(slug)) {
    console.log(`Creating author entry for: ${author} (${slug})`);
    const content = `---
name: "${author}"
bio: "${author} is a contributor to Astro Batavia, sharing insights and expertise on modern web development and digital trends."
role: "Contributor"
---
`;
    fs.writeFileSync(path.join(AUTHORS_DIR, `${slug}.md`), content);
    existingAuthors.add(slug);
  } else {
    console.log(`Author already exists: ${author} (${slug})`);
  }
});

console.log('Done!');
