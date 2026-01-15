/**
 * @file Environment Variables Type Definitions
 * @description Provides TypeScript types for environment variables and Astro-specific modules.
 *
 * Astro.js Tip: Defining 'ImportMetaEnv' allows you to have type-safe access
 * to your .env variables via 'import.meta.env'.
 */

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * Environment variables available via import.meta.env.
 */
interface ImportMetaEnv {
  readonly ALGOLIA_APP_ID: string;
  readonly ALGOLIA_API_KEY: string;
  readonly GTM_ID: string;
  readonly DISQUS_SHORTNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Global declaration for .astro files to allow importing them in TS files.
 */
declare module '*.astro' {
  const Component: any;
  export default Component;
}
