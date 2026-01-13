import { defineCollection } from "astro:content";
import { z } from "zod";
import { SITE_AUTHOR } from "../consts";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
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
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    review: z.object({
      itemReviewed: z.object({
        name: z.string(),
        image: z.string().optional(),
        description: z.string().optional(),
      }).optional(),
      author: z.string().optional(),
      ratingValue: z.number(),
      bestRating: z.number().optional(),
      worstRating: z.number().optional(),
      reviewBody: z.string().optional(),
    }).optional(),
    license: z.string().optional(),
    acquireLicensePage: z.string().optional(),
    creditText: z.string().optional(),
    copyrightNotice: z.string().optional(),
    creator: z.string().optional(),
  }),
});

const authors = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    role: z.string().optional(),
    social: z.object({
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),
    }).optional(),
  }),
});

export const collections = { blog, authors };
