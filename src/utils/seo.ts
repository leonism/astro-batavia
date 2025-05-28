export interface StructuredDataParams {
  title: string;
  description: string;
  image?: string;
  author: string;
  datePublished: Date;
  dateModified?: Date;
  url: string;
}

export function generateStructuredData(params: StructuredDataParams) {
  const {
    title,
    description,
    image,
    author,
    datePublished,
    dateModified,
    url,
  } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image ? [image] : undefined,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AstroBlog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://your-blog.com/images/logo.png',
      },
    },
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified || datePublished).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url: url,
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AstroBlog',
    url: 'https://your-blog.com',
    logo: 'https://your-blog.com/images/logo.png',
    description: 'A modern multi-language blog built with Astro.js',
    sameAs: [
      'https://github.com/your-username',
      'https://twitter.com/your-handle',
      'https://linkedin.com/in/your-profile',
    ],
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AstroBlog',
    url: 'https://your-blog.com',
    description: 'A modern multi-language blog built with Astro.js',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://your-blog.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax and HTML tags
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/[#*`_~]/g, '') // Remove markdown formatting
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSentence > maxLength * 0.5) {
    return truncated.substring(0, lastSentence + 1);
  } else if (lastSpace > maxLength * 0.5) {
    return truncated.substring(0, lastSpace) + '...';
  } else {
    return truncated + '...';
  }
}

export function generateMetaKeywords(tags: string[], title: string): string {
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 3);

  const allKeywords = [...tags, ...titleWords];
  return [...new Set(allKeywords)].join(', ');
}

export function generateCanonicalUrl(path: string, lang: string = 'en'): string {
  const baseUrl = 'https://your-blog.com';
  
  if (lang === 'en') {
    return `${baseUrl}${path}`;
  }
  
  return `${baseUrl}/${lang}${path}`;
}

export function getAlternateLanguageUrls(path: string) {
  const baseUrl = 'https://your-blog.com';
  
  return {
    en: `${baseUrl}${path}`,
    es: `${baseUrl}/es${path}`,
    ja: `${baseUrl}/ja${path}`,
  };
}
