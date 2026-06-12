import { json, error } from '@sveltejs/kit';
import { reorderDocumentsSchema } from '$lib/schemas/document';
import { reorderSiblingDocuments } from '$lib/server/services/docs';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const body = await request.json();
	const parsed = reorderDocumentsSchema.safeParse(body);
	if (!parsed.success) {
		return json({ message: 'Invalid reorder payload.' }, { status: 400 });
	}

	try {
		await reorderSiblingDocuments(parsed.data);
		return json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Could not reorder documents.';
		return json({ message }, { status: 400 });
	}
};
