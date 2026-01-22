import { SITE_TITLE, SITE_URL, SITE_AUTHOR } from '@/consts';
import path from 'path';
import fs from 'fs';
import { imageSize } from 'image-size';

export interface SchemaProps {
  title: string;
  description: string;
  date?: string | Date;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'blog' | 'collection';
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

    // Ensure siteUrl doesn't have a trailing slash for consistency in URL construction
    const baseUrl = siteUrl.replace(/\/$/, '');
    const canonicalUrl = canonical || baseUrl;
    const imageUrl = image ? new URL(image, baseUrl).href : new URL('/favicon-32x32.png', baseUrl).href;

    const graph: Record<string, any>[] = [];

    const imageSchema = SchemaService.buildImageObject(
      imageUrl,
      imageAlt || title,
      image,
      { license, acquireLicensePage, creditText, copyrightNotice, creator }
    );

    if (type === 'article' || type === 'blog') {
      graph.push({
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        url: canonicalUrl,
        image: imageSchema,
        datePublished: date ? new Date(date).toISOString() : new Date().toISOString(),
        dateModified: modifiedTime
          ? new Date(modifiedTime).toISOString()
          : date
            ? new Date(date).toISOString()
            : new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: author,
          ...(authorUrl && { url: authorUrl }),
        },
        publisher: organization
          ? {
              '@type': 'Organization',
              name: organization.name,
              url: organization.url,
              logo: {
                '@type': 'ImageObject',
                url: organization.logo,
              },
              ...(organization.sameAs && { sameAs: organization.sameAs }),
            }
          : {
              '@type': 'Organization',
              name: SITE_TITLE,
              url: baseUrl,
              logo: {
                '@type': 'ImageObject',
                url: new URL('/favicon.svg', baseUrl).href,
              },
            },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      });
    } else if (type === 'collection') {
      graph.push({
        '@type': 'CollectionPage',
        '@id': canonicalUrl,
        url: canonicalUrl,
        name: title,
        description: description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': baseUrl,
          name: SITE_TITLE,
          url: baseUrl,
        },
        hasPart: collectionPosts?.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: post.url.startsWith('http') ? post.url : new URL(post.url, baseUrl).href,
          description: post.description,
          datePublished: post.date ? new Date(post.date).toISOString() : undefined,
        })),
      });
    } else {
      graph.push({
        '@type': 'WebSite',
        name: title,
        description: description,
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      });
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      });
    }

    if (faqs && faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    if (review) {
      graph.push({
        '@type': 'Review',
        itemReviewed: {
          '@type': 'Thing',
          name: review.itemReviewed?.name || title,
          description: review.itemReviewed?.description,
          image: review.itemReviewed?.image
            ? new URL(review.itemReviewed.image, baseUrl).href
            : undefined,
        },
        author: {
          '@type': 'Person',
          name: review.author || author,
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
        reviewBody: review.reviewBody,
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
    metadata?: {
      license?: string;
      acquireLicensePage?: string;
      creditText?: string;
      copyrightNotice?: string;
      creator?: string;
    }
  ): Record<string, any> {
    const imageSchema: Record<string, any> = {
      '@type': 'ImageObject',
      url: imageUrl,
      contentUrl: imageUrl,
      caption: caption,
      representativeOfPage: true,
    };

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
