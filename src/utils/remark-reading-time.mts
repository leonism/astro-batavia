import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    
    // readingTime.text will give us "3 min read"
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
