# Search Feature Architecture

This directory contains the core logic for the Enhanced Search feature in Astro Batavia.

## Architecture Overview

The search feature is designed using a **Model-View-Controller (MVC)** inspired pattern to separate concerns:

1.  **View (`src/pages/search.astro`)**:
    *   Handles the static HTML structure and layout.
    *   Delegates all interactive logic to the Controller.
    *   Minimal client-side script entry point.

2.  **Controller (`SearchPageController.ts`)**:
    *   Orchestrates the interaction between the User Interface (DOM) and the Search Client.
    *   Manages page-specific state (active filters, sort order, URL parameters).
    *   Handles DOM events (clicks, changes) and updates the UI accordingly.

3.  **Service (`EnhancedSearchClient.ts`)**:
    *   Handles the core search logic (MiniSearch/FlexSearch/Fuse.js integration).
    *   Manages the search index (fetching, indexing).
    *   Provides API for searching (`search()`) and results rendering (`displayResults()`).

4.  **Configuration (`searchConstants.ts`)**:
    *   Centralized configuration for sort options, DOM IDs, and client settings.

## File Structure

- **`SearchPageController.ts`**: The main entry point for the Search Page logic.
- **`searchConstants.ts`**: shared constants and configuration.
- **`EnhancedSearchClient.ts`**: The underlying search engine wrapper.
- **`EnhancedSearchEngine.ts`**: Core search algorithm implementation.
- **`EnhancedSearchUI.ts`**: (Legacy/Shared) specific UI rendering helpers.

## Usage

To use the search controller in a page:

```typescript
// In your Astro component script
import { SearchPageController } from '@/features/search/SearchPageController';

document.addEventListener('astro:page-load', () => {
  const controller = new SearchPageController();
  controller.init();
});
```

## Adding New Sort Options

1.  Open `src/features/search/searchConstants.ts`.
2.  Add a new object to the `SORT_OPTIONS` array:
    ```typescript
    { value: 'your-sort-field-direction', label: 'Your Label' }
    ```
3.  Ensure the backend/client logic supports this sort field.

## Debugging

The controller exposes the client globally for debugging in the browser console:

- `window.searchClient`: Access the client instance.
- `window.searchInsights()`: Log internal metrics and insights.
