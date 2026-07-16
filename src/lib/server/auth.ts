import { BETTER_AUTH_SECRET as BETTER_AUTH_SECRET_ENV } from '$app/env/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { getRequestEvent } from '$app/server';
import { authDb } from '$lib/server/db/auth-db';
import { account, session, user, verification } from '$lib/server/db/auth.schema';
import { getAuthSessionOptions } from '$lib/server/auth-session-config';
import { getConfiguredOrigin } from '$lib/server/public-origin';
import { PUBLIC_APP_NAME } from '$app/env/public';

const isBuildStep = building || process.env.BUILDING === 'true';

const baseURL = getConfiguredOrigin() ?? (isBuildStep ? 'http://localhost:1026' : undefined);

const secret =
	(typeof BETTER_AUTH_SECRET_ENV === 'string' && BETTER_AUTH_SECRET_ENV.trim()
		? BETTER_AUTH_SECRET_ENV.trim()
		: undefined) ??
	(typeof process.env.BETTER_AUTH_SECRET === 'string' && process.env.BETTER_AUTH_SECRET.trim()
		? process.env.BETTER_AUTH_SECRET.trim()
		: undefined) ??
	(isBuildStep ? 'build-only-secret-change-me' : undefined);

if (!isBuildStep && process.env.NODE_ENV === 'production') {
	if (!baseURL) {
		throw new Error('[config] ORIGIN is not set.');
	}
	if (!secret) {
		throw new Error('[config] BETTER_AUTH_SECRET is not set.');
	}
}

const { session: sessionOptions, advanced: sessionAdvanced } = getAuthSessionOptions();

export const auth = betterAuth({
	appName: PUBLIC_APP_NAME,
	baseURL: baseURL!,
	secret: secret!,
	advanced: sessionAdvanced,
	session: sessionOptions,
	database: drizzleAdapter(authDb, {
		provider: 'pg',
		schema: { user, session, account, verification }
	}),
	plugins: [sveltekitCookies(getRequestEvent)]
});
