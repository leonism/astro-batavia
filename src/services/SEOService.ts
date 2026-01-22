/**
 * Service for handling SEO-related logic.
 * Encapsulates logic for canonical URLs, OpenGraph images, and other SEO utilities.
 */
export class SEOService {
  /**
   * Generates the canonical URL for a given path.
   *
   * @param {string} pathname - The current path.
   * @param {string} siteUrl - The base site URL.
   * @returns {string} The full canonical URL.
   */
  static getCanonicalURL(pathname: string, siteUrl: string): string {
    return new URL(pathname, siteUrl).href;
  }

  /**
   * Resolves the OpenGraph image URL.
   * Falls back to a default image if none is provided.
   *
   * @param {string | undefined} image - The image path (relative or absolute).
   * @param {string} siteUrl - The base site URL.
   * @returns {string} The resolved absolute image URL.
   */
  static getOpenGraphImage(image: string | undefined, siteUrl: string): string {
    if (!image) {
      return new URL('/og-default.png', siteUrl).href;
    }
    // Check if it's already an absolute URL
    try {
      new URL(image);
      return image;
    } catch {
      // It's a relative path
      return new URL(image, siteUrl).href;
    }
  }

  /**
   * Generates alternate language URLs for a given path.
   * @param {string} currentPath - The current path.
   * @param {string} siteUrl - The base site URL.
   * @returns {Record<string, string>} A map of language codes to URLs.
   */
  static getAlternateUrls(currentPath: string, siteUrl: string): Record<string, string> {
    const pathWithoutLang = currentPath.replace(/^\/(en|es|ja)/, '') || '/';
    return {
      en: pathWithoutLang === '/' ? siteUrl : `${siteUrl}${pathWithoutLang}`,
      es: `${siteUrl}/es${pathWithoutLang}`,
      ja: `${siteUrl}/ja${pathWithoutLang}`,
    };
  }
}
