# Astro Batavia Project Context

## Project Overview

**Astro Batavia** is a modern, multilingual static blog platform built with **Astro v5**. It features a comprehensive internationalization (i18n) system supporting English, Spanish, and Japanese. The project utilizes **Tailwind CSS** for styling, **Decap CMS** for content management, and includes advanced build optimizations like custom HTML minification and asset compression.

## Tech Stack

*   **Framework:** [Astro](https://astro.build) (v5.16.6)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com) (v3.4) + `@tailwindcss/typography`
*   **Content:** [MDX](https://mdxjs.com/)
*   **CMS:** [Decap CMS](https://decapcms.org/) (Netlify CMS)
*   **Monitoring:** [Sentry](https://sentry.io/)
*   **Debugging:** [Spotlight.js](https://spotlightjs.com/)
*   **Build Tools:** Vite, Rollup

## Architecture

The project follows a standard Astro structure with specific patterns for i18n and content:

*   **`src/components/`**: Reusable UI components.
    *   `blog/`, `cards/`, `footer/`, `navigation/`, `search/`: Domain-specific components.
    *   `common/`: Shared utilities like `SEO.astro`, `ThemeInitializer.astro`.
    *   `ui/`: Low-level UI primitives (buttons, spinners, etc.).
*   **`src/content/`**: Content collections.
    *   `blog/`: Contains subdirectories for each language (`en/`, `es/`, `ja/`).
    *   `config.ts`: Defines content schemas (using Zod).
*   **`src/i18n/`**: Localization logic.
    *   `ui.ts`: UI string translations.
    *   `utils.ts`: Helpers for language detection and routing.
*   **`src/pages/`**: File-based routing.
    *   `[lang]/`: Handles localized routes (e.g., `/es/about`).
    *   `api/`: API endpoints (likely for search or other dynamic features).
*   **`src/integrations/`**: Custom Astro integrations (e.g., `html-minifier.mjs`).
*   **`scripts/`**: Build scripts (e.g., `compress.ts`).

## Building and Running

The project uses `npm` for dependency management and script execution.

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Astro development server on `http://localhost:5000`. |
| `npm run build` | Builds the project for production **AND** runs the compression script. |
| `npm run build:only` | Builds the project for production **WITHOUT** compression. |
| `npm run compress` | Runs the custom compression script (`scripts/compress.ts`) on the `dist/` folder. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint on the codebase. |
| `npm run format:check` | Checks code formatting using Prettier. |

### Build Output

The build output is generated in the `dist/` directory. The `npm run build` command generates static HTML files and then compresses them into `.gz` (Gzip) and `.br` (Brotli) formats for optimized delivery.

## Development Conventions

*   **TypeScript:** Strict mode is enabled (`"strict": true`). Path alias `@/*` resolves to `src/*`.
*   **Styling:** Utility-first CSS using Tailwind. Avoid custom CSS in `.astro` `<style>` blocks unless necessary.
*   **Formatting/Linting:** Prettier and ESLint are configured. Ensure code passes these checks before committing.
*   **I18n:**
    *   All user-facing text should be translatable via `src/i18n/ui.ts`.
    *   Routes should generally be placed under `src/pages/[lang]/` to support all languages.
    *   The default locale is `en`.
*   **Search:** Enhanced search functionality is implemented (see `src/components/search/` and `src/features/search/`).
*   **Images:** Images are optimized using `astro:assets` (implied by usage) or standard `<img>` tags with optimization plugins.

## Configuration Files

*   `astro.config.mjs`: Main Astro config. Defines integrations (MDX, Tailwind, Sitemap, etc.) and i18n settings.
*   `tailwind.config.mjs`: Tailwind setup.
*   `tsconfig.json`: TypeScript compiler options.
*   `eslint.config.js`: ESLint rules.
*   `package.json`: Dependencies and scripts.
