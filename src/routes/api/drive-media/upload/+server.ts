import { assertDocsAdminApi } from '$lib/server/auth-guards';
import { handleDrivePortalError } from '$lib/server/drive-media-api';
import { uploadDocsMedia } from '$lib/server/drive-portal-client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	await assertDocsAdminApi(locals);

	const form = await request.formData();
	const file = form.get('file');
	if (!(file instanceof File) || file.size === 0) {
		error(400, 'Missing file');
	}

	const fileName = file.name.trim() || 'upload';
	const mimeType = file.type || 'application/octet-stream';
	const bytes = new Uint8Array(await file.arrayBuffer());

	try {
		const result = await uploadDocsMedia(fileName, mimeType, bytes);
		return json(result);
	} catch (e) {
		handleDrivePortalError(e);
	}
};
