import { error } from '@sveltejs/kit';
import { docSlugSchema } from '$lib/schemas/document';
import {
	getAdjacentDocuments,
	getDocumentAncestors,
	getDocumentBySlug,
	listChildDocuments
} from '$lib/server/services/docs';
import { DEFAULT_DOCUMENT_CONTENT_TYPE } from '$lib/constants/document-content';
import { extractHeadings, renderMarkdown, sanitizeDocHtml } from '$lib/markdown';
import { slugify } from '$lib/utils/slug';
import { isAdminUser } from '$lib/server/users';
import { parseCsv } from '$lib/utils/csv';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const parsed = docSlugSchema.safeParse(params);

	if (!parsed.success) {
		error(404, 'Documentation page not found');
	}

	const isAdmin = isAdminUser(locals.user);
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

	const contentType = doc.contentType ?? DEFAULT_DOCUMENT_CONTENT_TYPE;
	const hasContent = Boolean(doc.content?.trim());
	const html =
		contentType === 'markdown'
			? hasContent
				? renderMarkdown(doc.content)
				: ''
			: contentType === 'html'
				? hasContent
					? sanitizeDocHtml(doc.content)
					: ''
				: hasContent
					? renderMarkdown(doc.content)
					: '';

	const csv =
		contentType === 'csv' && hasContent
			? parseCsv(doc.content, { maxRows: 200, maxCols: 50 })
			: null;

	const headings =
		contentType === 'markdown' || contentType === 'html' || contentType === 'csv' || hasContent
			? [
					{ id: slugify(doc.title), text: doc.title, level: 1 },
					...(contentType === 'markdown' && hasContent
						? extractHeadings(doc.content, { maxLevel: 2 })
						: [])
				]
			: [{ id: slugify(doc.title), text: doc.title, level: 1 }];

	return {
		doc,
		contentType,
		hasChildren: childPages.length > 0,
		isPreview: !doc.published && isAdmin,
		childPages,
		ancestors,
		adjacent,
		html,
		csv,
		headings
	};
};
