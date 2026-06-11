import { getSiteSettings } from '$lib/server/services/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await getSiteSettings();
	return { settings };
};
