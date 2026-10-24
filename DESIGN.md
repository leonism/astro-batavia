# DESIGN.md — Astro Batavia Design System

> **Purpose:** Single source of truth for the visual design language of Astro Batavia. Intended for LLM agents, contributors, and design tooling to ensure consistency across all pages and components.
>
> **Source of truth for tokens:** `src/styles/global.css`. If this document and that file disagree, the CSS wins. Update this file whenever tokens change.

---

## 1. Foundations

### 1.1 Framework & Tooling

| Aspect                | Value                                                                        |
| --------------------- | ---------------------------------------------------------------------------- |
| **CSS Framework**     | Tailwind CSS v4 (CSS-first config, `@import 'tailwindcss'`)                  |
| **Typography Plugin** | `@tailwindcss/typography` via `@plugin` (prose classes)                      |
| **Dark Mode**         | Class-based: `@variant dark (&:where(.dark, .dark *))`, `.dark` on `<html>`  |
| **Font Loading**      | Astro `fontProviders.google()` with `display: swap`                          |
| **Build**             | Vite + `@tailwindcss/vite` plugin                                            |

### 1.2 Design Philosophy

- **Dual-theme first:** Every color decision must work in both light and dark mode.
- **Token-driven theming:** Themes are swapped by changing Tier-2 semantic tokens only (see 1.3).
- **Glassmorphism navigation:** The header uses `backdrop-blur-xl` with semi-transparent backgrounds.
- **Smooth transitions:** All interactive elements use `transition-all duration-300` as baseline.
- **shadcn/ui-inspired typography:** Standalone typography components mirror shadcn conventions for headings, paragraphs, and utility text.
- **Accessibility:** Focus rings (`ring-2 ring-primary-500 ring-offset-2`), skip links, screen-reader utilities, ARIA landmarks on all major sections, reduced-motion and high-contrast support.

### 1.3 Token Architecture (3 Tiers)

`global.css` follows a strict three-tier hierarchy.

| Tier | Where it lives                     | Purpose                                                              | Example tokens                                         |
| ---- | ---------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| 1    | `@theme`                           | Brand primitives: raw, scale-based values and animation presets      | `--primitive-blue-500`, `--primitive-slate-900`        |
| 2    | `:root` / `.dark` in `@layer base` | Semantic aliases: purpose-driven names that respond to theme         | `--ds-surface-hover`, `--ds-text-primary`              |
| 3    | `@layer components`                | Component classes that consume Tier-2 (and Tailwind aliases) only    | `.theme-toggle`, `.search-result`, `.copy-code-button` |

**Rule:** Components reference Tier-2/3 only. Never reference `--primitive-*` (Tier-1) directly in component CSS or markup. This keeps themes swappable by changing Tier-2 alone.

**Tailwind alias layer.** `@theme` also exposes Tier-1 and Tier-2 values under Tailwind's `--color-*` namespace so they generate utilities:

- `--color-primary-{50…900}` → `--primitive-blue-*` (`bg-primary-600`, `ring-primary-500`, …)
- `--color-gray-{50…900}` → `--primitive-slate-*` (`bg-gray-100`, `text-gray-500`, …)
- `--color-surface-hover | surface-active | surface-selected | surface-selected-strong` → `--ds-surface-*` (`bg-surface-hover`, …)
- `--color-search-highlight-bg | search-highlight-text` → `--ds-search-highlight-*` (`bg-search-highlight-bg`, …)

---

## 2. Color System

### 2.1 Tier-1 Primitives

#### Blue (Primary Brand, HSL, Hue 210°)

All blue primitives use **hue 210**, **saturation 100%**, with lightness stepped from 98% to 20%. They are exposed to Tailwind as `primary-*`.

| Primitive               | Tailwind Token | HSL Value           | Hex Approx | Usage                                                                 |
| ----------------------- | -------------- | ------------------- | ---------- | --------------------------------------------------------------------- |
| `--primitive-blue-50`   | `primary-50`   | `hsl(210 100% 98%)` | `#F5FAFF`  | Subtle selected states                                                |
| `--primitive-blue-100`  | `primary-100`  | `hsl(210 100% 95%)` | `#E0F0FF`  | Tag backgrounds (light), selection, toggle track start                |
| `--primitive-blue-200`  | `primary-200`  | `hsl(210 100% 90%)` | `#BAE0FF`  | Hover tag backgrounds, toggle track end                               |
| `--primitive-blue-300`  | `primary-300`  | `hsl(210 100% 80%)` | `#7AC2FF`  | Link hover (dark)                                                     |
| `--primitive-blue-400`  | `primary-400`  | `hsl(210 100% 70%)` | `#3DA4FF`  | Link (dark), active TOC border (dark)                                 |
| `--primitive-blue-500`  | `primary-500`  | `hsl(210 100% 60%)` | `#0A85FF`  | Focus rings, accent borders, active TOC border (light)                |
| `--primitive-blue-600`  | `primary-600`  | `hsl(210 100% 50%)` | `#0066FF`  | CTA buttons, link (light), hero gradient start (light), skip link bg  |
| `--primitive-blue-700`  | `primary-700`  | `hsl(210 100% 40%)` | `#0052CC`  | Button hover, link hover (light), hero gradient start (dark)          |
| `--primitive-blue-800`  | `primary-800`  | `hsl(210 100% 30%)` | `#003D99`  | Tag text (light mode)                                                 |
| `--primitive-blue-900`  | `primary-900`  | `hsl(210 100% 20%)` | `#002966`  | Tag backgrounds (dark), selected-surface tint (dark)                  |

#### Slate (Neutral)

Matches the **Tailwind Slate** scale. Exposed to Tailwind as `gray-*`, so every `gray-*` utility is Slate.

| Primitive                | Tailwind Token | Hex       | Usage                                                                  |
| ------------------------ | -------------- | --------- | ---------------------------------------------------------------------- |
| `--primitive-slate-50`   | `gray-50`      | `#F8FAFC` | Hover surface (light), inverted text (dark theme base)                 |
| `--primitive-slate-100`  | `gray-100`     | `#F1F5F9` | Active surface (light), scrollbar track (light), shimmer base          |
| `--primitive-slate-200`  | `gray-200`     | `#E2E8F0` | Prose HR / quote borders (light), shimmer mid (light)                  |
| `--primitive-slate-300`  | `gray-300`     | `#CBD5E1` | Strong border (light), prose bullets (light), prose body (dark)        |
| `--primitive-slate-400`  | `gray-400`     | `#94A3B8` | Muted text (light), secondary text (dark), scrollbar thumb (light)     |
| `--primitive-slate-500`  | `gray-500`     | `#64748B` | Secondary text (light), muted text (dark), ordered-list markers        |
| `--primitive-slate-600`  | `gray-600`     | `#475569` | Active surface (dark), strong border (dark), scrollbar thumb (dark)    |
| `--primitive-slate-700`  | `gray-700`     | `#334155` | Prose body (light), hover surface (dark), copy button hover            |
| `--primitive-slate-800`  | `gray-800`     | `#1E293B` | Copy button bg, dark scrollbar track, dark shimmer base                |
| `--primitive-slate-900`  | `gray-900`     | `#0F172A` | Prose headings (light), code block bg (light), inverted text (dark)    |

#### Amber, Green, Red (Feedback)

| Primitive                | Hex       | Usage                                                     |
| ------------------------ | --------- | --------------------------------------------------------- |
| `--primitive-amber-300`  | `#FCD34D` | Reserved                                                  |
| `--primitive-amber-400`  | `#FBBF24` | Search highlight bg (dark)                                |
| `--primitive-amber-600`  | `#D97706` | Reserved                                                  |
| `--primitive-amber-700`  | `#B45309` | Reserved                                                  |
| `--primitive-amber-900`  | `#92400E` | Search highlight text (light)                             |
| `--primitive-green-400`  | `#4ADE80` | Copy success text                                         |
| `--primitive-green-500`  | `#22C55E` | Copy success border (50% mix)                             |
| `--primitive-green-900`  | `#14532D` | Copy success bg (20% mix)                                 |
| `--primitive-red-500`    | `#EF4444` | Reserved (voice search recording uses Tailwind `red-500`) |

### 2.2 Shadcn / Radix Interop Tokens

Raw HSL channels (no `hsl()` wrapper) so they compose with opacity. These intentionally do **not** map to Tier-1 primitives.

| Property               | Light               | Dark                | Hex (Light → Dark)    | Role                  |
| ---------------------- | ------------------- | ------------------- | --------------------- | --------------------- |
| `--background`         | `0 0% 100%`         | `222.2 84% 4.9%`    | `#FFFFFF` → `#020817` | Page background       |
| `--foreground`         | `222.2 84% 4.9%`    | `210 40% 98%`       | `#020817` → `#F8FAFC` | Primary text          |
| `--muted`              | `210 40% 96.1%`     | `217.2 32.6% 17.5%` | `#F1F5F9` → `#1E293B` | Muted surfaces        |
| `--muted-foreground`   | `215.4 16.3% 46.9%` | `215 20.2% 65.1%`   | `#64748B` → `#94A3B8` | Secondary text        |
| `--border`             | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | `#E2E8F0` → `#1E293B` | Default borders       |
| `--input`              | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | `#E2E8F0` → `#1E293B` | Input borders         |
| `--primary`            | `222.2 47.4% 11.2%` | `210 40% 98%`       | `#0F172A` → `#F8FAFC` | Primary accent        |
| `--primary-foreground` | `210 40% 98%`       | `222.2 47.4% 11.2%` | `#F8FAFC` → `#0F172A` | Text on primary       |
| `--ring`               | `222.2 84% 4.9%`    | `212.7 26.8% 83.9%` | `#020817` → `#CBD5E1` | Focus ring            |

> Note: `--primary` (shadcn, raw HSL channels) is **not** the same as `--color-primary-*` (the blue brand scale). Use `primary-*` utilities for brand blue.

### 2.3 Tier-2 Semantic Tokens (`--ds-*`)

Defined on `:root` (light) and `.dark` (dark). Token names are identical across themes; only values change.

#### Shape

| Property      | Value    | Role                                                            |
| ------------- | -------- | --------------------------------------------------------------- |
| `--ds-radius` | `0.5rem` | Base radius; drives `--radius-sm/md/lg` (see Section 5)         |

#### Surfaces

| Property                       | Light                                  | Dark                                                              |
| ------------------------------ | -------------------------------------- | ----------------------------------------------------------------- |
| `--ds-surface-base`            | `hsl(var(--background))`               | `hsl(var(--background))`                                          |
| `--ds-surface-hover`           | `var(--primitive-slate-50)`            | `var(--primitive-slate-700)`                                      |
| `--ds-surface-active`          | `var(--primitive-slate-100)`           | `var(--primitive-slate-600)`                                      |
| `--ds-surface-selected`        | `var(--primitive-blue-50)`             | `color-mix(in srgb, var(--primitive-blue-900) 20%, transparent)`  |
| `--ds-surface-selected-strong` | `var(--primitive-blue-100)`            | `color-mix(in srgb, var(--primitive-blue-900) 30%, transparent)`  |

#### Text

| Property               | Light                         | Dark                          |
| ---------------------- | ----------------------------- | ----------------------------- |
| `--ds-text-primary`    | `hsl(var(--foreground))`      | `hsl(var(--foreground))`      |
| `--ds-text-secondary`  | `var(--primitive-slate-500)`  | `var(--primitive-slate-400)`  |
| `--ds-text-muted`      | `var(--primitive-slate-400)`  | `var(--primitive-slate-500)`  |
| `--ds-text-inverted`   | `var(--primitive-slate-50)`   | `var(--primitive-slate-900)`  |
| `--ds-text-link`       | `var(--primitive-blue-600)`   | `var(--primitive-blue-400)`   |
| `--ds-text-link-hover` | `var(--primitive-blue-700)`   | `var(--primitive-blue-300)`   |

#### Borders & Decorative

| Property             | Light                         | Dark                          |
| -------------------- | ----------------------------- | ----------------------------- |
| `--ds-border-subtle` | `hsl(var(--border))`          | `hsl(var(--border))`          |
| `--ds-border-strong` | `var(--primitive-slate-300)`  | `var(--primitive-slate-600)`  |
| `--ds-hero-grid-color` | `#80808030`                 | `#ffffff12`                   |
| `--hero-grid-color`  | `var(--ds-hero-grid-color)`   | `var(--ds-hero-grid-color)`   |

#### Feedback

| Property                    | Light                         | Dark                         |
| --------------------------- | ----------------------------- | ---------------------------- |
| `--ds-search-highlight-bg`  | `#fef08a`                     | `var(--primitive-amber-400)` |
| `--ds-search-highlight-text`| `var(--primitive-amber-900)`  | `#aaa310`                    |

#### Component-Specific Semantic Tokens

| Property                   | Light                                                              | Dark                                                               |
| -------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `--ds-hero-gradient-start` | `var(--primitive-blue-600)`                                        | `var(--primitive-blue-700)`                                        |
| `--ds-hero-gradient-end`   | `#4f46e5`                                                          | `#4f46e5`                                                          |
| `--ds-toggle-bg-start`     | `var(--primitive-blue-100)`                                        | `var(--primitive-slate-800)`                                       |
| `--ds-toggle-bg-end`       | `var(--primitive-blue-200)`                                        | `var(--primitive-slate-700)`                                       |
| `--ds-toggle-shadow`       | `rgb(0 0 0 / 15%)`                                                 | `rgb(0 0 0 / 30%)`                                                 |
| `--ds-toggle-ring`         | `color-mix(in srgb, var(--primitive-blue-500) 15%, transparent)`   | `color-mix(in srgb, var(--primitive-blue-500) 20%, transparent)`   |
| `--ds-toggle-icon`         | `var(--primitive-slate-700)`                                       | `#ffffff`                                                          |
| `--ds-glass-bg`            | `rgb(255 255 255 / 5%)`                                            | `rgb(0 0 0 / 5%)`                                                  |
| `--ds-glass-border`        | `rgb(255 255 255 / 10%)`                                           | `rgb(255 255 255 / 5%)`                                            |
| `--ds-copy-bg`             | `var(--primitive-slate-800)`                                       | `var(--primitive-slate-800)`                                       |
| `--ds-copy-bg-hover`       | `var(--primitive-slate-700)`                                       | `var(--primitive-slate-700)`                                       |
| `--ds-copy-border`         | `var(--primitive-slate-700)`                                       | `var(--primitive-slate-700)`                                       |
| `--ds-copy-text`           | `var(--primitive-slate-400)`                                       | `var(--primitive-slate-400)`                                       |
| `--ds-copy-text-hover`     | `#ffffff`                                                          | `#ffffff`                                                          |
| `--ds-copy-success-bg`     | `color-mix(in srgb, var(--primitive-green-900) 20%, transparent)`  | same                                                               |
| `--ds-copy-success-border` | `color-mix(in srgb, var(--primitive-green-500) 50%, transparent)`  | same                                                               |
| `--ds-copy-success-text`   | `var(--primitive-green-400)`                                       | same                                                               |

#### Prose Tokens (`--tw-prose-*`)

Drive all colors inside `.prose`. Overriding the plugin's own variable names lets the prose engine follow the theme without `prose-invert`.

| Property                    | Light                         | Dark                          |
| --------------------------- | ----------------------------- | ----------------------------- |
| `--tw-prose-body`           | `var(--primitive-slate-700)`  | `var(--primitive-slate-300)`  |
| `--tw-prose-headings`       | `var(--primitive-slate-900)`  | `#ffffff`                     |
| `--tw-prose-links`          | `var(--primitive-blue-600)`   | `var(--primitive-blue-400)`   |
| `--tw-prose-bold`           | `var(--primitive-slate-900)`  | `#ffffff`                     |
| `--tw-prose-bullets`        | `var(--primitive-slate-300)`  | `var(--primitive-slate-600)`  |
| `--tw-prose-hr`             | `var(--primitive-slate-200)`  | `var(--primitive-slate-700)`  |
| `--tw-prose-quotes`         | `var(--primitive-slate-900)`  | `var(--primitive-slate-100)`  |
| `--tw-prose-quote-borders`  | `var(--primitive-slate-200)`  | `var(--primitive-slate-700)`  |
| `--tw-prose-code`           | `var(--primitive-slate-900)`  | `#ffffff`                     |
| `--tw-prose-pre-bg`         | `var(--primitive-slate-900)`  | `rgb(0 0 0 / 50%)`            |
| `--tw-prose-pre-code`       | `var(--primitive-slate-200)`  | `var(--primitive-slate-300)`  |

### 2.4 Gradient Tokens

| Name                        | Value                                                           | Context                                   |
| --------------------------- | --------------------------------------------------------------- | ----------------------------------------- |
| **Hero gradient (token)**   | `.bg-hero-gradient` → `linear-gradient(to right, var(--ds-hero-gradient-start), var(--ds-hero-gradient-end))` | Theme-aware hero background |
| **Hero CTA primary**        | `bg-linear-to-r from-blue-600 to-indigo-600`                    | Primary call-to-action button             |
| **Hero CTA hover**          | `from-blue-700 to-indigo-700`                                   | Hover state                               |
| **Hero background (light)** | `bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100`       | Hero section                              |
| **Hero background (dark)**  | `from-slate-900 via-slate-800 to-slate-900`                     | Hero section dark                         |
| **Decorative blob 1**       | `from-blue-400/20 to-purple-600/20`                             | Background decoration                     |
| **Decorative blob 2**       | `from-indigo-400/20 to-cyan-400/20`                             | Background decoration                     |
| **Theme toggle track**      | `linear-gradient(135deg, var(--ds-toggle-bg-start), var(--ds-toggle-bg-end))` | `.theme-toggle`             |
| **Shimmer (light)**         | `bg-linear-to-r from-gray-100 via-gray-200 to-gray-100`         | `.shimmer` loading skeleton               |
| **Shimmer (dark)**          | `dark:from-gray-800 dark:via-gray-700 dark:to-gray-800`         | `.shimmer` loading skeleton (dark)        |

### 2.5 Selection & Highlight Colors

| Context             | Light                                                | Dark                                                  |
| ------------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| Search highlight    | `bg-search-highlight-bg text-search-highlight-text`  | Same utilities; token values switch (see 2.3)         |
| Search highlight (high contrast) | `bg-yellow-300 text-black`              | Same                                                  |
| Copy button success | `--ds-copy-success-*` (green-500 border at 50%, green-900 bg at 20%, green-400 text) | Same |

> `global.css` does not define a `::selection` rule. Any text-selection styling must live in a layout or component stylesheet.

---

## 3. Typography

### 3.1 Font Stacks

Defined in `@theme`.

| Token              | CSS Variable  | Stack                                                              |
| ------------------ | ------------- | ------------------------------------------------------------------ |
| **Sans (primary)** | `--font-sans` | `'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif` |
| **Mono**           | `--font-mono` | `'JetBrains Mono', ui-monospace, monospace`                        |

- **Plus Jakarta Sans** is loaded via Google Fonts with weights **200–800**, `latin` subset, `normal` + `italic` styles.
- **Body base styles** (`@layer base`): `antialiased transition-colors duration-300`, `background-color: var(--ds-surface-base)`, `color: var(--ds-text-primary)`, `font-family: var(--font-sans)`, `font-feature-settings: 'rlig' 1, 'calt' 1`.
- `html` uses `scroll-smooth`.

### 3.2 Typography Components (`src/components/ui/typography/`)

shadcn/ui-inspired Astro components for consistent text styling outside prose scope.

| Component              | Element        | Classes                                                                             | Use Case             |
| ---------------------- | -------------- | ----------------------------------------------------------------------------------- | -------------------- |
| `TypographyH1`         | `<h1>`         | `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`                    | Page titles          |
| `TypographyH2`         | `<h2>`         | `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0`        | Section titles       |
| `TypographyH3`         | `<h3>`         | `scroll-m-20 text-2xl font-semibold tracking-tight`                                 | Subsection titles    |
| `TypographyH4`         | `<h4>`         | `scroll-m-20 text-xl font-semibold tracking-tight`                                  | Minor headings       |
| `TypographyP`          | `<p>`          | `leading-7 font-stretch-semi-expanded [&:not(:first-child)]:mt-6`                   | Body paragraphs      |
| `TypographyLead`       | `<p>`          | `text-xl font-stretch-semi-expanded text-muted-foreground`                          | Introductory text    |
| `TypographyLarge`      | `<div>`        | `text-lg font-semibold`                                                             | Emphasized body text |
| `TypographySmall`      | `<small>`      | `text-sm font-medium leading-none`                                                  | Fine print, captions |
| `TypographyMuted`      | `<p>`          | `text-sm font-stretch-semi-expanded text-muted-foreground`                          | De-emphasized text   |
| `TypographyBlockquote` | `<blockquote>` | `mt-6 border-l-2 pl-6 italic`                                                       | Quotations           |
| `TypographyInlineCode` | `<code>`       | `relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold` | Inline code          |

### 3.3 Prose Typography (Markdown/MDX Content)

Applied via `prose prose-base` on article content containers. The custom `.prose` block in `global.css` sits on top of `@tailwindcss/typography`; colors come from the `--tw-prose-*` tokens (2.3), not from hard-coded RGB values.

> **Caution:** Do not add `dark:prose-invert` to prose containers. `prose-invert` sets the plugin's invert tokens directly on the element, which takes precedence over the `.dark` values inherited from `<html>` and bypasses the custom dark prose tokens.

**Base `.prose` rules**

| Rule                | Value                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Container           | `max-w-none text-pretty text-(--tw-prose-body)`                                                |
| Links               | `font-medium underline decoration-2 underline-offset-4 transition-colors`, color `--tw-prose-links`, hover `decoration-primary-600` |
| Strong              | `font-semibold`, color `--tw-prose-bold`                                                       |
| Lists (`ol`, `ul`)  | `list-none pl-0`; `li` is `relative pl-6`                                                      |
| Ordered markers     | `::before` with `counter(list-item) "."`, `absolute left-0 text-gray-500`                      |
| Unordered markers   | `::before` dot: `absolute left-0 top-[0.6875em] h-1.5 w-1.5 rounded-full bg-(--tw-prose-bullets)` |
| All headings (h1–h4)| `scroll-mt-32 font-bold`, color `--tw-prose-headings`                                          |
| `h1`                | `text-4xl mb-8 font-extrabold leading-tight`                                                   |
| `h2`                | `text-2xl mt-12 mb-4 leading-snug`                                                             |
| `h3`                | `text-xl mt-8 mb-2`                                                                            |
| `h4`                | Plugin defaults plus the shared heading rule above                                             |
| Code block (`pre.astro-code`) | `relative my-8 overflow-x-auto rounded-lg border p-4 text-sm leading-relaxed`; border `--ds-border-strong`; bg `--tw-prose-pre-bg !important`; text `--tw-prose-pre-code !important` |
| Inline code         | `rounded-sm px-1.5 py-0.5 font-mono text-sm`, bg `--ds-surface-active`, wrapped in backtick `::before`/`::after` |
| Tables              | `w-full border-collapse border my-8 text-sm`; cells `border px-4 py-2 text-left`; borders `--ds-border-strong` |
| Table header        | `font-semibold`, bg `--ds-surface-hover`                                                       |
| Blockquote          | Not customized in `global.css`; uses plugin styling driven by `--tw-prose-quotes` and `--tw-prose-quote-borders` |

All custom prose selectors use `:where(...):not(:where([class~='not-prose'] *))`, so adding `not-prose` on a wrapper opts content out.

Elements not listed (paragraph, `hr`, `img`, `figure`, etc.) fall back to `@tailwindcss/typography` defaults.

### 3.4 Heading Scale — Hero Section

| Breakpoint       | Size Class | Approx Size    |
| ---------------- | ---------- | -------------- |
| Default (mobile) | `text-5xl` | 3rem / 48px    |
| `sm`             | `text-6xl` | 3.75rem / 60px |
| `lg`             | `text-7xl` | 4.5rem / 72px  |
| `xl`             | `text-8xl` | 6rem / 96px    |

Weight: `font-bold`, tracking: `tracking-tight`.

### 3.5 Card Title Scale

| Variant               | Size                        | Weight          |
| --------------------- | --------------------------- | --------------- |
| Featured card title   | `text-2xl md:text-3xl`      | `font-semibold` |
| Standard card title   | `text-xl`                   | `font-semibold` |
| Featured card excerpt | `text-base`, `line-clamp-4` | normal          |
| Standard card excerpt | `text-sm`, `line-clamp-3`   | normal          |

---

## 4. Spacing & Layout

### 4.1 Global Container

| Property           | Value                        |
| ------------------ | ---------------------------- |
| Max width          | `max-w-7xl` (80rem / 1280px) |
| Horizontal padding | `px-4 sm:px-6 lg:px-8`       |
| Centering          | `mx-auto`                    |

### 4.2 Page Sections

| Section      | Padding                                           |
| ------------ | ------------------------------------------------- |
| Hero         | `py-20 lg:py-32` (default), `min-h-screen` (home) |
| Newsletter   | `py-16`                                           |
| Footer       | `py-2` (compact)                                  |
| Blog article | `py-8`                                            |

### 4.3 Navigation Bar

| Property       | Value                        |
| -------------- | ---------------------------- |
| Height         | `h-16` (4rem / 64px)         |
| Position       | `fixed top-0 z-50`           |
| Content offset | `pt-16` on `<main>`          |
| Breadcrumb     | `sticky top-16 z-40`, `h-11` |

### 4.4 Blog Post Layout (Desktop)

Two-column grid with sticky TOC sidebar:

```
lg:grid lg:grid-cols-[1fr_220px] lg:gap-10
xl:grid-cols-[1fr_240px] xl:gap-12
```

### 4.5 Footer Grid

```
grid grid-cols-1 md:grid-cols-5
```

### 4.6 Common Spacing Tokens

| Token       | Value                   | Usage                                 |
| ----------- | ----------------------- | ------------------------------------- |
| `space-y-6` | 1.5rem between children | Hero content stack, article header    |
| `gap-4`     | 1rem                    | CTA buttons, form elements, card grid |
| `gap-2`     | 0.5rem                  | Tag groups, metadata items            |
| `mb-6`      | 1.5rem                  | Hero title bottom margin              |
| `mb-8`      | 2rem                    | Hero subtitle, section spacing        |
| `p-6`       | 1.5rem                  | Card content padding                  |
| `p-8`       | 2rem                    | Featured card padding                 |
| `px-4 py-2` | —                       | Standard button padding               |
| `px-6 py-3` | —                       | CTA button padding (mobile)           |
| `px-8 py-4` | —                       | CTA button padding (desktop)          |

---

## 5. Border Radius

`global.css` overrides Tailwind's `sm`, `md`, `lg`, and `full` radii in `@theme`, derived from `--ds-radius` (`0.5rem`). Changing `--ds-radius` rescales all three.

| Token          | Definition                     | Value      | Context                                       |
| -------------- | ------------------------------ | ---------- | --------------------------------------------- |
| `rounded-sm`   | `calc(var(--ds-radius) - 4px)` | `0.25rem` (4px) | Inline code, search highlights, tight chips |
| `rounded-md`   | `calc(var(--ds-radius) - 2px)` | `0.375rem` (6px) | Form inputs, copy button                  |
| `rounded-lg`   | `var(--ds-radius)`             | `0.5rem` (8px) | Cards (standard), code blocks, small buttons, sort select |
| `rounded-full` | `9999px`                       | `9999px`   | Tags, avatars, filter pills, scrollbar thumb, theme toggle |

Tailwind defaults still apply for the sizes not overridden:

| Token         | Value     | Context                                       |
| ------------- | --------- | --------------------------------------------- |
| `rounded-xl`  | `0.75rem` | Mobile nav icon containers                    |
| `rounded-2xl` | `1rem`    | CTA buttons, mobile nav links, featured cards |
| `rounded-3xl` | `1.5rem`  | Feature cards                                 |

---

## 6. Shadows & Effects

### 6.1 Shadow Scale

| Class                | Context                                                         |
| -------------------- | --------------------------------------------------------------- |
| `shadow-inner`       | Theme toggle base                                               |
| `shadow-sm`          | Default card, prose images, tag filter hover                    |
| `shadow-md`          | Active tag filter                                               |
| `shadow-lg`          | Card hover, search result hover, focused search input, suggestions dropdown, header on scroll |
| `shadow-xl`          | Featured card base, `aria-selected` search result               |
| `shadow-2xl`         | Featured card hover, CTA hover                                  |
| `shadow-blue-500/25` | CTA button glow on hover                                        |
| `shadow-blue-500/30` | Active mobile nav icon                                          |

### 6.2 Glassmorphism

```css
/* Navigation header */
bg-white/50 backdrop-blur-xl dark:bg-slate-900/80
border-b border-slate-200/50 dark:border-slate-700/50

/* Breadcrumb bar */
bg-white/90 backdrop-blur-lg dark:bg-slate-900/80

/* Generic glass utility (token-driven, theme-aware) */
.glass {
  @apply backdrop-blur-md border;
  background-color: var(--ds-glass-bg);
  border-color: var(--ds-glass-border);
}
```

### 6.3 Decorative Blurs

Hero section uses two `w-80 h-80 rounded-full blur-3xl` elements with gradient fills positioned absolutely for ambient glow effects.

---

## 7. Animations & Transitions

### 7.1 Transition Defaults

| Context             | Duration       | Easing         |
| ------------------- | -------------- | -------------- |
| General interactive | `duration-300` | default (ease) |
| Color changes       | `duration-200` | default        |
| Theme transition    | `duration-300` | default        |
| Search UI           | `duration-200` | `ease-in-out`  |
| Search status       | `duration-300` | `ease-in-out`  |
| Hero section        | `duration-500` | default        |

### 7.2 Keyframe Animations

Presets and `@keyframes` are both declared in `@theme`.

| Token                    | Animation Definition                            | Description                                 |
| ------------------------ | ----------------------------------------------- | ------------------------------------------- |
| `--animate-aurora`       | `aurora 8s linear infinite`                     | Background position shift for gradient text (`0% 0%` → `-200% 0%`) |
| `--animate-shimmer`      | `skeleton-shimmer 2s infinite linear`           | Loading skeleton sweep (`translateX(100%)`) |
| `--animate-fade-in`      | `fade-in 0.5s ease-out`                         | Element entrance (opacity + `translateY(10px)`) |
| `--animate-fade-in-fast` | `fade-in 0.3s ease-out forwards`                | Fast element entrance (search overlay)      |
| `--animate-fade-in-up`   | `fade-in-up 0.3s ease-out forwards`             | Search result entrance (opacity + `scale(0.95)` + `translateY(10px)`) |
| `--animate-bounce-twice` | `bounce-custom 1s ease-in-out 2`                | No-results icon bounce                      |
| `--animate-spin-fast`    | `spin 0.8s linear infinite`                     | Loading spinners                            |

### 7.3 Interaction Micro-Animations

| Element              | Effect                                                              |
| -------------------- | ------------------------------------------------------------------- |
| Card hover           | `hover:scale-[1.02]`, `hover:-translate-y-2` (featured cards)       |
| CTA button hover     | `hover:scale-105`                                                   |
| Nav link underline   | Width from `w-0` to `w-full` on hover, `duration-300`               |
| Mobile nav chevron   | `translate-x` from `-2` to `0` on hover                             |
| Search input focus   | `scale-[1.02] shadow-lg`                                            |
| Search result hover  | `scale-[1.01] shadow-lg -translate-y-0.5`                           |
| Search result selected | `scale-[1.02] shadow-lg -translate-y-px`                          |
| Tag filter hover     | `scale-105 shadow-sm` (inactive)                                    |
| Tag filter active    | `scale-105 shadow-md`                                               |
| Voice search button  | `opacity-75 → 100`, `hover:scale-110`; `.recording` adds `animate-pulse text-red-500` |
| Search clear button  | Fades/scales in (`scale-95 opacity-0` → `scale-100 opacity-100`) when the input is non-empty |
| Read More arrow      | `group-hover:translate-x-1`                                         |
| Featured card icon   | `group-hover:scale-110`                                             |

### 7.4 Reduced Motion

Transitions and animations are disabled when `prefers-reduced-motion: reduce` is set:

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    @apply !transition-none !animate-none scroll-auto;
  }

  .search-result:hover { transform: none; }
}
```

---

## 8. Component Patterns

### 8.1 Blog Card

| Variant      | Article Classes                                                                | Image                     | Min/Max Height                |
| ------------ | ------------------------------------------------------------------------------ | ------------------------- | ----------------------------- |
| **Standard** | `rounded-lg shadow-sm border flex flex-col hover:shadow-lg hover:scale-[1.02]` | `aspect-video w-full`     | `min-h-[420px] max-h-[480px]` |
| **Featured** | `md:flex-row md:shadow-xl md:hover:shadow-2xl md:min-h-[400px]`                | `md:w-1/2 h-96 md:h-full` | —                             |

- Background: `bg-white dark:bg-gray-800`
- Border: `border border-gray-200 dark:border-gray-700`
- Image hover: `group-hover:scale-105 transition-transform duration-300`
- Title hover: `group-hover:text-primary-600 dark:group-hover:text-primary-400`
- Metadata container: `mt-auto` (pushes to bottom via flex)

### 8.2 Tag Pills

```
rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800
hover:bg-primary-200
dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800
```

Overflow indicator: `bg-gray-100 dark:bg-gray-700` with `+N` count.

### 8.3 Buttons

| Variant           | Classes                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary CTA**   | `text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl`                                 |
| **Secondary CTA** | `text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 rounded-2xl` |
| **Read More**     | `bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:scale-105 hover:bg-primary-700`                                          |
| **Newsletter**    | `bg-white text-blue-600 font-semibold text-lg rounded-2xl hover:bg-blue-50 hover:scale-105`                                                        |

### 8.4 Navigation

- **Desktop links:** `font-medium` with animated underline (`h-0.5 bg-blue-600`).
- **Active state:** `text-blue-600 dark:text-blue-400` with full-width underline.
- **Mobile links:** `text-lg font-semibold rounded-2xl` with icon container (`h-11 w-11 rounded-xl`), ring border, and slide-in chevron.
- **Active mobile:** `bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-md ring-1 ring-blue-100`.

### 8.5 Featured Card (Services/Features)

```
rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg
hover:-translate-y-2 hover:shadow-2xl transition-all duration-500
```

- Icon: `w-12 h-12 rounded-2xl bg-linear-to-br` with custom gradient props.
- Title hover: `group-hover:text-blue-600 dark:group-hover:text-blue-400`.

### 8.6 Theme Toggle

Component classes in `@layer components`. Markup: a `.theme-toggle` button containing `.theme-toggle-sun`, `.theme-toggle-moon`, and `.theme-toggle-knob`.

| Class                 | Behavior                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `.theme-toggle`       | `relative inline-block w-12 h-6 rounded-full border-none cursor-pointer shrink-0 mx-1 p-0 shadow-inner transition-all duration-300`; track is the `--ds-toggle-bg-*` gradient |
| `.theme-toggle:hover` | Inset shadow `--ds-toggle-shadow` plus a 3px ring `--ds-toggle-ring`                                       |
| `:focus-visible`      | `outline-none ring-2 ring-primary-500 ring-offset-2`                                                       |
| `.theme-toggle-icon`  | `absolute top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none`, color `--ds-toggle-icon`            |
| `.theme-toggle-sun`   | `left-0.5`; hidden in light, `opacity-100` in `.dark`                                                      |
| `.theme-toggle-moon`  | `right-0.5`; visible in light, `opacity-0` in `.dark`                                                      |
| `.theme-toggle-knob`  | `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow z-20`; `translate-x-6` in `.dark`          |

### 8.7 Code Block Copy Button

```
.copy-code-button  absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200
```

| State      | Tokens                                                                       |
| ---------- | ---------------------------------------------------------------------------- |
| Default    | bg `--ds-copy-bg`, border `--ds-copy-border`, text `--ds-copy-text`          |
| `:hover`   | bg `--ds-copy-bg-hover`, text `--ds-copy-text-hover`                         |
| `.copied`  | bg `--ds-copy-success-bg`, border `--ds-copy-success-border`, text `--ds-copy-success-text` |

### 8.8 Search System

All search styling lives in `global.css` (`@layer components`).

| Selector                       | Purpose / Key Styles                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `#search-overlay`              | `animate-fade-in-fast`                                                                                        |
| `#search-results`              | `scroll-smooth`; `[role='listbox']` removes focus outline                                                     |
| `#main-search-input`           | `transition-all duration-200 ease-in-out`; `:focus` → `scale-[1.02] shadow-lg`; `[aria-busy='true']` → `cursor-wait opacity-75` |
| `.search-highlight`            | `bg-search-highlight-bg text-search-highlight-text rounded-sm px-1 py-0.5 font-medium`, `box-decoration-break: clone` |
| `.search-result`               | `relative transform transition-all duration-200 ease-in-out animate-fade-in-up`; `[role='option']` is `cursor-pointer` |
| `.search-result:hover`         | `scale-[1.01] shadow-lg -translate-y-0.5`                                                                     |
| `.search-result:focus-within`  | `ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900`                                             |
| `.search-result.selected`      | `bg-surface-selected ring-2 ring-primary-500 ring-offset-2 scale-[1.02] shadow-lg border-l-4 border-primary-500 -translate-y-px` |
| `.search-result[aria-selected='true']` | `bg-surface-selected-strong ring-2 ring-primary-600 ring-offset-2 shadow-xl`                          |
| `.search-suggestions`          | `absolute left-0 right-0 top-full z-50 max-h-96 overflow-y-auto rounded-b-lg shadow-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800`; hidden by default (`pointer-events-none scale-95 opacity-0`), `.show` reveals (`pointer-events-auto scale-100 opacity-100`) |
| `.suggestion-item`             | `cursor-pointer px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0`; hover/focus `bg-surface-hover`; `:focus` ring; `[aria-selected='true']` → `bg-surface-selected text-primary-900 dark:text-primary-100`; `:active` → `bg-surface-selected-strong` |
| `.search-loading`              | Inline spinner via `::after`: `ml-2 h-4 w-4 rounded-full border-2 border-primary-500 border-t-transparent animate-spin-fast` |
| `.search-status`               | `transition-all duration-300 ease-in-out`; `.updating` → `scale-95 opacity-50`                                |
| `.no-results`                  | `py-12 text-center animate-fade-in`; child `svg` is `mx-auto mb-4 text-gray-300 dark:text-gray-600 animate-bounce-twice` |
| `.tag-filter`                  | `rounded-full px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-surface-hover cursor-pointer select-none`; focus ring; `.active` → `border-primary-500 bg-primary-500 text-white dark:border-primary-600 dark:bg-primary-600 scale-105 shadow-md` |
| `#sort-select`                 | `appearance-none rounded-lg border border-gray-300 pl-3 pr-10 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-gray-100`; focus `border-primary-500 ring-2 ring-primary-500`; custom chevron via inline SVG background (right 0.5rem, 1.5em) |
| `.voice-search-btn`            | `opacity-75 hover:opacity-100 hover:scale-110`; `.recording` → `animate-pulse text-red-500`                   |
| `#search-clear-button`         | Hidden until `#main-search-input:not(:placeholder-shown) + div` reveals it                                    |
| `.keyboard-focused`            | `ring-2 ring-primary-500/50` on `.search-result-item` and `.suggestion-item`                                  |
| Scrollbars                     | `#search-results-container` / `#search-results`: 6px, transparent track, thumb `bg-gray-300 dark:bg-gray-600 rounded-[3px]` |

### 8.9 Blog TOC Sidebar

| Selector                             | Styles                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `.toc-link.is-active`                | color `--ds-text-link`, `border-left: 2px solid var(--color-primary-500)`, `padding-left: calc(0.75rem - 2px)`, `font-weight: 600` |
| `.toc-link.is-active[class*='pl-6']` | `padding-left: calc(1.5rem - 2px)` (nested level)                                                                |
| `.dark .toc-link.is-active`          | border color `--color-primary-400`                                                                               |
| `.toc-sidebar [scrollbar-width~='thin']` | `scrollbar-width: thin`, thumb `--ds-border-strong` (dark: `--primitive-slate-700`), transparent track       |

### 8.10 Loading Skeleton

`.shimmer`: `animate-shimmer bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 bg-size-[200px_100%]`, dark: `from-gray-800 via-gray-700 to-gray-800`.

---

## 9. Scrollbar

Global (`@layer base`):

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { @apply bg-gray-100 dark:bg-gray-800; }
::-webkit-scrollbar-thumb { @apply rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500; }
```

Search results and the TOC sidebar use slimmer variants (see 8.8 and 8.9).

---

## 10. Accessibility Tokens

| Feature            | Implementation                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Focus ring**     | `ring-2 ring-primary-500 ring-offset-2` on interactive `:focus-visible` / `:focus-within` states                 |
| **Skip link**      | `.skip-link`: `absolute left-4 top-4 z-50 -translate-y-12 rounded bg-primary-600 px-4 py-2 text-white transition-transform focus:translate-y-0` |
| **Screen reader**  | `.sr-only` (1px clipped box); `.sr-only-focusable:focus` becomes visible: `static m-0 h-auto w-auto overflow-visible p-1 rounded border border-gray-300 bg-white text-black whitespace-normal` |
| **Reduced motion** | `prefers-reduced-motion: reduce` disables transitions and animations (see 7.4)                                   |
| **High contrast**  | `prefers-contrast: high`: `.search-highlight` → `bg-yellow-300 text-black`; `.search-result` → `border-2 border-gray-800 dark:border-gray-200` |
| **Scroll offset**  | All prose headings: `scroll-mt-32` (clears fixed header + breadcrumb)                                           |
| **Smooth scroll**  | `html { @apply scroll-smooth }` (disabled under reduced motion via `scroll-auto`)                                |
| **ARIA landmarks** | `role="navigation"`, `role="main"`, `role="contentinfo"`, `aria-labelledby` on sections                          |
| **ARIA states in CSS** | Search UI styles `[role='listbox']`, `[role='option']`, `[aria-selected='true']`, `[aria-busy='true']`       |

---

## 11. Responsive Breakpoints

Standard Tailwind breakpoints are used throughout:

| Prefix | Min Width | Key Layout Changes                                                   |
| ------ | --------- | -------------------------------------------------------------------- |
| `sm`   | 640px     | Form stacks → row, CTA padding increase, tag filter size             |
| `md`   | 768px     | Featured card → horizontal, footer → 5-col grid, desktop nav visible |
| `lg`   | 1024px    | Blog → 2-col with TOC sidebar, hero padding increase                 |
| `xl`   | 1280px    | TOC sidebar wider (240px), hero text → `text-8xl`                    |

Additional `max-width: 640px` overrides in `global.css`:

| Selector            | Override           |
| ------------------- | ------------------ |
| `.search-result`    | `p-3`              |
| `.suggestion-item`  | `px-3 py-2`        |
| `.tag-filter`       | `px-2 py-1 text-xs`|

---

## 12. Code Syntax Highlighting

| Property    | Value                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------- |
| Theme       | `github-dark` (both light and dark via Shiki dual-theme)                                           |
| Block       | `pre.astro-code` inside `.prose` (see 3.3)                                                         |
| Background  | `--tw-prose-pre-bg` — light `slate-900`, dark `rgb(0 0 0 / 50%)` (`!important`)                    |
| Text color  | `--tw-prose-pre-code` — light `slate-200`, dark `slate-300` (`!important`)                         |
| Border      | `border` with color `--ds-border-strong`, `rounded-lg`                                             |
| Padding     | `p-4`, `my-8`, `text-sm leading-relaxed`, `overflow-x-auto`                                        |
| Copy button | See 8.7                                                                                            |

---

## 13. Print Styles

- `.no-print` elements hidden (`display: none !important`)
- `body`: `bg-white text-black`
- Links underlined, with `href` appended after the text (`font-size: 0.8em`, color `#666`)
- Hidden: `.search-suggestions`, `.tag-filter`, `#sort-select`, `.voice-search-btn`, `#search-clear-button`
- `.search-result`: `mb-4 break-inside-avoid border border-gray-300`
- `.search-highlight`: `bg-gray-200 text-black`

---

## 14. File Map

| File                                      | Purpose                                                                                                          |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/styles/global.css`                   | Complete token system (Tier 1–3), base styles, component classes (toggle, search, TOC, copy button), prose engine, a11y utilities, media overrides |
| `astro.config.mjs`                        | Font loading (Plus Jakarta Sans), Shiki config                                                                   |
| `src/components/ui/typography/`           | 13 reusable typography components (shadcn pattern)                                                               |
| `src/services/BlogCardService.ts`         | CSS class generation for blog card variants                                                                      |
| `src/components/ui/BaseHero.astro`        | Configurable hero with decorative elements                                                                       |
| `src/components/navigation/`              | Glassmorphism header, animated nav links                                                                         |
| `src/components/cards/FeaturedCard.astro` | Service/feature cards with gradient icons                                                                        |

> Search styles and the palette now live in `global.css` (`@theme` / `@layer components`). The previously documented `src/styles/enhanced-search.css` and `tailwind.config.mjs` palette/prose config are superseded by it; remove those files if they are no longer imported.

---

## 15. Key Conventions for Agents

1. **Respect the token tiers.** Components use Tier-2 (`--ds-*`) tokens or Tailwind aliases (`primary-*`, `gray-*`, `surface-*`, `search-highlight-*`). Never use `--primitive-*` directly.
2. **Always use the primary HSL scale** (`primary-50` through `primary-900`). Never use raw blue/indigo outside of gradients.
3. **Use `gray-*` tokens** (Slate scale) for all neutral colors. Do not introduce new gray shades.
4. **New themed values go in Tier-2.** Add the `--ds-*` token to both `:root` and `.dark` with the same name, and expose it under `--color-*` in `@theme` only if a Tailwind utility is needed.
5. **Font family** must always be `var(--font-sans)` for body and `var(--font-mono)` for code.
6. **Dark mode**: Use `dark:` prefix variants. The `.dark` class is toggled on `<html>`. Prefer tokens that already switch with the theme over per-element `dark:` overrides.
7. **Border radius**: `rounded-sm/md/lg` derive from `--ds-radius`. Cards use `rounded-lg` or `rounded-3xl` (featured). Buttons use `rounded-2xl` (CTA) or `rounded-lg` (small). Tags/pills always `rounded-full`.
8. **Transitions**: Default `transition-all duration-300`. Use `duration-200` for small color changes, `duration-500` for large layout shifts. Every animation must be safe under `prefers-reduced-motion`.
9. **Container**: Always wrap page content in `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
10. **Typography components** should be used for standalone text elements outside of markdown prose scope. Within prose, rely on the `.prose` engine; do not add `prose-invert`.
11. **Images in card grids** must use `aspect-video` for consistent vertical alignment.
12. **Metadata text** (author, date) should use `min-w-0` and `truncate` inside flex containers.

---

## 16. Known Deviations & Open Items

Gaps in `global.css` that agents and contributors should be aware of (not yet resolved in code):

| Item | Detail |
| ---- | ------ |
| **Raw values in Tier-2** | `--ds-hero-gradient-end` (`#4f46e5`), `--ds-search-highlight-bg` light (`#fef08a`), `--ds-search-highlight-text` dark (`#aaa310`), and several `#ffffff` values are hard-coded instead of mapping to primitives. |
| **Dark search highlight contrast** | `#aaa310` text on `#fbbf24` (amber-400) is low contrast. Consider `--primitive-amber-900` for both themes. |
| **Tier-3 using Tier-1 alias** | `.toc-link.is-active` uses `var(--color-primary-500/400)` rather than a semantic `--ds-*` token. |
| **Unused primitives** | `amber-300`, `amber-600`, `amber-700`, and `red-500` are defined but not consumed in `global.css`. |
| **Prose invert** | If any markup still applies `dark:prose-invert`, it overrides the custom dark prose tokens (see 3.3). |
| **Selection color** | No `::selection` rule exists in `global.css`. |
