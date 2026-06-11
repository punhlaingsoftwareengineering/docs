import { building } from '$app/env';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { seedDatabase } from '$lib/server/db/seed';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

let seedPromise: Promise<void> | null = null;
function ensureSeeded() {
	if (!seedPromise) {
		seedPromise = seedDatabase().catch((err) => {
			console.error('Database seed failed:', err);
			seedPromise = null;
		});
	}
	return seedPromise;
}

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
	});
});

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	if (!building) await ensureSeeded();

	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleParaglide, handleBetterAuth);
