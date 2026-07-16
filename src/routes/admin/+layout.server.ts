import type { LayoutServerLoad } from './$types';
import { requireDocsAdmin } from '$lib/server/auth-guards';

export const load: LayoutServerLoad = async (event) => {
	const user = await requireDocsAdmin(event);
	return { user };
};
