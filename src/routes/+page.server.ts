import { listLandingCategorySections } from '$lib/server/services/categories';
import { getSiteSettings } from '$lib/server/services/settings';
import { resolveLandingSettings } from '$lib/landing/resolve-settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await getSiteSettings();
	const landing = resolveLandingSettings(settings);

	const categorySections = await listLandingCategorySections(landing.docsCategories.descriptions);

	return {
		settings,
		landing,
		categorySections
	};
};
