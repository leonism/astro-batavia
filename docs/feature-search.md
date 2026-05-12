# Enhanced Search System

The Astro Batavia Enhanced Search System is a high-performance, accessible, and semantically-aware search engine built specifically for modern multilingual blog platforms. It provides a seamless keyboard-driven experience without sacrificing accessibility.

## Key Features

### 🚀 Performance & Intelligence

- **Instant Results**: Sub-100ms response times for all queries.
- **Semantic Clustering**: Understands relationships between terms (e.g., "Web" and "Internet").
- **Fuzzy Matching**: Intelligent typo tolerance and partial match support.
- **Zero Initial Load**: The search engine and UI are lazy-loaded only when requested (via `⌘K` or click), avoiding unnecessary impact on the initial page load.

### 🍱 User Experience

- **Premium UI**: Modern glassmorphism design with smooth animations.
- **Keyboard First**: Full `⌘K`/`Ctrl+K` support with intuitive arrow-key navigation.
- **Multi-language**: Seamless searching across English, Spanish, and Japanese content.
- **Voice Search**: Native speech-to-text integration for hands-free searching.

### ♿ Accessibility

- **WCAG 2.1 Compliant**: Full ARIA support for screen readers.
- **Reduced Motion**: Respects system preferences for animations using `prefers-reduced-motion`.
- **Focus Management**: Robust handling of focus traps, returns, and high-contrast indicators.

## Architecture

The search functionality follows a clean modular design, separated between logic and presentation:

### Logic Layers (`src/features/search/`)

- **`EnhancedSearchEngine.ts`**: The core logic handling heavy-duty document indexing, semantic clustering, and fuzzy matching algorithms.
- **`EnhancedSearchClient.ts`**: The main browser-side controller managing event listeners, state orchestration, and performance monitoring.
- **`EnhancedSearchUI.ts`**: Orchestrates high-frequency DOM updates, result rendering, and UI transitions.
- **`SearchPageController.ts`**: Orchestrates the search experience on the dedicated standalone `/search` page.

### Presentation Layers (`src/components/search/`)

- **`EnhancedSearchOverlay.astro`**: Main entry point and modal container for the instant search feature.
- **`SearchInputForm.astro`**: Main search input with integrated accessibility announcements.
- **`SearchResults.astro`**: Dedicated results display used in the full-page search.
- **`SearchFilters.astro`**: Logic for sorting and category filtering.
- **`SearchOverlayInput.astro`**, **`SearchOverlayResults.astro`**, etc.: Specialized sub-components for the modal overlay.

## Implementation Details

### Initialization Flow

1.  **Trigger**: User clicks a search button or presses `⌘K`.
2.  **Lazy Load**: The search component dynamically imports the search feature module.
3.  **Indexing**: Post data is indexed in the browser's background for rapid retrieval.
4.  **UI Mount**: The search modal appears, ready for user input.

### Example: Programmatic Search

```typescript
import { EnhancedSearchEngine } from '@/features/search/EnhancedSearchEngine';

const engine = new EnhancedSearchEngine();

// Indexing documents
await engine.initialize([
  {
    id: 'post-1',
    title: 'Astro Batavia Guide',
    content: 'Learn how to build multilingual blogs...',
    tags: ['astro', 'i18n'],
    url: '/en/blog/guide',
    lang: 'en',
  },
]);

// Performing a semantic search
const results = await engine.search('building blogs');
console.log(results);
```

## Configuration

Constants are centralized in `src/features/search/searchConstants.ts`:

- `DEBOUNCE_MS`: Prevents excessive processing during typing (default 150ms).
- `MIN_QUERY_LENGTH`: Minimum characters before searching starts.
- `MAX_RESULTS`: Cap on displayed results for performance.

## Keyboard Interaction Model

### Universal Shortcuts

| Key                  | Action                             |
| :------------------- | :--------------------------------- |
| `⌘ + K` / `Ctrl + K` | Focus or Toggle Search Overlay     |
| `Esc`                | Close search / Clear current input |

### Navigation Controls

| Key           | Action                                                    |
| :------------ | :-------------------------------------------------------- |
| `↑` / `↓`     | Navigate through suggestions or results                   |
| `Enter`       | Activate/Open selected item                               |
| `Ctrl + Home` | Jump to the first search result                           |
| `Ctrl + End`  | Jump to the last search result                            |
| `Tab`         | Iterate through interactive UI elements (Filters, Inputs) |

## Accessibility Implementation

1.  **Semantic Roles**: Uses `combobox` for the input and `listbox` for results to satisfy ARIA patterns.
2.  **Live Announcements**: `aria-live="polite"` handles real-time updates for result counts and loading states.
3.  **Visual Indicators**: High-contrast focus rings and selection backgrounds ensure clarity across all display modes.
4.  **Motion**: All transitions are automatically disabled if the user has requested reduced motion.

## Analytics & Insights

The system tracks search performance and user intent (locally by default):

- **Search Timing**: Time taken to index and retrieve results.
- **Query History**: Recent searches for user convenience.
- **Cache Hit Rate**: Efficiency of the internal result cache.

## Troubleshooting & Debugging

- **No results?**: Ensure the `lang` parameter matches the indexed documents.
- **Slow navigation?**: Profile the `EnhancedSearchClient` event listeners.
- **Overlay won't open?**: Check for dynamic import failures in the browser console.
- **Debug Mode**: Run `localStorage.setItem('search-debug', 'true')` in the console for detailed background logging.
