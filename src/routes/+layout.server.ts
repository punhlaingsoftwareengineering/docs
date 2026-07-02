import { APP_NAME } from '$lib/config/app-name';
import { getSiteSettings } from '$lib/server/services/settings';
import { hasAdmin, isAdminUser } from '$lib/server/users';
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
			siteIconHref: getSiteIconHref(settings),
			navLinksEnabled: settings.navLinksEnabled,
			navLinks: settings.navLinks ?? []
		},
		auth: {
			hasAdmin: adminExists,
			isSignedIn: Boolean(user),
			isAdmin: isAdminUser(user)
		}
	};
};
