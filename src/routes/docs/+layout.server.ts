import { buildSidebarGroups, listPublishedDocuments } from '$lib/server/services/docs';
import { safeDbQuery } from '$lib/server/db/safe-query';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const docs = await safeDbQuery('docs/layout listPublishedDocuments', listPublishedDocuments, []);
	return { sidebarGroups: buildSidebarGroups(docs) };
};
