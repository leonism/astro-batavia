export interface BlogPostViewModel {
  title: string;
  excerpt: string;
  url: string;
  pubDate: string;
  author: string;
  tags: string[];
  heroImage?: string;
  heroImageAlt?: string;
  readingTime?: string;
  isFeatured: boolean;
}

export function createBlogPostViewModel(post: any, lang: string, isFeatured: boolean = false): BlogPostViewModel {
  const excerpt = post.data.description || post.body.slice(0, isFeatured ? 300 : 150) + "...";
  
  return {
    title: post.data.title,
    excerpt,
    url: getPostUrl(post.slug, lang),
    pubDate: post.data.pubDate,
    author: post.data.author,
    tags: post.data.tags || [],
    heroImage: post.data.heroImage,
    heroImageAlt: post.data.heroImageAlt || post.data.title,
    readingTime: post.data.readingTime,
    isFeatured
  };
}

import { getPostUrl } from "@/i18n/utils";
