import { error } from '@sveltejs/kit';
import { getDocumentBySlug } from '$lib/server/services/docs';
import { isAdminUser } from '$lib/server/users';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const isAdmin = isAdminUser(locals.user);
	const doc = await getDocumentBySlug(params.slug, { includeUnpublished: isAdmin });

	if (!doc?.mediaUrl) {
		error(404, 'Media not found');
	}

	if (!doc.published && !isAdmin) {
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
