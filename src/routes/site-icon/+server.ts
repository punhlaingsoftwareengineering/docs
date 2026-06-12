import { error } from '@sveltejs/kit';
import { getSiteIconPayload } from '$lib/server/services/site-icon';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const icon = await getSiteIconPayload();
	if (!icon) error(404, 'Site icon not set');

	return new Response(icon.body, {
		headers: {
			'Content-Type': icon.mime,
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
