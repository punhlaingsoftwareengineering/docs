import { assertDocsAdminApi } from '$lib/server/auth-guards';
import { handleDrivePortalError } from '$lib/server/drive-media-api';
import { pickDocsMediaFile } from '$lib/server/drive-portal-client';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

const bodySchema = z.object({ fileId: z.string().uuid() }).strict();

export const POST: RequestHandler = async ({ request, locals }) => {
	await assertDocsAdminApi(locals);

	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		error(400, 'Invalid JSON');
	}

	const parsed = bodySchema.safeParse(raw);
	if (!parsed.success) {
		error(400, parsed.error.message);
	}

	try {
		const result = await pickDocsMediaFile(parsed.data.fileId);
		return json(result);
	} catch (e) {
		handleDrivePortalError(e);
	}
};
