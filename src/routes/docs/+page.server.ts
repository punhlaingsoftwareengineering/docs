import { searchPublishedDocuments } from '$lib/server/services/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';
	const results = await searchPublishedDocuments(q);
	return { results, q };
};
