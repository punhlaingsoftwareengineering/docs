import { computeDepthMap, listDocuments, listDocumentsForTree } from '$lib/server/services/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filter = (url.searchParams.get('filter') ?? 'all') as 'all' | 'draft' | 'published';
	const search = url.searchParams.get('q') ?? '';
	const sort = (url.searchParams.get('sort') ?? 'updated') as 'updated' | 'title' | 'category';

	const [documents, allDocs] = await Promise.all([
		listDocuments({ filter, search, sort }),
		listDocumentsForTree({ includeUnpublished: true })
	]);

	const depthMap = computeDepthMap(allDocs);
	const documentsWithDepth = documents.map((doc) => ({
		...doc,
		depth: depthMap.get(doc.id) ?? 1
	}));

	return { documents: documentsWithDepth, filter, search, sort };
};
