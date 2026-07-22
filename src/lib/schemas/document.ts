import { z } from 'zod';
import {
	DEFAULT_DOCUMENT_CONTENT_TYPE,
	DOCUMENT_CONTENT_TYPES,
	isMediaContentType
} from '$lib/constants/document-content';

const httpUrlSchema = z
	.string()
	.min(1, 'Enter a media URL')
	.refine((value) => {
		try {
			const parsed = new URL(value);
			return parsed.protocol === 'http:' || parsed.protocol === 'https:';
		} catch {
			return false;
		}
	}, 'URL must start with http:// or https://');

export const documentIdSchema = z.object({
	id: z.uuid()
});

export const documentFormSchema = z
	.object({
		title: z.string().min(1, 'Title is required').max(200),
		contentType: z.enum(DOCUMENT_CONTENT_TYPES).default(DEFAULT_DOCUMENT_CONTENT_TYPE),
		mediaUrl: z.string().max(2048).optional().or(z.literal('')),
		content: z.string().max(500_000).default(''),
		excerpt: z.string().max(500).optional().or(z.literal('')),
		published: z
			.union([z.literal('true'), z.literal('false'), z.boolean()])
			.transform((v) => v === true || v === 'true'),
		categoryId: z.uuid('Category is required'),
		parentDocumentId: z
			.union([z.uuid(), z.literal(''), z.null()])
			.optional()
			.transform((v) => (v && v !== '' ? v : null)),
		sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
		tags: z.string().optional().default('')
	})
	.superRefine((data, ctx) => {
		if (!isMediaContentType(data.contentType)) return;

		const mediaUrl = data.mediaUrl?.trim() ?? '';
		if (!mediaUrl) {
			ctx.addIssue({
				code: 'custom',
				path: ['mediaUrl'],
				message: 'Media URL is required for this content type.'
			});
			return;
		}

		const parsed = httpUrlSchema.safeParse(mediaUrl);
		if (!parsed.success) {
			ctx.addIssue({
				code: 'custom',
				path: ['mediaUrl'],
				message: parsed.error.issues[0]?.message ?? 'Enter a valid media URL.'
			});
		}
	});

export type DocumentFormInput = z.infer<typeof documentFormSchema>;

export const reorderDocumentsSchema = z.object({
	categoryId: z.uuid(),
	parentDocumentId: z.union([z.uuid(), z.null()]),
	orderedIds: z.array(z.uuid()).min(1)
});
