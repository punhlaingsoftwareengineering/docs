import { getSiteSettings } from '$lib/server/services/settings';
import { hasAdmin } from '$lib/server/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const [settings, adminExists] = await Promise.all([getSiteSettings(), hasAdmin()]);
	const user = event.locals.user;

	return {
		site: {
			siteTitle: settings.siteTitle,
			tagline: settings.tagline
		},
		auth: {
			hasAdmin: adminExists,
			isSignedIn: Boolean(user)
		}
	};
};
