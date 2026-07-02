import { z } from 'zod';

export const categoryIdSchema = z.object({
	id: z.uuid()
});

export const categorySlugParamSchema = z.object({
	slug: z
		.string()
		.max(128)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid category slug')
});

export const categoryFormSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100),
	slug: z
		.string()
		.max(128)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug')
		.optional()
		.or(z.literal('')),
	sortOrder: z.coerce.number().int().min(0).max(9999).default(0)
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
