import { z } from 'zod';

export const docSlugSchema = z.object({
	slug: z
		.string()
		.min(1)
		.max(128)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid doc slug')
});

export const documentIdSchema = z.object({
	id: z.uuid()
});

export const documentFormSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200),
	slug: z
		.string()
		.max(128)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug')
		.optional()
		.or(z.literal('')),
	content: z.string().max(500_000).default(''),
	excerpt: z.string().max(500).optional().or(z.literal('')),
	published: z
		.union([z.literal('true'), z.literal('false'), z.boolean()])
		.transform((v) => v === true || v === 'true'),
	categoryId: z.uuid('Category is required'),
	tags: z.string().optional().default('')
});

export type DocumentFormInput = z.infer<typeof documentFormSchema>;
