/**
 * @file JSON-LD Schema Generator
 * @description Utilities for generating Structured Data (JSON-LD) to improve SEO.
 *
 * Astro.js Tip: Structured data helps search engines understand your content
 * better. It's often injected into the <head> of your pages using a <script type="application/ld+json"> tag.
 */

/**
 * Basic structure for any Schema.org object.
 */
interface Schema {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: any;
}

/**
 * Base function to wrap data into a Schema.org context.
 * @param type The Schema type (e.g., 'Article', 'WebSite').
 * @param data The properties of the schema.
 */
export const generateSchema = (type: string, data: object): Schema => {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
};

/**
 * Generates JSON-LD for a blog article.
 */
export const generateArticleSchema = (data: {
  title: string;
  description: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  authorUrl?: string;
  organization: {
    name: string;
    logo: string;
  };
  canonical: string;
}) => {
  return generateSchema('Article', {
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime || data.publishedTime,
    author: {
      '@type': 'Person',
      name: data.author,
      url: data.authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: data.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: data.organization.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.canonical,
    },
  });
};

/**
 * Generates JSON-LD for breadcrumb navigation.
 */
export const generateBreadcrumbSchema = (breadcrumbs: { name: string; url: string }[]) => {
  return generateSchema('BreadcrumbList', {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });
};

/**
 * Generates JSON-LD for the website itself, including site search capabilities.
 */
export const generateWebsiteSchema = (data: { siteTitle: string; siteUrl: string }) => {
  return generateSchema('WebSite', {
    name: data.siteTitle,
    url: data.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${data.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
};
