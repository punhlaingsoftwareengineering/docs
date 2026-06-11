import {
	ORIGIN,
	BETTER_AUTH_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
} from '$app/env/private';

import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { APIError } from 'better-auth/api';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { hasAdmin } from '$lib/server/users';

export const auth = betterAuth({
	baseURL: ORIGIN,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	emailAndPassword: { enabled: false },
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			disableImplicitSignUp: true
		}
	},
	databaseHooks: {
		user: {
			create: {
				before: async () => {
					if (await hasAdmin()) {
						throw new APIError('BAD_REQUEST', {
							message: 'Registration is closed. Only the site owner can sign in.'
						});
					}
				}
			}
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});
