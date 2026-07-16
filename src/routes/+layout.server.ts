import { APP_NAME } from '$lib/config/app-name';
import { getSiteSettings } from '$lib/server/services/settings';
import { canAccessDocsAdmin } from '$lib/server/portal-access';
import { getSiteIconHref } from '$lib/utils/site-icon';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const settings = await getSiteSettings();
	const user = event.locals.user;
	const canAccessAdmin = user ? await canAccessDocsAdmin(user.id) : false;

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
			isSignedIn: Boolean(user),
			canAccessAdmin,
			authUnavailable: Boolean(event.locals.authUnavailable)
		}
	};
};
