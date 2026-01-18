/**
 * Generates the canonical URL for a given path.
 * @param pathname The current path.
 * @param siteUrl The base site URL.
 * @returns The full canonical URL.
 */
export function getCanonicalURL(pathname: string, siteUrl: string): string {
  return new URL(pathname, siteUrl).href;
}

/**
 * Resolves the OpenGraph image URL.
 * @param image The image path (relative or absolute).
 * @param siteUrl The base site URL.
 * @returns The resolved absolute image URL.
 */
export function getOpenGraphImage(image: string | undefined, siteUrl: string): string {
  return image ? new URL(image, siteUrl).href : new URL('/og-default.png', siteUrl).href;
}
