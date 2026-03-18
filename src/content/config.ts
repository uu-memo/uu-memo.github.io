import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/posts" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Support both pubDate and publishDate
        pubDate: z.coerce.date().optional(),
        publishDate: z.coerce.date().optional(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional().transform(val => {
            if (!val || val.startsWith('/') || val.startsWith('http')) return val;
            // If it's just a filename like 260317-slug-01.jpg, prepend the directory /images/YYMM/
            const match = val.match(/^(\d{4})\d{2}-/);
            if (match) {
                return `/images/${match[1]}/${val}`;
            }
            return val;
        }),
        // Support array or string for category for backward compatibility
        category: z.union([z.string(), z.array(z.string())]).optional(),
        tags: z.array(z.string()).optional(),
        lang: z.string().optional().default('zh'),
        draft: z.boolean().optional().default(false),
        isVisible: z.boolean().optional().default(true),
    }).transform(data => ({
        ...data,
        // Normalize pubDate
        pubDate: data.pubDate || data.publishDate || new Date(),
        // Normalize category to array
        category: Array.isArray(data.category)
            ? data.category
            : data.category ? [data.category] : []
    })),
});

const pages = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/pages" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
    }),
});

export const collections = { posts, pages };
