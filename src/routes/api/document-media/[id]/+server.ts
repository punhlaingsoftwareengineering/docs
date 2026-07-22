import { error } from '@sveltejs/kit';
import { documentIdSchema } from '$lib/schemas/document';
import { getDocumentById } from '$lib/server/services/docs';
import { canPreviewUnpublishedDocs } from '$lib/server/users';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const parsed = documentIdSchema.safeParse(params);
	if (!parsed.success) {
		error(404, 'Media not found');
	}

	const canPreview = await canPreviewUnpublishedDocs(locals.user?.id);
	const doc = await getDocumentById(parsed.data.id, { includeUnpublished: canPreview });

	if (!doc?.mediaUrl) {
		error(404, 'Media not found');
	}

	if (!doc.published && !canPreview) {
		error(404, 'Media not found');
	}

	if (doc.contentType !== 'pdf') {
		error(404, 'Media not found');
	}

	let upstream: Response;
	try {
		upstream = await fetch(doc.mediaUrl, { redirect: 'follow' });
	} catch {
		error(502, 'Could not fetch media file');
	}

	if (!upstream.ok || !upstream.body) {
		error(502, 'Could not fetch media file');
	}

	const contentType = upstream.headers.get('content-type') ?? 'application/pdf';

	return new Response(upstream.body, {
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': 'inline',
			'Cache-Control': 'private, max-age=300'
		}
	});
};
