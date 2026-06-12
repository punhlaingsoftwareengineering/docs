import { buildSidebarGroups, listPublishedDocuments } from '$lib/server/services/docs';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const docs = await listPublishedDocuments();
	return { sidebarGroups: buildSidebarGroups(docs) };
};
