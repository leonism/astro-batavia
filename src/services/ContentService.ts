/**
 * Service for content processing and manipulation.
 * Encapsulates logic for excerpts, reading time, and other content utilities.
 */
export class ContentService {
  /**
   * Generates an excerpt from the content body or description.
   * @param {string} body - The content body text.
   * @param {string} [description] - The content description (optional).
   * @param {number} [limit=150] - The character limit for the excerpt.
   * @returns {string} The generated excerpt.
   */
  static getExcerpt(body: string, description?: string, limit: number = 150): string {
    if (description) return description;
    return body.slice(0, limit) + (body.length > limit ? '...' : '');
  }
}
