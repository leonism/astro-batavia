# DESIGN.md — Astro Batavia Design System

> **Purpose:** Single source of truth for the visual design language of Astro Batavia. Intended for LLM agents, contributors, and design tooling to ensure consistency across all pages and components.

---

## 1. Foundations

### 1.1 Framework & Tooling

| Aspect                | Value                                               |
| --------------------- | --------------------------------------------------- |
| **CSS Framework**     | Tailwind CSS v4 (CSS-first config)                  |
| **Typography Plugin** | `@tailwindcss/typography` (prose classes)           |
| **Dark Mode**         | Class-based (`.dark` selector)                      |
| **Font Loading**      | Astro `fontProviders.google()` with `display: swap` |
| **Build**             | Vite + `@tailwindcss/vite` plugin                   |

### 1.2 Design Philosophy

- **Dual-theme first:** Every color decision must work in both light and dark mode.
- **Glassmorphism navigation:** The header uses `backdrop-blur-xl` with semi-transparent backgrounds.
- **Smooth transitions:** All interactive elements use `transition-all duration-300` as baseline.
- **shadcn/ui-inspired typography:** Standalone typography components mirror shadcn conventions for headings, paragraphs, and utility text.
- **Accessibility:** Focus rings (`ring-2 ring-primary-500 ring-offset-2`), skip links, screen-reader utilities, ARIA landmarks on all major sections.

---

## 2. Color System

### 2.1 Primary Palette (HSL, Hue 210°)

All primary colors use **hue 210**, **saturation 100%**, with lightness stepped from 98% to 20%.

| Token         | CSS Variable          | HSL Value           | Hex Approx | Usage                                                                 |
| ------------- | --------------------- | ------------------- | ---------- | --------------------------------------------------------------------- |
| `primary-50`  | `--color-primary-50`  | `hsl(210 100% 98%)` | `#F5FAFF`  | Subtle selected states                                                |
| `primary-100` | `--color-primary-100` | `hsl(210 100% 95%)` | `#E0F0FF`  | Tag backgrounds (light), selection                                    |
| `primary-200` | `--color-primary-200` | `hsl(210 100% 90%)` | `#BAE0FF`  | Hover tag backgrounds                                                 |
| `primary-300` | `--color-primary-300` | `hsl(210 100% 80%)` | `#7AC2FF`  | —                                                                     |
| `primary-400` | `--color-primary-400` | `hsl(210 100% 70%)` | `#3DA4FF`  | —                                                                     |
| `primary-500` | `--color-primary-500` | `hsl(210 100% 60%)` | `#0A85FF`  | Focus rings, accent borders, blockquote borders                       |
| `primary-600` | `--color-primary-600` | `hsl(210 100% 50%)` | `#0066FF`  | CTA buttons, active nav underlines, link hover, "Read More" button bg |
| `primary-700` | `--color-primary-700` | `hsl(210 100% 40%)` | `#0052CC`  | Button hover state                                                    |
| `primary-800` | `--color-primary-800` | `hsl(210 100% 30%)` | `#003D99`  | Tag text (light mode)                                                 |
| `primary-900` | `--color-primary-900` | `hsl(210 100% 20%)` | `#002966`  | Tag backgrounds (dark mode)                                           |

### 2.2 Gray / Neutral Palette (Slate)

Matches the **Tailwind Slate** scale. Used for text, borders, backgrounds, and surfaces.

| Token      | Hex       | Usage                                                        |
| ---------- | --------- | ------------------------------------------------------------ |
| `gray-50`  | `#F8FAFC` | Muted background (light), footer bg                          |
| `gray-100` | `#F1F5F9` | Secondary background, scrollbar track, inline code bg        |
| `gray-200` | `#E2E8F0` | Borders, input borders, table borders, dividers              |
| `gray-300` | `#CBD5E1` | Breadcrumb separators, disabled text                         |
| `gray-400` | `#94A3B8` | Scrollbar thumb, muted foreground (dark), scroll indicator   |
| `gray-500` | `#64748B` | Secondary text, muted foreground (light)                     |
| `gray-600` | `#475569` | Body text (light mode prose), description text               |
| `gray-700` | `#334155` | Dark mode borders, code block borders                        |
| `gray-800` | `#1E293B` | Dark mode card bg, muted bg (dark), dark mode inline code bg |
| `gray-900` | `#0F172A` | Dark mode page bg, body text (dark mode foreground)          |

### 2.3 Semantic CSS Custom Properties

Defined as raw RGB/HSL channel values on `:root` and `.dark` for composability.

#### Light Theme (`:root`)

| Property               | RGB/HSL Channels | Hex       | Role                  |
| ---------------------- | ---------------- | --------- | --------------------- |
| `--background`         | `0 0% 100%`      | `#FFFFFF` | Page background       |
| `--foreground`         | `34 40 49`       | `#222831` | Primary text          |
| `--muted`              | `248 250 252`    | `#F8FAFC` | Muted surfaces        |
| `--muted-foreground`   | `100 116 139`    | `#64748B` | Secondary text        |
| `--card`               | `255 255 255`    | `#FFFFFF` | Card surface          |
| `--card-foreground`    | `34 40 49`       | `#222831` | Card text             |
| `--border`             | `226 232 240`    | `#E2E8F0` | Default borders       |
| `--input`              | `226 232 240`    | `#E2E8F0` | Input borders         |
| `--primary`            | `14 165 233`     | `#0EA5E9` | Primary accent        |
| `--primary-foreground` | `255 255 255`    | `#FFFFFF` | Text on primary       |
| `--secondary`          | `241 245 249`    | `#F1F5F9` | Secondary surface     |
| `--accent`             | `210 20% 95%`    | `#F1F5F9` | Accent surface        |
| `--destructive`        | `0 84% 60%`      | `#EF4444` | Error/danger          |
| `--ring`               | `210 100% 50%`   | `#0066FF` | Focus ring            |
| `--radius`             | `0.5rem`         | —         | Default border-radius |

#### Dark Theme (`.dark`)

| Property             | RGB/HSL Channels | Hex       | Role              |
| -------------------- | ---------------- | --------- | ----------------- |
| `--background`       | `15 23 42`       | `#0F172A` | Page background   |
| `--foreground`       | `241 245 249`    | `#F1F5F9` | Primary text      |
| `--muted`            | `30 41 59`       | `#1E293B` | Muted surfaces    |
| `--muted-foreground` | `148 163 184`    | `#94A3B8` | Secondary text    |
| `--border`           | `51 65 85`       | `#334155` | Default borders   |
| `--primary`          | `210 100% 60%`   | `#3B82F6` | Primary accent    |
| `--secondary`        | `210 10% 23%`    | `#334155` | Secondary surface |
| `--ring`             | `210 100% 60%`   | `#3B82F6` | Focus ring        |

### 2.4 Gradient Tokens

| Name                        | Value                                                           | Context                       |
| --------------------------- | --------------------------------------------------------------- | ----------------------------- |
| **Hero CTA primary**        | `bg-linear-to-r from-blue-600 to-indigo-600`                    | Primary call-to-action button |
| **Hero CTA hover**          | `from-blue-700 to-indigo-700`                                   | Hover state                   |
| **Hero background (light)** | `bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100`       | Hero section                  |
| **Hero background (dark)**  | `from-slate-900 via-slate-800 to-slate-900`                     | Hero section dark             |
| **Decorative blob 1**       | `from-blue-400/20 to-purple-600/20`                             | Background decoration         |
| **Decorative blob 2**       | `from-indigo-400/20 to-cyan-400/20`                             | Background decoration         |
| **Shimmer (light)**         | `linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)` | Loading skeleton              |
| **Shimmer (dark)**          | `linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)` | Loading skeleton              |

### 2.5 Selection & Highlight Colors

| Context             | Light                                                | Dark                               |
| ------------------- | ---------------------------------------------------- | ---------------------------------- |
| Text selection      | `bg-primary-100 text-primary-800`                    | (inherits)                         |
| Search highlight    | `bg-yellow-200 text-yellow-900`                      | `bg-yellow-800/50 text-yellow-100` |
| Copy button success | `border-green-500/50 bg-green-900/20 text-green-400` | Same                               |

---

## 3. Typography

### 3.1 Font Stacks

| Token              | CSS Variable  | Stack                                                              |
| ------------------ | ------------- | ------------------------------------------------------------------ |
| **Sans (primary)** | `--font-sans` | `'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif` |
| **Mono**           | `--font-mono` | `'JetBrains Mono', ui-monospace, monospace`                        |

- **Plus Jakarta Sans** is loaded via Google Fonts with weights **200–800**, `latin` subset, `normal` + `italic` styles.
- Font feature settings: `'rlig' 1, 'calt' 1` (contextual alternates and required ligatures).

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

Applied via `prose prose-base dark:prose-invert` on article content containers.

| Element      | Size              | Weight | Line Height    | Margins                                |
| ------------ | ----------------- | ------ | -------------- | -------------------------------------- |
| `h1`         | `2.25em` (≈36px)  | 800    | 1.11           | top: 0, bottom: 0.89em                 |
| `h2`         | `1.5em` (≈24px)   | 700    | 1.33           | top: 2em, bottom: 1em                  |
| `h3`         | `1.25em` (≈20px)  | 600    | 1.6            | top: 1.6em, bottom: 0.6em              |
| `h4`         | `1em` (≈16px)     | 600    | 1.5            | top: 1.5em, bottom: 0.5em              |
| Body         | `1em` (16px base) | 400    | 1.75 (default) | —                                      |
| `code`       | `0.875em`         | 600    | —              | —                                      |
| `pre`        | `0.875em`         | 400    | 1.71           | top/bottom: 1.71em                     |
| `a`          | inherits          | 500    | —              | underline-offset: 4px, decoration: 2px |
| `blockquote` | inherits          | 500    | —              | border-left: 4px `primary-500`         |

**Blog post headings** include `scroll-mt-32` for anchor offset (sticky header clearance).

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

| Token          | Value      | Context                                       |
| -------------- | ---------- | --------------------------------------------- |
| `--radius`     | `0.5rem`   | Default (8px)                                 |
| `rounded-lg`   | `0.5rem`   | Cards (standard), code blocks, buttons        |
| `rounded-2xl`  | `1rem`     | CTA buttons, mobile nav links, featured cards |
| `rounded-3xl`  | `1.5rem`   | Feature cards                                 |
| `rounded-full` | `9999px`   | Tags, avatars, filter pills, scrollbar thumb  |
| `rounded-xl`   | `0.75rem`  | Mobile nav icon containers                    |
| `rounded-md`   | `0.375rem` | Form inputs, copy button                      |
| `rounded-sm`   | `0.125rem` | Inline code, search highlights                |

---

## 6. Shadows & Effects

### 6.1 Shadow Scale

| Class                | Context                                           |
| -------------------- | ------------------------------------------------- |
| `shadow-sm`          | Default card, prose images                        |
| `shadow-lg`          | Card hover, search result hover, header on scroll |
| `shadow-xl`          | Featured card base                                |
| `shadow-2xl`         | Featured card hover, CTA hover                    |
| `shadow-blue-500/25` | CTA button glow on hover                          |
| `shadow-blue-500/30` | Active mobile nav icon                            |

### 6.2 Glassmorphism

```css
/* Navigation header */
bg-white/50 backdrop-blur-xl dark:bg-slate-900/80
border-b border-slate-200/50 dark:border-slate-700/50

/* Breadcrumb bar */
bg-white/90 backdrop-blur-lg dark:bg-slate-900/80

/* Generic glass utility */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
| Hero section        | `duration-500` | default        |

### 7.2 Keyframe Animations

| Name       | Duration      | Easing                                  | Description                                 |
| ---------- | ------------- | --------------------------------------- | ------------------------------------------- |
| `aurora`   | `8s`          | `linear infinite`                       | Background position shift for gradient text |
| `shimmer`  | `2s`          | `linear infinite`                       | Loading skeleton sweep                      |
| `fade-in`  | `0.5s`        | `ease-out`                              | Element entrance (opacity + translateY)     |
| `fadeInUp` | `0.3s`        | `ease-out forwards`                     | Search result entrance                      |
| `spin`     | `1s` / `0.8s` | `linear infinite`                       | Loading spinners                            |
| `pulse`    | `2s`          | `cubic-bezier(0.4, 0, 0.6, 1) infinite` | Loading state opacity                       |
| `bounce`   | `1s`          | `cubic-bezier`                          | Scroll indicator, no-results icon           |

### 7.3 Interaction Micro-Animations

| Element            | Effect                                                        |
| ------------------ | ------------------------------------------------------------- |
| Card hover         | `hover:scale-[1.02]`, `hover:-translate-y-2` (featured cards) |
| CTA button hover   | `hover:scale-105`                                             |
| Nav link underline | Width from `w-0` to `w-full` on hover, `duration-300`         |
| Mobile nav chevron | `translate-x` from `-2` to `0` on hover                       |
| Search input focus | `scale-[1.02]`                                                |
| Tag filter active  | `scale-105`                                                   |
| Read More arrow    | `group-hover:translate-x-1`                                   |
| Featured card icon | `group-hover:scale-110`                                       |

### 7.4 Reduced Motion

All animations and transitions are disabled when `prefers-reduced-motion: reduce` is set:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
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

---

## 9. Scrollbar & Selection

### Custom Scrollbar

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { bg-gray-100 dark:bg-gray-800 }
::-webkit-scrollbar-thumb { rounded-full bg-gray-400 dark:bg-gray-600 }
::-webkit-scrollbar-thumb:hover { bg-gray-500 dark:bg-gray-500 }
```

### Text Selection

```css
::selection { bg-primary-100 text-primary-800 }
```

---

## 10. Accessibility Tokens

| Feature            | Implementation                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **Focus ring**     | `ring-2 ring-primary-500 ring-offset-2` on all `:focus-visible`                                   |
| **Skip link**      | `sr-only` → `focus:not-sr-only` with `bg-primary-600 text-white rounded px-4 py-2`                |
| **High contrast**  | `@media (prefers-contrast: high)` overrides: primary lightness 40%/70%, borders at 50% saturation |
| **Scroll offset**  | All headings: `scroll-mt-32` (clears fixed header + breadcrumb)                                   |
| **Smooth scroll**  | `html { scroll-behavior: smooth }`                                                                |
| **ARIA landmarks** | `role="navigation"`, `role="main"`, `role="contentinfo"`, `aria-labelledby` on sections           |

---

## 11. Responsive Breakpoints

Standard Tailwind breakpoints are used throughout:

| Prefix | Min Width | Key Layout Changes                                                   |
| ------ | --------- | -------------------------------------------------------------------- |
| `sm`   | 640px     | Form stacks → row, CTA padding increase, tag filter size             |
| `md`   | 768px     | Featured card → horizontal, footer → 5-col grid, desktop nav visible |
| `lg`   | 1024px    | Blog → 2-col with TOC sidebar, hero padding increase                 |
| `xl`   | 1280px    | TOC sidebar wider (240px), hero text → `text-8xl`                    |

---

## 12. Code Syntax Highlighting

| Property    | Value                                                              |
| ----------- | ------------------------------------------------------------------ |
| Theme       | `github-dark` (both light and dark via Shiki dual-theme)           |
| Background  | `#24292e !important` (always dark)                                 |
| Text color  | `#e1e4e8 !important`                                               |
| Border      | `border border-gray-200 dark:border-gray-700 rounded-lg`           |
| Padding     | `p-4`                                                              |
| Copy button | Absolute top-right, `bg-slate-800 border-slate-700 text-slate-400` |

---

## 13. Print Styles

- `.no-print` elements hidden
- Background forced white, text black
- Links underlined with visible href
- Search UI, filters, and interactive elements hidden

---

## 14. File Map

| File                                      | Purpose                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `src/styles/global.css`                   | Theme tokens, base styles, prose overrides, animations, utility classes |
| `src/styles/enhanced-search.css`          | Search-specific styles, keyboard navigation, filter pills               |
| `tailwind.config.mjs`                     | Extended color palette, full prose typography config                    |
| `astro.config.mjs`                        | Font loading (Plus Jakarta Sans), Shiki config                          |
| `src/components/ui/typography/`           | 13 reusable typography components (shadcn pattern)                      |
| `src/services/BlogCardService.ts`         | CSS class generation for blog card variants                             |
| `src/components/ui/BaseHero.astro`        | Configurable hero with decorative elements                              |
| `src/components/navigation/`              | Glassmorphism header, animated nav links                                |
| `src/components/cards/FeaturedCard.astro` | Service/feature cards with gradient icons                               |

---

## 15. Key Conventions for Agents

1. **Always use the primary HSL scale** (`primary-50` through `primary-900`). Never use raw blue/indigo outside of gradients.
2. **Use `gray-*` tokens** (Slate scale) for all neutral colors. Do not introduce new gray shades.
3. **Font family** must always be `var(--font-sans)` for body and `var(--font-mono)` for code.
4. **Dark mode**: Use `dark:` prefix variants. The dark class is toggled on `<html>`.
5. **Border radius**: Cards use `rounded-lg` or `rounded-3xl` (featured). Buttons use `rounded-2xl` (CTA) or `rounded-lg` (small). Tags/pills always `rounded-full`.
6. **Transitions**: Default `transition-all duration-300`. Use `duration-200` for small color changes, `duration-500` for large layout shifts.
7. **Container**: Always wrap page content in `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
8. **Typography components** should be used for standalone text elements outside of markdown prose scope. Within prose, rely on the `@tailwindcss/typography` plugin styles.
9. **Images in card grids** must use `aspect-video` for consistent vertical alignment.
10. **Metadata text** (author, date) should use `min-w-0` and `truncate` inside flex containers.
