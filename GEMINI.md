# Astro Batavia

## Project Overview

**Astro Batavia** is a modern, multilingual blog platform built with **Astro.js**. It leverages **TypeScript** for type safety and **Tailwind CSS** for styling, offering a highly performant and SEO-optimized static site. The project features a robust internationalization (i18n) system, content management via Decap CMS (git-based), and advanced build optimizations including HTML minification and asset compression.

### Key Technologies

- **Framework:** [Astro](https://astro.build) (v6.2.2)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (v4)
- **Content:** MDX (Markdown with JSX), Decap CMS
- **Validation:** [Zod](https://zod.dev/) (Schema validation)
- **Testing:** [Vitest](https://vitest.dev/)
- **Analytics/SEO:** Google Tag Manager (via Partytown), Sentry, Sitemap generation

## Building and Running

The project uses `npm` for dependency management and script execution.

### Key Commands

| Command              | Description                                                               |
| :------------------- | :------------------------------------------------------------------------ |
| `npm run dev`        | Starts the local development server at `http://localhost:5000`.           |
| `npm run build`      | Builds the project for production (includes compression).                 |
| `npm run build:only` | Builds the project without the compression step.                          |
| `npm run compress`   | Runs the compression script (`scripts/compress.ts`) on the `dist` folder. |
| `npm run preview`    | Previews the production build locally.                                    |
| `npm run lint`       | Runs ESLint to check for code quality issues.                             |
| `npm run format`     | Formats code using Prettier.                                              |
| `npm test`           | Runs unit tests using Vitest.                                             |

## Recent Updates

### UI & Layout Consistency
- **Standardized Aspect Ratios**: Blog cards now use a consistent `aspect-video` for hero images, ensuring perfect grid alignment.
- **Adaptive Metadata**: Author and timestamp sections in cards utilize `truncate` and `flex-wrap` to handle long names gracefully on all viewports.
- **Navigation Enhancements**: `BlogPrevNextNavigation` features full-height hero images and double-chevron icons (`chevrons-left`, `chevrons-right`) for better directional clarity.
- **Back to Top**: Updated to use `chevrons-up` icon for consistency across the site.
- **Typography System**: Implemented shadcn/ui-inspired typography components (e.g., `TypographyH1`, `TypographyP`) located in `src/components/ui/typography/` for standardized text styling.
- **Animations & Responsive Adjustments**: Added Aurora text animation (`animate-aurora`) to the hero section. Improved newsletter form input borders for better visibility across themes, and adjusted mobile heading sizes in blog posts to prevent layout overflow.

### Service Layer Refinements
- **BlogCardService**: Centralized management of metadata spacing via the `metadataContainer` class, reducing vertical gaps in standard grids while maintaining featured post layouts.

### Build & Config
- **Analytics Development**: Added `devPartytownFix` to `astro.config.mjs` to resolve local development issues with Partytown and analytics scripts.

## Development Conventions

### File Structure

- **`src/components/`**: Reusable UI components (Atomic design: atoms, molecules, organisms).
- **`src/content/`**: Content collections (blog posts, authors) and configuration (`config.ts`).
- **`src/features/`**: Feature-specific logic (e.g., `search`).
- **`src/i18n/`**: Internationalization logic, types, and UI translations.
- **`src/layouts/`**: Page layouts (e.g., `Layout.astro`, `BlogPost.astro`).
- **`src/pages/`**: File-based routing.
  - `[lang]/`: Dynamic language routes (e.g., `/en/`, `/es/`).
  - `api/`: API endpoints.
- **`src/styles/`**: Global styles and Tailwind configuration.
- **`public/admin/`**: Decap CMS configuration (`config.yml`).

### Component Design Patterns

- **Standardized Proportions**: Use `aspect-video` for image containers in grid-based cards to ensure vertical alignment.
- **Metadata Robustness**: Always use `min-w-0` and `truncate` on text elements (like author names) within flex containers to prevent layout overflows.
- **Iconography**: Prefer double chevrons (`chevrons-up`, `chevrons-right`, etc.) for primary navigation actions to provide stronger visual cues.
- **Typography System**: When building custom elements or writing long-form content outside the `prose` scope, utilize the shadcn/ui typography components (`src/components/ui/typography/`) to guarantee consistent scaling, spacing, and font weights.

### Internationalization (i18n)

- **Languages:** English (`en`, default), Spanish (`es`), Japanese (`ja`).
- **Routing:** URLs are language-prefixed (e.g., `/en/blog/...`, `/es/blog/...`).
- **Configuration:** Managed in `astro.config.mjs` and `src/i18n/`.
- **Usage:** Use `src/i18n/ui.ts` for UI string translations.

### Content Collections

Content is managed using Astro's Content Collections API.

- **Schema:** Defined in `src/content/config.ts` using Zod.
- **Collections:**
  - `blog`: Blog posts with metadata like title, description, tags, and author.
  - `authors`: Author profiles.

### Styling

- **Tailwind CSS:** Primary method for styling.
- **Dark Mode:** Supported via class-based toggling and system preference.
- **Global Styles:** Located in `src/styles/global.css`.

### Testing

- **Framework:** Vitest.
- **Location:** Tests are generally co-located with source files or in a `test/` directory (implied).

### Configuration Files

- **`astro.config.mjs`**: Main Astro configuration (integrations, i18n, server port).
- **`tailwind.config.mjs`**: Tailwind CSS configuration.
- **`tsconfig.json`**: TypeScript configuration.
- **`eslint.config.js`**: ESLint configuration.
- **`package.json`**: Project metadata and dependencies.
