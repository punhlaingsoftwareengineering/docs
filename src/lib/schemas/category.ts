import { z } from 'zod';

export const categoryIdSchema = z.object({
	id: z.uuid()
});

export const categoryIdParamSchema = z.object({
	id: z.uuid()
});

export const categoryFormSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100),
	sortOrder: z.coerce.number().int().min(0).max(9999).default(0)
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
