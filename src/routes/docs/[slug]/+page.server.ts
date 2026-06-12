import { error } from '@sveltejs/kit';
import { docSlugSchema } from '$lib/schemas/document';
import {
	getAdjacentDocuments,
	getDocumentAncestors,
	getDocumentBySlug,
	listChildDocuments
} from '$lib/server/services/docs';
import { extractHeadings, renderMarkdown } from '$lib/markdown';
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

	const [childRows, ancestors, adjacent] = await Promise.all([
		listChildDocuments(doc.id, { includeUnpublished: isAdmin }),
		getDocumentAncestors(parsed.data.slug, { includeUnpublished: isAdmin }),
		getAdjacentDocuments(parsed.data.slug)
	]);

	const childPages = childRows.map((child) => ({
		slug: child.slug,
		title: child.title,
		excerpt: child.excerpt
	}));

	const headings = extractHeadings(doc.content);

	return {
		doc,
		hasChildren: childPages.length > 0,
		isPreview: !doc.published && isAdmin,
		childPages,
		ancestors,
		adjacent,
		html: renderMarkdown(doc.content),
		headings
	};
};
