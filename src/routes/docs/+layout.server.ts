import { listPublishedDocuments } from '$lib/server/services/docs';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const docs = await listPublishedDocuments();

	const groupMap = new Map<string, { name: string; slug: string; docs: { slug: string; title: string }[] }>();

	for (const doc of docs) {
		if (!groupMap.has(doc.categorySlug)) {
			groupMap.set(doc.categorySlug, {
				name: doc.categoryName,
				slug: doc.categorySlug,
				docs: []
			});
		}
		groupMap.get(doc.categorySlug)!.docs.push({ slug: doc.slug, title: doc.title });
	}

	return { sidebarGroups: [...groupMap.values()] };
};
