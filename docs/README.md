# Application Architecture

This project is built with [Astro](https://astro.build) and follows a Clean Architecture inspired approach to separate concerns and improve maintainability.

## Directory Structure

- **`src/services/`**: Contains core business logic and data access layers. These modules handle fetching, formatting, and complex calculations (e.g., SEO, Schema, Dates).
  - `BlogService.ts`: Core logic for blog post retrieval and filtering.
  - `SEOService.ts`: Logic for generating metadata and Open Graph tags.
  - `SchemaService.ts`: Handles JSON-LD structured data generation.

- **`src/features/`**: Contains complex, self-contained functional modules that combine logic, state, and UI.
  - `search/`: The complete search system (Engine, Client, UI).
  - `blog/`: Specialized blog features like data processing for post details.

- **`src/components/`**: Presentation layer components.
  - `blog/`: Blog-specific UI (Cards, Meta information, Tags).
  - `seo/`: Specialized components for Header and Schema management.
  - `ui/`: Global reusable UI primitives and widgets.
  - `navigation/`: Header and Mobile Menu systems.

- **`src/pages/`**: The routing layer. Pages act as controllers, orchestrating services and features to render the final view.

- **`src/layouts/`**: Base templates that provide the scaffolding for all pages.

- **`src/types/`**: Centralized TypeScript definitions for domain models and component props.

- **`src/utils/`**: Lightweight helper functions and plugins.

## Key Principles

1.  **Separation of Concerns**: Business logic lives in `services/`, domain-specific features in `features/`, and presentation in `components/`.
2.  **Logic-First Components**: Complex components use a corresponding Service or Feature to handle data preparation, keeping the `.astro` files focused on templating.
3.  **Type Safety**: Strict TypeScript usage ensures data integrity across the build process.
4.  **Performance by Default**: Heavy logic is executed at build time where possible, using Astro's SSG capabilities.

## Example: Enhanced Search Feature

1.  **Engine**: `EnhancedSearchEngine.ts` handles the search algorithms and indexing logic.
2.  **Client**: `EnhancedSearchClient.ts` manages user interactions and keyboard navigation in the browser.
3.  **UI**: `EnhancedSearchUI.ts` orchestrates the visual overlay and results display.
4.  **Components**: Astro components in `src/components/search/` provide the accessible HTML structure.

## Developer Guide

- **Adding a new feature**:
  1.  Define the content schema in `src/content/config.ts`.
  2.  Create a Service in `src/services/` for core logic.
  3.  If it's a complex interactive feature, implement it in `src/features/`.
  4.  Build presentational components in `src/components/`.
  5.  Assemble the feature in the appropriate `src/pages/`.

- **Maintenance**:
  - Keep domain logic out of the layouts and pages.
  - Always update types when changing schemas.
  - Ensure all new UI components support both light and dark modes.
