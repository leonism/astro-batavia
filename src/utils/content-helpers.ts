/**
 * Generates an excerpt from the content body or description.
 * @param body The content body text.
 * @param description The content description (optional).
 * @param limit The character limit for the excerpt (default: 150).
 * @returns The generated excerpt.
 */
export function getExcerpt(body: string, description?: string, limit: number = 150): string {
  if (description) return description;
  return body.slice(0, limit) + (body.length > limit ? '...' : '');
}
