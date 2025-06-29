import { defineCollection, z } from 'astro:content';

import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Admin'),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default(['general']),
    // Optional fields for SEO
    canonical: z.string().optional(),
    noindex: z.boolean().default(false),
    // Reading time will be injected by remark plugin
    readingTime: z.string().optional(),
  }),
});

export const collections = { blog };
