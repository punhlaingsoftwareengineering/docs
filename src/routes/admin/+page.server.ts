import { getDocumentStats, getRecentDocuments } from '$lib/server/services/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [stats, recent] = await Promise.all([getDocumentStats(), getRecentDocuments(5)]);
	return { stats, recent };
};
