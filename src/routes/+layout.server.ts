import { APP_NAME } from '$lib/config/app-name';
import { getSiteSettings } from '$lib/server/services/settings';
import { hasAdmin } from '$lib/server/users';
import { getSiteIconHref } from '$lib/utils/site-icon';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const [settings, adminExists] = await Promise.all([getSiteSettings(), hasAdmin()]);
	const user = event.locals.user;

	return {
		site: {
			siteTitle: settings.siteTitle,
			tagline: settings.tagline,
			appName: APP_NAME,
			siteIconHref: getSiteIconHref(settings)
		},
		auth: {
			hasAdmin: adminExists,
			isSignedIn: Boolean(user)
		}
	};
};
