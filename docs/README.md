# Application Architecture

This project is built with [Astro](https://astro.build) and follows a Clean Architecture inspired approach to separate concerns and improve maintainability.

## Directory Structure

- **`src/services/`**: Contains business logic and data access layers. These modules are responsible for fetching data, processing it, and applying business rules. They should not contain UI-specific code.
  - `BlogService.ts`: Handles fetching, filtering, and sorting of blog posts.

- **`src/components/`**: Contains Astro components focused on presentation.
  - `blog/`: Components related to blog posts (Card, Hero, etc.).
  - `search/`: Components for the search feature.
  - `ui/`: Reusable UI components (Buttons, Inputs, etc.).

- **`src/pages/`**: Defines the routes of the application. Pages act as controllers, fetching data from services and passing it to components.

- **`src/types/`**: Shared TypeScript interfaces and types.

- **`src/utils/`**: Helper functions for formatting, string manipulation, etc.

## Key Principles

1.  **Separation of Concerns**: Logic for fetching data is in `services/`. Logic for rendering is in `components/`. Pages glue them together.
2.  **View Logic Separation**: For components with complex logic (formatting, conditional classes), use a Service class to generate a View Model. The `.astro` file should only render the View Model.
3.  **Type Safety**: Use TypeScript interfaces for all data structures and component props.
4.  **Performance**: Heavy processing should happen at build time (in `getStaticPaths` or service calls during build) or be deferred to the client if necessary (though we prefer SSG).

## Example: Blog Feature

1.  **Data**: Content is stored in `src/content/blog/`.
2.  **Service**: `BlogService.getLatestPosts('en')` is called to fetch data.
3.  **Page**: `src/pages/index.astro` calls the service.
4.  **Service**: `BlogCardService.getViewModel(props)` processes the raw data into a display-ready View Model.
5.  **Component**: `BlogCard.astro` receives the post data, calls the service, and renders the View Model.

## Developer Guide

- **Adding a new feature**:
  1.  Define the data model in `src/content/config.ts` (if content-based).
  2.  Create a Service in `src/services/` to handle logic.
  3.  Create presentational Components in `src/components/`.
  4.  Assemble in a Page in `src/pages/`.

- **Testing**:
  - Unit test services where complex logic exists.
  - Use Storybook (if configured) for component visual testing.
