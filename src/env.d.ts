/**
 * Environment Type Declarations.
 * Defines types for Astro client and environment variables.
 */

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * ImportMetaEnv Interface.
 * Defines the shape of environment variables available in `import.meta.env`.
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

declare module '*.astro' {
  const Component: any;
  export default Component;
}

interface Window {
  dataLayer: any[];
}
