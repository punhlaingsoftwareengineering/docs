import { assertDocsAdminApi } from '$lib/server/auth-guards';
import { handleDrivePortalError } from '$lib/server/drive-media-api';
import { listDocsMediaFiles } from '$lib/server/drive-portal-client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	await assertDocsAdminApi(locals);
	try {
		const files = await listDocsMediaFiles();
		return json({ files });
	} catch (e) {
		handleDrivePortalError(e);
	}
};
