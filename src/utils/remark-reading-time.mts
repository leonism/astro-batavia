/**
 * @file Remark Reading Time Plugin
 * @description A Remark plugin to automatically calculate the reading time of Markdown/MDX content.
 *
 * Astro.js Tip: You can extend Astro's Markdown processing by adding Remark or Rehype
 * plugins in your 'astro.config.mjs'. These plugins can inject data into your frontmatter.
 */

import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

/**
 * Remark plugin that calculates reading time and adds it to the frontmatter.
 */
export function remarkReadingTime() {
  /**
   * @param tree The Markdown Abstract Syntax Tree (mdast).
   * @param data The data object containing frontmatter and other metadata.
   */
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    // readingTime.text will give us something like "3 min read"
    // We inject this directly into Astro's special 'data.astro.frontmatter' object
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
