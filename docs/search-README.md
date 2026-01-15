# Enterprise Search System

A powerful, enterprise-grade search engine built for Astro Batavia with advanced features including instant search, fuzzy matching, intelligent filtering, and comprehensive analytics.

## Features

### 🚀 Core Search Capabilities

- **Instant Search**: Sub-100ms search results with optimized indexing
- **Fuzzy Matching**: Find results even with typos using advanced similarity algorithms
- **Multi-field Search**: Search across titles, descriptions, content, tags, and authors
- **Relevance Scoring**: Intelligent ranking based on multiple factors
- **Real-time Suggestions**: Dynamic search suggestions as you type

### 🎯 Advanced Filtering

- **Tag-based Filtering**: Filter by multiple tags simultaneously
- **Date Range Filtering**: Search within specific time periods
- **Author Filtering**: Find content by specific authors
- **Category Filtering**: Browse by content categories
- **Quick Filters**: Popular and recent content shortcuts

### 🎨 User Experience

- **Voice Search**: Hands-free search using speech recognition
- **Keyboard Shortcuts**: ⌘K (Mac) / Ctrl+K (Windows) to focus search
- **Search History**: Track and revisit previous searches
- **Popular Searches**: Discover trending search terms
- **Responsive Design**: Optimized for all device sizes

### 📊 Analytics & Performance

- **Search Analytics**: Track search patterns and user behavior
- **Performance Monitoring**: Real-time search performance metrics
- **Caching System**: Intelligent caching for faster repeat searches
- **Click Tracking**: Monitor which results users find most relevant

## Architecture

### Components Overview

```
src/features/search/
├── EnterpriseSearchEngine.ts     # Core search engine with indexing and algorithms
├── searchIntegration.ts          # Integration layer and unified API
├── EnterpriseSearchClient.ts     # Client-side UI and interaction handling
├── EnterpriseSearchBox.astro     # Search input component with suggestions
├── EnterpriseSearchResults.astro # Results display with filtering and sorting
└── README.md                     # This documentation
```

### Data Flow

1. **Indexing**: Documents are processed and indexed by `EnterpriseSearchEngine`
2. **Search Request**: User input triggers search through `searchIntegration`
3. **Processing**: Query is normalized, cached results checked, search performed
4. **Results**: Ranked results returned with highlighting and suggestions
5. **Analytics**: Search patterns and clicks tracked for optimization

## Usage

### Basic Implementation

```typescript
import { searchIntegration } from '@/features/search/searchIntegration';

// Initialize with your documents
const documents = [
  {
    id: 'post-1',
    title: 'Getting Started with TypeScript',
    description: 'Learn the basics of TypeScript development',
    content: 'TypeScript is a typed superset of JavaScript...',
    tags: ['typescript', 'javascript', 'programming'],
    url: '/blog/typescript-basics',
    pubDate: new Date('2024-01-15'),
    author: 'John Doe',
    category: 'Tutorial',
    lang: 'en',
    slug: 'typescript-basics',
  },
  // ... more documents
];

// Initialize the search engine
await searchIntegration.initialize(documents);

// Perform a search
const results = await searchIntegration.search('typescript', {
  tags: ['programming'],
  sortBy: 'relevance',
});

console.log(`Found ${results.totalCount} results in ${results.searchTime}ms`);
```

### Astro Component Usage

```astro
---
// pages/search.astro
import EnterpriseSearchBox from '@/components/search/EnterpriseSearchBox.astro';
import EnterpriseSearchResults from '@/components/search/EnterpriseSearchResults.astro';
import { getAllPosts } from '@/utils/search-server';

const posts = await getAllPosts('en');
---

<Layout title="Search">
  <main>
    <EnterpriseSearchBox
      placeholder="Search articles, tags, authors..."
      enableVoiceSearch={true}
      showKeyboardShortcut={true}
      popularSearches={['JavaScript', 'React', 'TypeScript']}
    />

    <EnterpriseSearchResults posts={posts} lang="en" enableInfiniteScroll={true} />
  </main>
</Layout>

<script>
  import { EnterpriseSearchClient } from '@/features/search/EnterpriseSearchClient';

  document.addEventListener('DOMContentLoaded', async () => {
    const searchClient = new EnterpriseSearchClient();
    await searchClient.indexPosts(window.__SEARCH_DATA__ || []);
  });
</script>
```

## Configuration

### Search Integration Config

```typescript
import { SearchIntegration } from '@/features/search/searchIntegration';

const searchIntegration = new SearchIntegration({
  enableAnalytics: true, // Track search analytics
  enableCache: true, // Cache search results
  enableVoiceSearch: true, // Enable voice search
  maxResults: 50, // Maximum results per search
  debounceMs: 300, // Debounce delay for search input
  fuzzyThreshold: 0.6, // Fuzzy matching sensitivity (0-1)
});
```

### Search Options

```typescript
const results = await searchIntegration.search('query', filters, {
  limit: 20, // Number of results to return
  offset: 0, // Pagination offset
});
```

### Search Filters

```typescript
const filters = {
  tags: ['javascript', 'react'], // Filter by tags
  dateFrom: new Date('2024-01-01'), // Start date
  dateTo: new Date('2024-12-31'), // End date
  author: 'John Doe', // Filter by author
  category: 'Tutorial', // Filter by category
  sortBy: 'relevance', // Sort method
  sortOrder: 'desc', // Sort direction
};
```

## API Reference

### SearchIntegration

#### Methods

- `initialize(documents: SearchableDocument[]): Promise<void>`
  - Index documents for searching

- `search(query: string, filters?: SearchFilters, options?: SearchOptions): Promise<SearchResults>`
  - Perform a search with optional filtering

- `getSuggestions(partialQuery: string, limit?: number): Promise<string[]>`
  - Get search suggestions based on partial input

- `trackResultClick(query: string, resultId: string): void`
  - Track when a user clicks on a search result

- `getAnalytics(): SearchAnalytics[]`
  - Retrieve search analytics data

- `clearCache(): void`
  - Clear the search result cache

### SearchUtils

#### Utility Functions

- `highlightText(text: string, query: string): string`
  - Highlight search terms in text

- `truncateText(text: string, maxLength: number): string`
  - Truncate text with ellipsis

- `formatSearchTime(timeMs: number): string`
  - Format search time for display

- `formatResultCount(count: number): string`
  - Format result count for display

- `debounce(func: Function, wait: number): Function`
  - Debounce function for search input

- `supportsVoiceSearch(): boolean`
  - Check if browser supports voice search

## Performance Optimization

### Indexing Strategy

1. **Multi-level Indexing**: Separate indexes for search terms, tags, and titles
2. **Stop Word Filtering**: Common words are excluded from indexing
3. **Text Normalization**: Consistent text processing for better matching
4. **Incremental Updates**: Efficient re-indexing for content changes

### Search Optimization

1. **Result Caching**: Frequently searched queries are cached
2. **Fuzzy Matching**: Configurable similarity thresholds
3. **Early Termination**: Stop processing when enough results are found
4. **Relevance Scoring**: Multi-factor scoring for result ranking

### UI Performance

1. **Debounced Input**: Prevents excessive search requests
2. **Virtual Scrolling**: Efficient rendering of large result sets
3. **Lazy Loading**: Load additional results on demand
4. **Progressive Enhancement**: Works without JavaScript

## Analytics

### Tracked Metrics

- **Search Queries**: What users are searching for
- **Result Counts**: How many results each query returns
- **Click-through Rates**: Which results users find most relevant
- **Search Patterns**: Popular search terms and trends
- **Performance Metrics**: Search response times

### Data Storage

Analytics data is stored locally using `localStorage` and includes:

```typescript
interface SearchAnalytics {
  query: string; // The search query
  timestamp: Date; // When the search was performed
  resultsCount: number; // Number of results returned
  clickedResult?: string; // ID of clicked result (if any)
  filters?: SearchFilters; // Applied filters
}
```

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Voice Search**: Requires Web Speech API support
- **Local Storage**: Required for analytics and search history
- **ES2020**: Modern JavaScript features used throughout

## Troubleshooting

### Common Issues

1. **Search Not Working**
   - Ensure documents are properly indexed
   - Check browser console for errors
   - Verify search integration is initialized

2. **Slow Search Performance**
   - Reduce fuzzy matching threshold
   - Enable result caching
   - Limit maximum results

3. **Voice Search Not Available**
   - Check browser support for Web Speech API
   - Ensure HTTPS connection (required for voice)
   - Verify microphone permissions

4. **Analytics Not Tracking**
   - Ensure analytics are enabled in config
   - Check localStorage availability
   - Verify proper result click tracking

### Debug Mode

Enable debug logging:

```typescript
// In browser console
window.searchClient?.getConfig();
window.searchClient?.getSearchAnalytics();
```

## Contributing

When contributing to the search system:

1. **Performance**: Always consider search performance impact
2. **Accessibility**: Ensure keyboard navigation and screen reader support
3. **Testing**: Test with various query types and edge cases
4. **Documentation**: Update this README for any API changes

## License

This enterprise search system is part of the Astro Batavia project and follows the same licensing terms.
