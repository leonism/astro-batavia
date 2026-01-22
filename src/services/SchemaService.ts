import { SITE_TITLE, SITE_URL, SITE_AUTHOR, SOCIAL_LINKS } from '@/consts';
import path from 'path';
import fs from 'fs';
import { imageSize } from 'image-size';

export interface SchemaProps {
  title: string;
  description: string;
  date?: string | Date;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'blog' | 'collection' | 'profile';
  author?: string;
  authorUrl?: string;
  modifiedTime?: string | Date;
  collectionPosts?: Array<{
    title: string;
    url: string;
    description?: string;
    date?: string | Date;
  }>;
  breadcrumbs?: { name: string; url: string }[];
  faqs?: { question: string; answer: string }[];
  review?: {
    itemReviewed?: {
      name: string;
      image?: string;
      description?: string;
    };
    author?: string;
    ratingValue?: number;
    bestRating?: number;
    worstRating?: number;
    reviewBody?: string;
    datePublished?: string | Date;
  };
  license?: string;
  acquireLicensePage?: string;
  creditText?: string;
  copyrightNotice?: string;
  creator?: string;
  canonical?: string;
  organization?: {
    name: string;
    url: string;
    logo: string;
    sameAs?: string[];
  };
}

/**
 * Service for generating JSON-LD structured data.
 * Encapsulates logic for creating Schema.org graphs for various page types.
 */
export class SchemaService {
  /**
   * Helper to sanitize strings for JSON-LD.
   * Removes control characters and ensures valid encoding.
   */
  private static sanitize(str: string): string {
    if (!str) return '';
    return str
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim();
  }

  /**
   * Generates the complete Schema.org graph for a page.
   *
   * @param {SchemaProps} props - The properties for the schema.
   * @param {string} siteUrl - The base URL of the site.
   * @returns {Record<string, any>} The complete schema object with @context and @graph.
   */
  static generateSchema(props: SchemaProps, siteUrl: string): Record<string, any> {
    const graph = SchemaService.buildGraph(props, siteUrl);
    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    };
  }

  /**
   * Builds the graph array for the schema.
   *
   * @param {SchemaProps} props - The properties for the schema.
   * @param {string} siteUrl - The base URL of the site.
   * @returns {Record<string, any>[]} The array of schema objects.
   */
  static buildGraph(props: SchemaProps, siteUrl: string): Record<string, any>[] {
    const {
      title,
      description,
      date,
      image,
      imageAlt,
      type = 'website',
      author = SITE_AUTHOR.name,
      authorUrl,
      modifiedTime,
      collectionPosts,
      breadcrumbs,
      faqs,
      review,
      license,
      acquireLicensePage,
      creditText,
      copyrightNotice,
      creator,
      canonical,
      organization,
    } = props;

    // Sanitize basic string inputs
    const safeTitle = SchemaService.sanitize(title);
    const safeDescription = SchemaService.sanitize(description);
    const safeAuthor = SchemaService.sanitize(author);
    const safeImageAlt = SchemaService.sanitize(imageAlt || safeTitle);

    // Ensure siteUrl doesn't have a trailing slash for consistency in URL construction
    const baseUrl = siteUrl.replace(/\/$/, '');
    const canonicalUrl = canonical || baseUrl;
    const imageUrl = image
      ? new URL(image, baseUrl).href
      : new URL('/favicon-32x32.png', baseUrl).href;

    // Entity IDs
    const ids = {
      website: `${baseUrl}/#website`,
      organization: `${baseUrl}/#organization`,
      webpage: `${canonicalUrl}#webpage`,
      primaryImage: `${canonicalUrl}#primaryimage`,
      author: `${canonicalUrl}#author`,
      breadcrumb: `${canonicalUrl}#breadcrumb`,
    };

    const graph: Record<string, any>[] = [];

    // 1. Organization (Publisher)
    const orgSchema = {
      '@type': 'Organization',
      '@id': ids.organization,
      name: organization?.name ? SchemaService.sanitize(organization.name) : SITE_TITLE,
      url: organization?.url || baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: organization?.logo || new URL('/favicon.svg', baseUrl).href,
      },
      sameAs: organization?.sameAs || Object.values(SOCIAL_LINKS),
    };
    graph.push(orgSchema);

    // 2. WebSite
    const websiteSchema = {
      '@type': 'WebSite',
      '@id': ids.website,
      url: baseUrl,
      name: SITE_TITLE,
      description: SITE_AUTHOR.name, // Or a global description
      publisher: {
        '@id': ids.organization,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
    graph.push(websiteSchema);

    // 3. ImageObject (Primary Image)
    // We always create an ImageObject for the primary image if it exists
    const imageObject = SchemaService.buildImageObject(
      imageUrl,
      safeImageAlt,
      image,
      ids.primaryImage,
      {
        license,
        acquireLicensePage,
        creditText: creditText ? SchemaService.sanitize(creditText) : undefined,
        copyrightNotice: copyrightNotice ? SchemaService.sanitize(copyrightNotice) : undefined,
        creator: creator ? SchemaService.sanitize(creator) : undefined,
      },
    );
    graph.push(imageObject);

    // 4. WebPage (Base for everything)
    const webpageSchema: Record<string, any> = {
      '@type': type === 'profile' ? 'ProfilePage' : 'WebPage',
      '@id': ids.webpage,
      url: canonicalUrl,
      name: safeTitle,
      headline: safeTitle,
      description: safeDescription,
      isPartOf: {
        '@id': ids.website,
      },
      primaryImageOfPage: {
        '@id': ids.primaryImage,
      },
      image: {
        '@id': ids.primaryImage,
      },
      publisher: {
        '@id': ids.organization,
      },
    };

    if (breadcrumbs && breadcrumbs.length > 0) {
      webpageSchema.breadcrumb = {
        '@id': ids.breadcrumb,
      };
    }

    if (date) {
      webpageSchema.datePublished = new Date(date).toISOString();
    }
    if (modifiedTime) {
      webpageSchema.dateModified = new Date(modifiedTime).toISOString();
    } else if (date) {
      webpageSchema.dateModified = new Date(date).toISOString();
    }

    // 5. BreadcrumbList
    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': ids.breadcrumb,
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: SchemaService.sanitize(crumb.name),
          item: crumb.url,
        })),
      });
    }

    // 6. Person (Author) - Optional but good for Article/Profile
    if (author) {
      const personSchema: Record<string, any> = {
        '@type': 'Person',
        '@id': ids.author,
        name: safeAuthor,
      };
      if (authorUrl) {
        personSchema.url = authorUrl;
      }
      // If it's a ProfilePage, the main entity is this Person
      if (type === 'profile') {
        webpageSchema.mainEntity = {
          '@id': ids.author,
        };
      }
      graph.push(personSchema);
    }

    // 7. Special Types Logic (Article, BlogPosting, Collection)
    if (type === 'article' || type === 'blog') {
      const articleSchema = {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        isPartOf: {
          '@id': ids.webpage,
        },
        headline: safeTitle,
        description: safeDescription,
        image: {
          '@id': ids.primaryImage,
        },
        datePublished: webpageSchema.datePublished,
        dateModified: webpageSchema.dateModified,
        author: {
          '@id': ids.author, // Link to the Person entity
        },
        publisher: {
          '@id': ids.organization,
        },
        mainEntityOfPage: {
          '@id': ids.webpage,
        },
      };
      graph.push(articleSchema);
    } else if (type === 'collection') {
      // For collections, the WebPage itself is a CollectionPage
      webpageSchema['@type'] = 'CollectionPage';
      if (collectionPosts) {
        webpageSchema.hasPart = collectionPosts.map((post) => ({
          '@type': 'BlogPosting',
          headline: SchemaService.sanitize(post.title),
          url: post.url.startsWith('http') ? post.url : new URL(post.url, baseUrl).href,
          description: post.description ? SchemaService.sanitize(post.description) : undefined,
          datePublished: post.date ? new Date(post.date).toISOString() : undefined,
        }));
      }
    }

    // Add WebPage to graph
    graph.push(webpageSchema);

    // 8. FAQPage
    if (faqs && faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        isPartOf: {
          '@id': ids.webpage,
        },
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: SchemaService.sanitize(faq.question),
          acceptedAnswer: {
            '@type': 'Answer',
            text: SchemaService.sanitize(faq.answer),
          },
        })),
      });
    }

    // 9. Review
    if (review) {
      graph.push({
        '@type': 'Review',
        '@id': `${canonicalUrl}#review`,
        isPartOf: {
          '@id': ids.webpage,
        },
        itemReviewed: {
          '@type': 'Thing',
          name: review.itemReviewed?.name
            ? SchemaService.sanitize(review.itemReviewed.name)
            : safeTitle,
          description: review.itemReviewed?.description
            ? SchemaService.sanitize(review.itemReviewed.description)
            : undefined,
          image: review.itemReviewed?.image
            ? new URL(review.itemReviewed.image, baseUrl).href
            : undefined,
        },
        author: {
          '@type': 'Person',
          name: review.author ? SchemaService.sanitize(review.author) : safeAuthor,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.ratingValue,
          bestRating: review.bestRating || 5,
          worstRating: review.worstRating || 1,
        },
        datePublished: review.datePublished
          ? new Date(review.datePublished).toISOString()
          : new Date().toISOString(),
        reviewBody: review.reviewBody ? SchemaService.sanitize(review.reviewBody) : undefined,
      });
    }

    return graph;
  }

  /**
   * Helper to build the ImageObject schema with dimensions if available.
   */
  private static buildImageObject(
    imageUrl: string,
    caption: string,
    localImagePath?: string,
    id?: string,
    metadata?: {
      license?: string;
      acquireLicensePage?: string;
      creditText?: string;
      copyrightNotice?: string;
      creator?: string;
    },
  ): Record<string, any> {
    const imageSchema: Record<string, any> = {
      '@type': 'ImageObject',
      url: imageUrl,
      contentUrl: imageUrl,
      caption: caption,
    };

    if (id) {
      imageSchema['@id'] = id;
    }

    if (localImagePath) {
      try {
        const imagePath = path.join(process.cwd(), 'public', localImagePath);
        if (fs.existsSync(imagePath)) {
          const dimensions = imageSize(fs.readFileSync(imagePath));
          if (dimensions) {
            imageSchema.width = dimensions.width;
            imageSchema.height = dimensions.height;
          }
        }
      } catch (e) {
        console.error(`Error getting image dimensions for ${localImagePath}:`, e);
      }
    }

    if (metadata?.license) imageSchema.license = metadata.license;
    if (metadata?.acquireLicensePage) imageSchema.acquireLicensePage = metadata.acquireLicensePage;
    if (metadata?.creditText) imageSchema.creditText = metadata.creditText;
    if (metadata?.copyrightNotice) imageSchema.copyrightNotice = metadata.copyrightNotice;
    if (metadata?.creator) {
      imageSchema.creator = {
        '@type': 'Person',
        name: metadata.creator,
      };
    }

    return imageSchema;
  }
}
