import { error } from '@sveltejs/kit';
import { docSlugSchema } from '$lib/schemas/document';
import { getDocumentBySlug } from '$lib/server/services/docs';
import { renderMarkdown } from '$lib/markdown';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const parsed = docSlugSchema.safeParse(params);

	if (!parsed.success) {
		error(404, 'Documentation page not found');
	}

	const isAdmin = Boolean(locals.user);
	const doc = await getDocumentBySlug(parsed.data.slug, { includeUnpublished: isAdmin });

	if (!doc) {
		error(404, 'Documentation page not found');
	}

	if (!doc.published && !isAdmin) {
		error(404, 'Documentation page not found');
	}

	return {
		doc,
		html: renderMarkdown(doc.content),
		isPreview: !doc.published && isAdmin
	};
};
