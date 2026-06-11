import { listDocuments } from '$lib/server/services/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filter = (url.searchParams.get('filter') ?? 'all') as 'all' | 'draft' | 'published';
	const search = url.searchParams.get('q') ?? '';
	const sort = (url.searchParams.get('sort') ?? 'updated') as 'updated' | 'title' | 'category';

	const documents = await listDocuments({ filter, search, sort });

	return { documents, filter, search, sort };
};
