import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

/**
 * Remark plugin to calculate reading time for Markdown/MDX content.
 * Adds a `readingTime` property to the frontmatter.
 *
 * @returns {function} The remark plugin function.
 */
export function remarkReadingTime() {
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);

    // readingTime.text will give us "3 min read"
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
