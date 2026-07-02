import { building } from '$app/env';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

function isAuthApiPath(pathname: string) {
	return pathname === '/api/auth' || pathname.startsWith('/api/auth/');
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
	if (!building && isAuthApiPath(event.url.pathname)) {
		return auth.handler(event.request);
	}

	if (!isAuthApiPath(event.url.pathname)) {
		try {
			const session = await auth.api.getSession({ headers: event.request.headers });

			if (session) {
				event.locals.session = session.session;
				event.locals.user = session.user;
			}
		} catch (error) {
			console.error('Failed to load session:', error);
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleParaglide, handleBetterAuth);
