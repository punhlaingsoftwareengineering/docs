import { error, json } from '@sveltejs/kit';
import { documentIdSchema } from '$lib/schemas/document';
import { deleteDocument } from '$lib/server/services/docs';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const parsed = documentIdSchema.safeParse(params);
	if (!parsed.success) error(400, 'Invalid document');

	await deleteDocument(parsed.data.id);
	return json({ success: true });
};
