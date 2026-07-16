import { building, dev } from '$app/environment';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { isAuthPath } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const CUSTOM_API_AUTH_PATH_PREFIXES = ['/api/auth/logout'] as const;

function isCustomApiAuthPath(pathname: string): boolean {
	return CUSTOM_API_AUTH_PATH_PREFIXES.some(
		(base) => pathname === base || pathname.startsWith(`${base}/`)
	);
}

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	try {
		const session = await auth.api.getSession({ headers: event.request.headers });

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	} catch (e) {
		console.error('[hooks] getSession failed (database or auth unavailable)', e);
		event.locals.authUnavailable = true;
	}

	if (building) {
		return resolve(event);
	}

	if (isCustomApiAuthPath(event.url.pathname)) {
		return resolve(event);
	}

	if (isAuthPath(event.url.toString(), auth.options)) {
		return auth.handler(event.request);
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleBetterAuth);
