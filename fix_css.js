const fs = require('fs');

let content = fs.readFileSync('src/styles/global.css', 'utf-8');

const root_addition = `    /* --- Semantic Component Specific Tokens --- */
    --ds-hero-gradient-start: var(--primitive-blue-600);
    --ds-hero-gradient-end: #4f46e5;
    --ds-toggle-bg-start: var(--primitive-blue-100);
    --ds-toggle-bg-end: var(--primitive-blue-200);
    --ds-toggle-shadow: rgb(0 0 0 / 15%);
    --ds-toggle-ring: color-mix(in srgb, var(--primitive-blue-500) 15%, transparent);
    --ds-toggle-icon: var(--primitive-slate-700);
    --ds-glass-bg: rgb(255 255 255 / 5%);
    --ds-glass-border: rgb(255 255 255 / 10%);
    --ds-copy-bg: var(--primitive-slate-800);
    --ds-copy-bg-hover: var(--primitive-slate-700);
    --ds-copy-border: var(--primitive-slate-700);
    --ds-copy-text: var(--primitive-slate-400);
    --ds-copy-text-hover: #ffffff;
    --ds-copy-success-bg: color-mix(in srgb, var(--primitive-green-900) 20%, transparent);
    --ds-copy-success-border: color-mix(in srgb, var(--primitive-green-500) 50%, transparent);
    --ds-copy-success-text: var(--primitive-green-400);

    /* --- Prose Token Set (Light) --- */`;

content = content.replace("    /* --- Prose Token Set (Light) --- */", root_addition);

const dark_addition = `    /* --- Semantic Component Specific Tokens (Dark) --- */
    --ds-hero-gradient-start: var(--primitive-blue-700);
    --ds-hero-gradient-end: #4f46e5;
    --ds-toggle-bg-start: var(--primitive-slate-800);
    --ds-toggle-bg-end: var(--primitive-slate-700);
    --ds-toggle-shadow: rgb(0 0 0 / 30%);
    --ds-toggle-ring: color-mix(in srgb, var(--primitive-blue-500) 20%, transparent);
    --ds-toggle-icon: #ffffff;
    --ds-glass-bg: rgb(0 0 0 / 5%);
    --ds-glass-border: rgb(255 255 255 / 5%);
    --ds-copy-bg: var(--primitive-slate-800);
    --ds-copy-bg-hover: var(--primitive-slate-700);
    --ds-copy-border: var(--primitive-slate-700);
    --ds-copy-text: var(--primitive-slate-400);
    --ds-copy-text-hover: #ffffff;
    --ds-copy-success-bg: color-mix(in srgb, var(--primitive-green-900) 20%, transparent);
    --ds-copy-success-border: color-mix(in srgb, var(--primitive-green-500) 50%, transparent);
    --ds-copy-success-text: var(--primitive-green-400);

    /* --- Prose Token Set (Dark) --- */`;

content = content.replace("    /* --- Prose Token Set (Dark) --- */", dark_addition);

const shadcn_comment = `/* --- Shadcn/Radix Interop Tokens (HSL raw values for hsl() wrapping) ---
       Note: These are kept as raw external interop tokens and do not map to Tier-1 primitives
       because Shadcn requires raw HSL channels for opacity composition. */`;
content = content.replace("/* --- Shadcn/Radix Interop Tokens (HSL raw values for hsl() wrapping) --- */", shadcn_comment);

const theme_toggle_old = `  /* --- Theme Toggle --- */
  .theme-toggle {
    @apply relative inline-block w-12 h-6 rounded-full border-none cursor-pointer shrink-0 mx-1 p-0 transition-all duration-300 shadow-inner;
    background: linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200));

    &:hover {
      box-shadow:
        inset 0 1px 3px rgb(0 0 0 / 15%),
        0 0 0 3px color-mix(in srgb, var(--color-primary-500) 15%, transparent);
    }

    &:focus-visible {
      @apply outline-none ring-2 ring-primary-500 ring-offset-2;
    }

    .dark & {
      background: linear-gradient(135deg, var(--color-gray-800), var(--color-gray-700));

      &:hover {
        box-shadow:
          inset 0 1px 3px rgb(0 0 0 / 30%),
          0 0 0 3px color-mix(in srgb, var(--color-primary-500) 20%, transparent);
      }
    }
  }

  .theme-toggle-icon {
    @apply absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 z-10 transition-all duration-300 pointer-events-none;
  }

  .theme-toggle-sun {
    @apply left-0.5 opacity-0 text-gray-700;
    .dark & { @apply opacity-100 text-white; }
  }

  .theme-toggle-moon {
    @apply right-0.5 opacity-100 text-gray-700;
    .dark & { @apply opacity-0; }
  }`;

const theme_toggle_new = `  /* --- Theme Toggle --- */
  .theme-toggle {
    @apply relative inline-block w-12 h-6 rounded-full border-none cursor-pointer shrink-0 mx-1 p-0 transition-all duration-300 shadow-inner;
    background: linear-gradient(135deg, var(--ds-toggle-bg-start), var(--ds-toggle-bg-end));

    &:hover {
      box-shadow:
        inset 0 1px 3px var(--ds-toggle-shadow),
        0 0 0 3px var(--ds-toggle-ring);
    }

    &:focus-visible {
      @apply outline-none ring-2 ring-primary-500 ring-offset-2;
    }
  }

  .theme-toggle-icon {
    @apply absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 z-10 transition-all duration-300 pointer-events-none;
    color: var(--ds-toggle-icon);
  }

  .theme-toggle-sun {
    @apply left-0.5 opacity-0;
    .dark & { @apply opacity-100; }
  }

  .theme-toggle-moon {
    @apply right-0.5 opacity-100;
    .dark & { @apply opacity-0; }
  }`;

content = content.replace(theme_toggle_old, theme_toggle_new);

const glass_old = `  /* --- Glass Surface --- */
  .glass {
    @apply bg-white/5 backdrop-blur-md border border-white/10;
    .dark & { @apply bg-black/5 border-white/5; }
  }`;
const glass_new = `  /* --- Glass Surface --- */
  .glass {
    @apply backdrop-blur-md border;
    background-color: var(--ds-glass-bg);
    border-color: var(--ds-glass-border);
  }`;
content = content.replace(glass_old, glass_new);


const copy_old = `  /* --- Code Block Copy Button --- */
  .copy-code-button {
    @apply absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md
           border border-slate-700 bg-slate-800 text-slate-400
           transition-all duration-200 hover:bg-slate-700 hover:text-white;

    &.copied {
      @apply border-green-500/50 bg-green-900/20 text-green-400;
    }
  }`;
const copy_new = `  /* --- Code Block Copy Button --- */
  .copy-code-button {
    @apply absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200;
    background-color: var(--ds-copy-bg);
    border-color: var(--ds-copy-border);
    color: var(--ds-copy-text);

    &:hover {
      background-color: var(--ds-copy-bg-hover);
      color: var(--ds-copy-text-hover);
    }

    &.copied {
      background-color: var(--ds-copy-success-bg);
      border-color: var(--ds-copy-success-border);
      color: var(--ds-copy-success-text);
    }
  }`;
content = content.replace(copy_old, copy_new);


const hero_old = `  /* --- Hero Background --- */
  .bg-hero-gradient {
    background: linear-gradient(to right, var(--primitive-blue-600), #4f46e5);
  }`;
const hero_new = `  /* --- Hero Background --- */
  .bg-hero-gradient {
    background: linear-gradient(to right, var(--ds-hero-gradient-start), var(--ds-hero-gradient-end));
  }`;
content = content.replace(hero_old, hero_new);

const prose_pre_old = `  /* Code Blocks */
  pre.astro-code {
    @apply relative my-8 overflow-x-auto rounded-lg border border-gray-200 p-4 text-sm
           leading-relaxed dark:border-gray-700 !bg-(--tw-prose-pre-bg) !text-(--tw-prose-pre-code);
  }`;
const prose_pre_new = `  /* Code Blocks */
  pre.astro-code {
    @apply relative my-8 overflow-x-auto rounded-lg border p-4 text-sm leading-relaxed;
    border-color: var(--ds-border-strong);
    background-color: var(--tw-prose-pre-bg) !important;
    color: var(--tw-prose-pre-code) !important;
  }`;
content = content.replace(prose_pre_old, prose_pre_new);

const prose_code_old = `  :where(:not(pre) > code):not(:where([class~='not-prose'] *)) {
    @apply rounded-sm bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800;
    &::before, &::after { content: "\`"; }
  }`;
const prose_code_new = `  :where(:not(pre) > code):not(:where([class~='not-prose'] *)) {
    @apply rounded-sm px-1.5 py-0.5 font-mono text-sm;
    background-color: var(--ds-surface-active);
    &::before, &::after { content: "\`"; }
  }`;
content = content.replace(prose_code_old, prose_code_new);

const prose_table_old = `  /* Tables */
  :where(table):not(:where([class~='not-prose'] *)) {
    @apply w-full border-collapse border border-gray-200 my-8 text-sm dark:border-gray-700;
  }

  :where(th, td):not(:where([class~='not-prose'] *)) {
    @apply border border-gray-200 px-4 py-2 text-left dark:border-gray-700;
  }

  :where(thead th):not(:where([class~='not-prose'] *)) {
    @apply bg-gray-50 font-semibold dark:bg-gray-800;
  }`;
const prose_table_new = `  /* Tables */
  :where(table):not(:where([class~='not-prose'] *)) {
    @apply w-full border-collapse border my-8 text-sm;
    border-color: var(--ds-border-strong);
  }

  :where(th, td):not(:where([class~='not-prose'] *)) {
    @apply border px-4 py-2 text-left;
    border-color: var(--ds-border-strong);
  }

  :where(thead th):not(:where([class~='not-prose'] *)) {
    @apply font-semibold;
    background-color: var(--ds-surface-hover);
  }`;
content = content.replace(prose_table_old, prose_table_new);

fs.writeFileSync('src/styles/global.css', content);
console.log("Replacement Complete");
