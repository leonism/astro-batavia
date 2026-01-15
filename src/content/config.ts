/**
 * @file Content Collections Configuration
 * @description Defines the schemas for all content collections in the project.
 *
 * Astro.js Tip: Content Collections use Zod for schema validation. This ensures
 * that your frontmatter (the YAML at the top of your Markdown files) is
 * always correct and provides full TypeScript intellisense.
 */

import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { SITE_AUTHOR } from '../consts';

/**
 * Schema for blog posts.
 * Includes fields for SEO, authorship, and schema.org integration.
 */
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Core Metadata
    title: z.string().trim(),
    description: z.string().trim(),
    pubDate: z.coerce.date(),
    editDate: z.coerce.date().optional(),

    // Categorization
    categories: z.array(z.string()),
    tags: z.array(z.string()),

    // Authorship
    author: z.string().trim().default(SITE_AUTHOR.name),
    authorImage: z.string().trim().default(SITE_AUTHOR.image),
    authorURL: z.string().trim().default(SITE_AUTHOR.url),

    // Media
    heroImage: z.string().trim().optional(),
    heroImageAlt: z.string().trim().optional(),

    // Status & SEO
    draft: z.boolean().default(false),
    comment: z.boolean().optional(),
    robots: z.string().trim().optional(),
    canonicalURL: z.string().trim().optional(),

    // Features
    readingTime: z.string().optional(),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),

    // Schema.org Review Data
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

    // Licensing
    license: z.string().optional(),
    acquireLicensePage: z.string().optional(),
    creditText: z.string().optional(),
    copyrightNotice: z.string().optional(),
    creator: z.string().optional(),
  }),
});

/**
 * Schema for author profiles.
 */
const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    role: z.string().optional(),
    social: z
      .object({
        twitter: z.string().url().optional(),
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        website: z.string().url().optional(),
      })
      .optional(),
  }),
});

/**
 * Export all collections to be used by Astro.
 */
export const collections = { blog, authors };
