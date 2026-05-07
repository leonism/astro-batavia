import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { seoSchema } from '@jdevalk/astro-seo-graph';

import { SITE_AUTHOR } from '@/consts';

/**
 * Content Collection Configuration.
 * Defines the schemas for blog posts and authors using Zod.
 */

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  /**
   * Type-check frontmatter using a schema.
   * Defines validation rules for blog post metadata.
   */
  schema: ({ image }) => seoSchema(image)
    .extend({
      title: z.string().trim(),
      categories: z.array(z.string()),
      description: z.string().trim(),
      keywords: z.array(z.string()).optional(),
      author: z.string().trim().default(SITE_AUTHOR.name),
      authorImage: z.string().trim().default(SITE_AUTHOR.image),
      authorURL: z.string().trim().default(SITE_AUTHOR.url),
      pubDate: z.coerce.date(),
      editDate: z.coerce.date().optional(),
      heroImage: z.string().trim().optional(),
      heroImageAlt: z.string().trim().optional(),
      tags: z.array(z.string()),
      draft: z.boolean(),
      comment: z.boolean().optional(),
      robots: z.string().trim().optional(),
      canonicalURL: z.string().trim().optional(),
      readingTime: z.string().optional(),
      faqs: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .optional(),
      review: z
        .object({
          itemReviewed: z
            .object({
              name: z.string(),
              image: z.string().optional(),
              description: z.string().optional(),
            })
            .optional(),
          author: z.string().optional(),
          ratingValue: z.number(),
          bestRating: z.number().optional(),
          worstRating: z.number().optional(),
          reviewBody: z.string().optional(),
        })
        .optional(),
      license: z.string().optional(),
      acquireLicensePage: z.string().optional(),
      creditText: z.string().optional(),
      copyrightNotice: z.string().optional(),
      creator: z.string().optional(),
    })
    .transform((data) => {
      // Note: We cannot access the file 'slug' here in the schema transform to generate a default canonicalURL.
      // This fallback is handled in the BaseHead component using Astro.url.pathname if canonicalURL is missing.
      return data;
    }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    role: z.string().optional(),
    social: z
      .object({
        twitter: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
    sameAs: z.array(z.string()).optional(),
  }),
});

/**
 * Export registered collections.
 */
export const collections = { blog, authors };

