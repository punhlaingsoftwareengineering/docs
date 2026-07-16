import { error, fail, redirect } from '@sveltejs/kit';
import { requireDocsAdmin } from '$lib/server/auth-guards';
import { documentFormSchema, documentIdSchema } from '$lib/schemas/document';
import { listCategories } from '$lib/server/services/categories';
import {
	computeDepthMap,
	deleteDocument,
	getDocumentById,
	listChildDocuments,
	listDocumentsForTree,
	listEligibleParents,
	updateDocument,
	validateDocumentHierarchy
} from '$lib/server/services/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const parsed = documentIdSchema.safeParse(params);
	if (!parsed.success) error(404, 'Document not found');

	const [doc, categories, children, allDocs] = await Promise.all([
		getDocumentById(parsed.data.id),
		listCategories(),
		listChildDocuments(parsed.data.id, { includeUnpublished: true }),
		listDocumentsForTree({ includeUnpublished: true })
	]);

	if (!doc) error(404, 'Document not found');

	const depth = computeDepthMap(allDocs).get(doc.id) ?? 1;
	const parentOptions = await listEligibleParents({
		categoryId: doc.categoryId,
		excludeId: doc.id,
		includeUnpublished: true
	});

	const parentOptionsByCategory = Object.fromEntries(
		await Promise.all(
			categories.map(async (cat) => [
				cat.id,
				cat.id === doc.categoryId
					? parentOptions
					: await listEligibleParents({
							categoryId: cat.id,
							excludeId: doc.id,
							includeUnpublished: true
						})
			])
		)
	);

	const tags = doc.tags.map((t) => t.name).join(', ');

	return {
		doc: { ...doc, tags },
		categories,
		parentOptionsByCategory,
		depth,
		hasChildren: children.length > 0
	};
};

export const actions: Actions = {
	save: async (event) => {
		await requireDocsAdmin(event);
		const idParsed = documentIdSchema.safeParse(event.params);
		if (!idParsed.success) return fail(400, { message: 'Invalid document' });

		const raw = Object.fromEntries(await event.request.formData());
		const parsed = documentFormSchema.safeParse(raw);

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			const first = Object.values(errors).flat()[0];
			return fail(400, {
				message: first ?? 'Please check the form and try again.',
				errors,
				values: raw
			});
		}

		const hierarchy = await validateDocumentHierarchy({
			documentId: idParsed.data.id,
			parentDocumentId: parsed.data.parentDocumentId ?? null,
			categoryId: parsed.data.categoryId
		});
		if (!hierarchy.valid) {
			return fail(400, {
				message: hierarchy.message,
				errors: { parentDocumentId: [hierarchy.message] }
			});
		}

		try {
			await updateDocument(idParsed.data.id, { ...parsed.data, content: parsed.data.content });
			return { success: true, message: 'Document saved.' };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Could not save document.';
			return fail(400, { message });
		}
	},

	publish: async (event) => {
		await requireDocsAdmin(event);
		const idParsed = documentIdSchema.safeParse(event.params);
		if (!idParsed.success) return fail(400, { message: 'Invalid document' });

		const doc = await getDocumentById(idParsed.data.id);
		if (!doc) return fail(404, { message: 'Document not found' });

		const published = !doc.published;

		await updateDocument(idParsed.data.id, {
			title: doc.title,
			slug: doc.slug,
			contentType: doc.contentType,
			mediaUrl: doc.mediaUrl ?? '',
			content: doc.content,
			excerpt: doc.excerpt ?? '',
			published,
			categoryId: doc.categoryId,
			parentDocumentId: doc.parentDocumentId,
			sortOrder: doc.sortOrder,
			tags: doc.tags.map((t) => t.name).join(', ')
		});

		return {
			success: true,
			message: published ? 'Document published.' : 'Document unpublished.'
		};
	},

	delete: async (event) => {
		await requireDocsAdmin(event);
		const idParsed = documentIdSchema.safeParse(event.params);
		if (!idParsed.success) return fail(400, { message: 'Invalid document' });

		await deleteDocument(idParsed.data.id);
		return redirect(303, '/admin/documents');
	}
};
