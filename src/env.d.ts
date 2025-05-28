/// <reference types="astro/client" />

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
