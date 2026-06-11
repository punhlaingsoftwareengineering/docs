import { error, fail, redirect } from '@sveltejs/kit';
import { documentFormSchema, documentIdSchema } from '$lib/schemas/document';
import { listCategories } from '$lib/server/services/categories';
import { deleteDocument, getDocumentById, updateDocument } from '$lib/server/services/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const parsed = documentIdSchema.safeParse(params);
	if (!parsed.success) error(404, 'Document not found');

	const [doc, categories] = await Promise.all([
		getDocumentById(parsed.data.id),
		listCategories()
	]);

	if (!doc) error(404, 'Document not found');

	const tags = doc.tags.map((t) => t.name).join(', ');

	return { doc: { ...doc, tags }, categories };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		const idParsed = documentIdSchema.safeParse(params);
		if (!idParsed.success) return fail(400, { message: 'Invalid document' });

		const raw = Object.fromEntries(await request.formData());
		const parsed = documentFormSchema.safeParse(raw);

		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors,
				values: raw
			});
		}

		await updateDocument(idParsed.data.id, parsed.data);
		return { success: true };
	},

	publish: async ({ params }) => {
		const idParsed = documentIdSchema.safeParse(params);
		if (!idParsed.success) return fail(400, { message: 'Invalid document' });

		const doc = await getDocumentById(idParsed.data.id);
		if (!doc) return fail(404, { message: 'Document not found' });

		await updateDocument(idParsed.data.id, {
			title: doc.title,
			slug: doc.slug,
			content: doc.content,
			excerpt: doc.excerpt ?? '',
			published: !doc.published,
			categoryId: doc.categoryId,
			tags: doc.tags.map((t) => t.name).join(', ')
		});

		return { success: true };
	},

	delete: async ({ params }) => {
		const idParsed = documentIdSchema.safeParse(params);
		if (!idParsed.success) return fail(400, { message: 'Invalid document' });

		await deleteDocument(idParsed.data.id);
		return redirect(303, '/admin/documents');
	}
};
