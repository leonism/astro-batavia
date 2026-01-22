import { type CollectionEntry } from 'astro:content';
import { useTranslations, getPostUrl, getLocalizedPath, slugifyTag } from '@/i18n/utils';
import { DateService } from '@/services/DateService';
import { ContentService } from '@/services/ContentService';
import type { LanguageKey } from '@/i18n/types';

/**
 * Props passed to the BlogCard component.
 */
export interface BlogCardProps {
  post: CollectionEntry<'blog'>;
  lang: LanguageKey;
  showExcerpt?: boolean;
  isFeatured?: boolean;
  /**
   * Controls the image loading strategy.
   * 'eager': Load immediately (use for above-the-fold content).
   * 'lazy': Load when near viewport (use for below-the-fold content).
   * Defaults to 'eager' if isFeatured is true, otherwise 'lazy'.
   */
  loading?: 'eager' | 'lazy';
}

/**
 * View model for the BlogCard component, containing all data needed for rendering.
 */
export interface BlogCardViewModel {
  id: string;
  postUrl: string;
  title: string;
  excerpt: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  tags: {
    name: string;
    url: string;
  }[];
  remainingTagsCount: number;
  author: string;
  pubDate: string;
  isoDate: string;
  readingTime?: string;
  cssClasses: {
    article: string;
    imageContainer: string;
    image: string;
    content: string;
    title: string;
    excerpt: string;
  };
  imageLoading: 'eager' | 'lazy';
  imageDecoding: 'auto' | 'async';
  translations: {
    readMore: string;
    readMoreAbout: string;
  };
}

/**
 * Service for the BlogCard component.
 * Handles business logic, state management, and view model generation.
 */
export class BlogCardService {
  /**
   * Generates the view model for the BlogCard component.
   *
   * @param {BlogCardProps} props - The component props.
   * @returns {BlogCardViewModel} The processed view model containing all data needed for rendering.
   */
  static getViewModel(props: BlogCardProps): BlogCardViewModel {
    const {
      post,
      lang,
      showExcerpt = true,
      isFeatured = false,
      loading = isFeatured ? 'eager' : 'lazy',
    } = props;

    const t = useTranslations(lang);
    const postUrl = getPostUrl(post.slug, lang);

    // Generate excerpt
    const excerpt = showExcerpt
      ? ContentService.getExcerpt(post.body, post.data.description, isFeatured ? 300 : 150)
      : '';

    // Format tags
    const allTags = post.data.tags || [];
    const displayTags = allTags.slice(0, 3).map((tag) => ({
      name: tag,
      url: getLocalizedPath(`/blog/tags/${slugifyTag(tag)}`, lang),
    }));
    const remainingTagsCount = Math.max(0, allTags.length - 3);

    // CSS Classes generation
    const cssClasses = this.generateCssClasses(isFeatured);

    return {
      id: post.id,
      postUrl,
      title: post.data.title,
      excerpt,
      heroImage: post.data.heroImage
        ? {
            src: post.data.heroImage,
            alt: post.data.heroImageAlt || post.data.title,
          }
        : undefined,
      tags: displayTags,
      remainingTagsCount,
      author: post.data.author,
      pubDate: DateService.format(post.data.pubDate, lang),
      isoDate: post.data.pubDate.toISOString(),
      readingTime: 'readingTime' in post.data ? (post.data.readingTime as string) : undefined,
      cssClasses,
      imageLoading: loading,
      imageDecoding: isFeatured ? 'auto' : 'async',
      translations: {
        readMore: t('blog.readMore'),
        readMoreAbout: `${t('blog.readMoreAbout')} ${post.data.title}`,
      },
    };
  }

  /**
   * Generates CSS classes based on the component state.
   *
   * @param {boolean} isFeatured - Whether the post is featured.
   * @returns {{ article: string; imageContainer: string; image: string; content: string; title: string; excerpt: string; }} Object containing CSS class strings for various elements.
   */
  private static generateCssClasses(isFeatured: boolean) {
    return {
      article: [
        'group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 flex flex-col',
        isFeatured
          ? 'md:flex-row md:shadow-xl md:hover:shadow-2xl md:min-h-[400px]'
          : 'hover:shadow-lg hover:scale-[1.02] min-h-[420px] max-h-[480px]',
      ].join(' '),
      imageContainer: [
        'overflow-hidden',
        isFeatured ? 'md:w-1/2 md:aspect-auto h-96 md:h-full' : 'h-52',
      ].join(' '),
      image: [
        'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300',
        isFeatured ? 'md:rounded-l-lg md:rounded-r-none' : '',
      ].join(' '),
      content: ['p-6 flex-1 flex flex-col', isFeatured ? 'md:w-1/2 md:justify-center' : ''].join(
        ' ',
      ),
      title: [
        'font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2',
        isFeatured ? 'text-2xl md:text-3xl' : 'text-xl',
      ].join(' '),
      excerpt: [
        'text-gray-600 dark:text-gray-300 leading-relaxed mb-4',
        isFeatured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3',
      ].join(' '),
    };
  }
}
