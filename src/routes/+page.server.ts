import { listFooterCategories, listLandingCategories } from '$lib/server/services/categories';
import { getSiteSettings } from '$lib/server/services/settings';
import { resolveLandingSettings } from '$lib/landing/resolve-settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [settings, footerCategories, landingCategories] = await Promise.all([
		getSiteSettings(),
		listFooterCategories(),
		listLandingCategories()
	]);

	return {
		settings,
		landing: resolveLandingSettings(settings),
		footerCategories,
		landingCategories
	};
};
