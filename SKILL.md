---
name: astro-batavia
description: specialized skill for developing and maintaining the Astro Batavia multilingual blog platform.
---

# astro-batavia

Expert guidance for the Astro Batavia codebase, focusing on i18n, Tailwind CSS v4, and Astro-specific patterns.

## When to use

Use this skill for any task involving code modifications, feature additions, or bug fixes within the Astro Batavia repository. It is particularly critical when:
- Adding or modifying paginated routes (Manual Pagination).
- Updating styles or theme configuration (CSS-only).
- Working with multilingual content or translations.
- Creating new UI components (Astro/Vanilla JS).
- Implementing loading states using the custom Skeleton system.

## Instructions

### 1. Internationalization (i18n)
- **Translations**: UI strings are managed in `src/i18n/ui.ts`. Always add new strings there for all supported languages (`en`, `es`, `ja`).
- **Path Generation**: Use `getLocalizedPath(path, lang)` from `@/i18n/utils` to generate links. Avoid hardcoding `/en/` or `/es/`.
- **Validation**: Use `isValidLanguage(lang)` when handling `[lang]` parameters in `getStaticPaths`.

### 2. Styling with Tailwind CSS v4
- **CSS-Only Config**: All configuration MUST happen in `src/styles/global.css`. Never create a `tailwind.config.mjs` file.
- **Theme Extensions**: Add colors, fonts, and animations to the `@theme` block in `global.css`.
- **Utility Layers**: Use `@layer base`, `@layer components`, and `@layer utilities` within `global.css` to organize custom CSS.

### 3. Pagination & Routing
- **Filename Constraints**: Astro's `paginate()` helper ONLY works if the filename contains `[page]` or `[...page]`.
- **Manual Pagination**: For `index.astro` or `[slug].astro` files requiring pagination, manually slice the data and construct the `Page` object. Ensure `url.prev` and `url.next` are correctly localized.
- **First Page URLs**: Always ensure the first page links to the base directory (e.g., `/blog/`) and NOT to `/blog/1`.

### 4. Component Standards
- **Component Style**: Keep components as `.astro` files with Vanilla JS `<script>` tags for interactivity. Avoid React/Islands.
- **Images**: Use `<Picture>` component from `astro:assets` for automatic optimization.
- **Typography**: Prefer components in `src/components/ui/typography/` for consistent text styling.
- **Skeleton System**: 
  - All loading states must use the `src/components/ui/Skeleton.astro` primitive or pre-built specialized skeletons from `src/components/ui/skeletons/`.
  - Use `SkeletonLoader.astro` for global page transition skeletons.

### 5. Build & Validation
- **Linting**: Run `npm run lint` before finalizing changes.
- **Formatting**: Run `npm run format` to ensure code style consistency.
- **Build Test**: Run `npm run build:only` to verify the build pipeline.
