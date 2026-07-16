import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { canAccessDocsAdmin, PortalAccessUnavailableError } from '$lib/server/portal-access';
import { portalLoginUrl } from '$lib/server/portal-origin';
import { getConfiguredOrigin } from '$lib/server/public-origin';
import type { User } from '../../app.d';

export async function requireDocsAdmin(event: RequestEvent): Promise<User> {
	if (event.locals.authUnavailable) {
		error(503, 'Authentication service is temporarily unavailable.');
	}

	const user = event.locals.user;
	if (!user) {
		const origin = getConfiguredOrigin();
		const returnTo = origin
			? `${origin}${event.url.pathname}${event.url.search}`
			: undefined;
		throw redirect(303, portalLoginUrl(returnTo));
	}

	let allowed: boolean;
	try {
		allowed = await canAccessDocsAdmin(user.id);
	} catch (e) {
		if (e instanceof PortalAccessUnavailableError) {
			error(
				503,
				'Unable to verify documentation admin access. Check PORTAL_DATABASE_URL and that the docs container can reach Postgres.'
			);
		}
		throw e;
	}
	if (!allowed) {
		error(403, 'You do not have permission to access the documentation admin.');
	}

	return user;
}

export async function assertDocsAdminApi(locals: App.Locals): Promise<User> {
	if (locals.authUnavailable) {
		error(503, 'Authentication service unavailable');
	}

	const user = locals.user;
	if (!user) {
		error(401, 'Unauthorized');
	}

	let allowed: boolean;
	try {
		allowed = await canAccessDocsAdmin(user.id);
	} catch (e) {
		if (e instanceof PortalAccessUnavailableError) {
			error(
				503,
				'Unable to verify documentation admin access. Check PORTAL_DATABASE_URL and that the docs container can reach Postgres.'
			);
		}
		throw e;
	}
	if (!allowed) {
		error(403, 'Forbidden');
	}

	return user;
}
