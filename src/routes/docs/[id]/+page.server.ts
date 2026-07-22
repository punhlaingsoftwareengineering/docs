import { error } from '@sveltejs/kit';
import { documentIdSchema } from '$lib/schemas/document';
import {
	getAdjacentDocuments,
	getDocumentAncestors,
	getDocumentById,
	listChildDocuments
} from '$lib/server/services/docs';
import { DEFAULT_DOCUMENT_CONTENT_TYPE } from '$lib/constants/document-content';
import { renderMarkdown, sanitizeDocHtml } from '$lib/markdown';
import { canPreviewUnpublishedDocs } from '$lib/server/users';
import { parseCsv } from '$lib/utils/csv';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const parsed = documentIdSchema.safeParse(params);

	if (!parsed.success) {
		error(404, 'Documentation page not found');
	}

	const canPreview = await canPreviewUnpublishedDocs(locals.user?.id);
	const doc = await getDocumentById(parsed.data.id, { includeUnpublished: canPreview });

	if (!doc) {
		error(404, 'Documentation page not found');
	}

	if (!doc.published && !canPreview) {
		error(404, 'Documentation page not found');
	}

	const [childRows, ancestors, adjacent] = await Promise.all([
		listChildDocuments(doc.id, { includeUnpublished: canPreview }),
		getDocumentAncestors(parsed.data.id, { includeUnpublished: canPreview }),
		getAdjacentDocuments(parsed.data.id)
	]);

	const childPages = childRows.map((child) => ({
		id: child.id,
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

	return {
		doc,
		contentType,
		hasChildren: childPages.length > 0,
		isPreview: !doc.published && canPreview,
		childPages,
		ancestors,
		adjacent,
		html,
		csv
	};
};
