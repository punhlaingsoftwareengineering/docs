import { PORTAL_ORIGIN as PORTAL_ORIGIN_ENV } from '$app/env/private';
import { getConfiguredOrigin } from '$lib/server/public-origin';

/** Employee portal public origin for SSO redirects (e.g. `https://phh.com`). */
export function getPortalOrigin(): string | undefined {
	const raw =
		(typeof PORTAL_ORIGIN_ENV === 'string' && PORTAL_ORIGIN_ENV.trim()
			? PORTAL_ORIGIN_ENV.trim()
			: undefined) ??
		(typeof process.env.PORTAL_ORIGIN === 'string' && process.env.PORTAL_ORIGIN.trim()
			? process.env.PORTAL_ORIGIN.trim()
			: undefined);
	return raw?.replace(/\/$/, '');
}

/** Portal login URL with optional return to current docs URL. */
export function portalLoginUrl(returnTo?: string): string {
	const portal = getPortalOrigin();
	if (!portal) return '/auth/login';

	const docsOrigin = getConfiguredOrigin();
	const target =
		returnTo ??
		(docsOrigin ? `${docsOrigin}/admin` : undefined) ??
		'http://localhost:1026/admin';

	const url = new URL('/auth/login', portal);
	url.searchParams.set('redirectTo', target);
	return url.toString();
}
