import fs from 'fs';
import path from 'path';

const authorsDir = 'src/content/authors';
const files = fs.readdirSync(authorsDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(authorsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Basic frontmatter parsing
  const fmMatch = content.match(/^---([\s\S]*?)---/);
  if (!fmMatch) return;
  
  let fm = fmMatch[1];
  const nameMatch = fm.match(/name:\s*["']?(.+?)["']?\s*$/m);
  const name = nameMatch ? nameMatch[1] : file.replace('.md', '');
  const slug = file.replace('.md', '');
  
  // Check if social block exists
  if (!fm.includes('social:')) {
    const socialBlock = `
social:
  twitter: "https://x.com/${slug}"
  github: "https://github.com/${slug}"
  linkedin: "https://linkedin.com/in/${slug}"
`;
    fm = fm.trim() + socialBlock;
    content = content.replace(/^---([\s\S]*?)---/, `---\n${fm.trim()}\n---`);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} with social links.`);
  } else {
    // Check for missing individual links
    let updated = false;
    if (!fm.includes('twitter:')) {
      fm = fm.replace('social:', `social:\n  twitter: "https://x.com/${slug}"`);
      updated = true;
    }
    if (!fm.includes('github:')) {
      fm = fm.replace('social:', `social:\n  github: "https://github.com/${slug}"`);
      updated = true;
    }
    if (!fm.includes('linkedin:')) {
      fm = fm.replace('social:', `social:\n  linkedin: "https://linkedin.com/in/${slug}"`);
      updated = true;
    }
    
    if (updated) {
      content = content.replace(/^---([\s\S]*?)---/, `---\n${fm.trim()}\n---`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file} with missing social links.`);
    }
  }
});
