import { defineCollection, z } from "astro:content";

import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string().trim(),
    lang: z.string().trim(),
    categories: z.array(z.string()),
    description: z.string().trim(),
    keywords: z.array(z.string()).optional(),
    author: z.string().trim(),
    authorImage: z.string().trim().optional(),
    authorURL: z.string().trim().optional(),
    pubDate: z.coerce.date(),
    editDate: z.coerce.date().optional(),
    heroImage: z.string().trim().optional(),
    heroImageAlt: z.string().trim().optional(),
    tags: z.array(z.string()),
    draft: z.boolean(),
    comment: z.boolean().optional(),
    robots: z.string().trim().optional(),
    canonicalURL: z.string().trim().optional(),
  }),
});

export const collections = { blog };
