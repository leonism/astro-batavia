# Performance Optimizations

## Load More Articles Button

The "Load More Articles" functionality has been optimized for performance, accessibility, and reliability.

### Optimizations
- **Pagination Logic**: Implemented efficient server-side pagination to return only necessary data.
- **Network Efficiency**: Added payload size tracking and optimized API response structure.
- **Memory Management**: Added memory usage tracking (Chrome-specific) to monitor heap size changes during content loading.
- **DOM Updates**: Batch DOM updates to minimize reflows/repaints.
- **Accessibility**: Added `aria-live` regions and `aria-busy` states for screen readers.
- **Error Handling**: Robust error handling with user-friendly feedback and auto-dismissing error messages.

### Metrics Tracking
The following metrics are logged to the console during "Load More" operations:
- `networkDurationMs`: Time taken to fetch data from the API.
- `domUpdateDurationMs`: Time taken to render and append new posts to the DOM.
- `totalDurationMs`: Total time from click to completion.
- `payloadSizeBytes`: Size of the JSON response.
- `memoryDeltaBytes`: Change in JS heap size (Chrome only).

## Enhanced Search Overlay

The Enhanced Search Overlay has been optimized to reduce the initial bundle size and improve critical rendering path performance.

### Optimizations
- **Lazy Loading**: The search UI module is now lazy-loaded only when the user interacts with the search trigger (button click or keyboard shortcut).
- **Type Safety**: Improved TypeScript definitions to prevent runtime errors and ensure type safety during dynamic imports.
- **Singleton Pattern**: Ensures only one instance of the search UI is initialized.

### Implementation Details
- The search overlay component uses `import()` syntax to dynamically load the `EnhancedSearchUI` class.
- A loading state is managed to prevent multiple concurrent initialization requests.

## Image Optimization

The image rendering implementation has been migrated to Astro's native `<Image />` component (powered by `astro:assets`) to provide automatic optimization, responsive sizing, and modern format support.

### Features
- **Remote Image Optimization**: Configured to optimize images from allowed domains (e.g., Pexels) using Astro's image service (Sharp).
- **Responsive Images**: Automatically generates `srcset` with multiple widths (640px, 768px, 1024px, 1280px, 1600px) to serve the most appropriate size for the user's device.
- **Format Conversion**: Automatically converts images to modern formats (WebP/AVIF) where supported.
- **CLS Prevention**: Enforces explicit `width` and `height` or uses `inferSize` for remote images to prevent Cumulative Layout Shift.
- **Legacy Support**: Maintains fallback support for legacy public folder images, ensuring no regression for existing assets.
- **Quality Control**: Sets a default quality of 75% to balance visual fidelity and file size.

### Usage
The `Picture` component now acts as a wrapper around `astro:assets`'s `<Image />`:

```astro
<Picture
  src={post.data.heroImage} // Remote URL or imported image
  alt={post.data.title}
  width={800}
  height={600}
  class="object-cover"
/>
```

### Configuration
Allowed remote domains are configured in `astro.config.mjs`:
```javascript
image: {
  domains: ['images.pexels.com'],
},
```
