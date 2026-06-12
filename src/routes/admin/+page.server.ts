import { listCategoriesWithCounts } from '$lib/server/services/categories';
import { getDocumentStats, listDocumentOrderGroups } from '$lib/server/services/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [stats, categories, orderGroups] = await Promise.all([
		getDocumentStats(),
		listCategoriesWithCounts(),
		listDocumentOrderGroups()
	]);
	return { stats, categories, orderGroups };
};
