// src/utils/jsonLd.ts

interface Schema {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: any;
}

export const generateSchema = (type: string, data: object): Schema => {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
};

export const generateArticleSchema = (data: any) => {
  return generateSchema('Article', {
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime,
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

export const generateBreadcrumbSchema = (breadcrumbs: any[]) => {
  return generateSchema('BreadcrumbList', {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });
};

export const generateWebsiteSchema = (data: any) => {
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
