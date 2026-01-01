
import EnhancedSearchEngine from './EnhancedSearchEngine.js';

const documents = [
  {
    id: '1',
    title: 'Future of AI',
    description: 'Artificial Intelligence is changing the world.',
    tags: ['AI', 'Tech'],
    url: '/blog/ai',
    pubDate: new Date('2024-01-01'),
    author: 'John Doe',
    lang: 'en',
    slug: 'future-of-ai'
  },
  {
    id: '2',
    title: 'VR Gaming',
    description: 'Virtual Reality is immersive.',
    tags: ['VR', 'Gaming'],
    url: '/blog/vr',
    pubDate: new Date('2024-01-02'),
    author: 'Jane Doe',
    lang: 'en',
    slug: 'vr-gaming'
  },
  {
    id: '3',
    title: 'Web Development',
    description: 'HTML, CSS, and JS.',
    tags: ['Web', 'Dev'],
    url: '/blog/web',
    pubDate: new Date('2024-01-03'),
    author: 'John Doe',
    lang: 'en',
    slug: 'web-dev'
  },
  {
    id: '4',
    title: 'C++ Programming',
    description: 'Learn C++ and C#.',
    tags: ['C++', 'C#', 'Programming'],
    url: '/blog/cpp',
    pubDate: new Date('2024-01-05'),
    author: 'Dev',
    lang: 'en',
    slug: 'cpp-programming'
  },
  {
    id: '5',
    title: 'Japanese Post',
    description: 'Nihongo no kiji.',
    tags: ['Japan'],
    url: '/ja/blog/jp',
    pubDate: new Date('2024-01-04'),
    author: 'Taro',
    lang: 'ja',
    slug: 'jp-post'
  }
];

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('Running Search Engine Unit Tests...');

  const engine = new EnhancedSearchEngine();
  await engine.indexDocuments(documents);

  // Test 1: Short acronyms (AI)
  const resultsAI = engine.search('AI', { lang: 'en' });
  assert(resultsAI.some(r => r.title === 'Future of AI'), 'Search for "AI" should return "Future of AI"');

  // Test 2: Short acronyms (VR)
  const resultsVR = engine.search('VR', { lang: 'en' });
  assert(resultsVR.some(r => r.title === 'VR Gaming'), 'Search for "VR" should return "VR Gaming"');

  // Test 3: Short words (Web)
  const resultsWeb = engine.search('Web', { lang: 'en' });
  assert(resultsWeb.some(r => r.title === 'Web Development'), 'Search for "Web" should return "Web Development"');

  // Test 4: Special characters (C++)
  const resultsCpp = engine.search('C++', { lang: 'en' });
  assert(resultsCpp.some(r => r.title === 'C++ Programming'), 'Search for "C++" should return "C++ Programming"');

  // Test 5: Special characters (C#)
  const resultsCSharp = engine.search('C#', { lang: 'en' });
  assert(resultsCSharp.some(r => r.title === 'C++ Programming'), 'Search for "C#" should return "C++ Programming"');

  // Test 6: Language filtering
  const resultsEn = engine.search('', { lang: 'en' });
  assert(resultsEn.length === 4, 'Empty query with lang="en" should return 4 results');
  assert(!resultsEn.some(r => r.lang === 'ja'), 'English results should not include Japanese posts');

  const resultsJa = engine.search('', { lang: 'ja' });
  assert(resultsJa.length === 1, 'Empty query with lang="ja" should return 1 result');
  assert(resultsJa[0].title === 'Japanese Post', 'Japanese result should be correct');

  // Test 7: Empty query returns all filtered
  const resultsEmpty = engine.search('', { lang: 'en' });
  assert(resultsEmpty.length > 0, 'Empty query should return results');

  // Summary
  console.log('\n--- Test Summary ---');
  console.log(`Total: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
