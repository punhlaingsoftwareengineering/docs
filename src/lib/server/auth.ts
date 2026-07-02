import {
	ORIGIN,
	BETTER_AUTH_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
} from '$app/env/private';
import { PUBLIC_APP_NAME } from '$app/env/public';

import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { admin, twoFactor } from 'better-auth/plugins';
import { getRequestEvent } from '$app/server';
import { APIError } from 'better-auth/api';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { fetchGithubUserInfo } from '$lib/server/github-user-info';
import { blockDisableTwoFactorPlugin, oauthTwoFactorPlugin } from '$lib/server/two-factor-oauth';
import { getInviteTokenFromContext } from '$lib/server/invite-context';
import {
	acceptInvitation,
	getInvitationByToken,
	getPendingInvitationByEmail
} from '$lib/server/services/invitations';
import { isBootstrap } from '$lib/server/users';
import { ADMIN_ROLE, USER_ROLE } from '$lib/constants/invitation';
import type { User } from '../../app.d';

export const auth = betterAuth({
	appName: PUBLIC_APP_NAME,
	baseURL: ORIGIN,
	secret: BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	},
	onAPIError: {
		errorURL: '/admin/login'
	},
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			disableImplicitSignUp: true,
			async getUserInfo(token) {
				if (!token.accessToken) return null;
				try {
					return await fetchGithubUserInfo(token.accessToken);
				} catch (error) {
					console.error('GitHub getUserInfo failed:', error);
					return null;
				}
			}
		}
	},
	databaseHooks: {
		user: {
			create: {
				before: async (user, context) => {
					if (await isBootstrap()) {
						return { data: { ...user, role: ADMIN_ROLE } };
					}

					const email = user.email.trim().toLowerCase();
					let invite = await getPendingInvitationByEmail(email);

					if (!invite && context) {
						const token = getInviteTokenFromContext(context);
						if (token) {
							const tokenInvite = await getInvitationByToken(token);
							if (tokenInvite && tokenInvite.email.toLowerCase() === email) {
								invite = tokenInvite;
							}
						}
					}

					if (!invite) {
						throw new APIError('BAD_REQUEST', {
							message: 'Registration is by invitation only.'
						});
					}

					await acceptInvitation(invite.id, email);
					return { data: { ...user, role: ADMIN_ROLE } };
				}
			}
		},
		session: {
			create: {
				before: async (session, context) => {
					if (!context) return;
					const dbUser = (await context.context.internalAdapter.findUserById(
						session.userId
					)) as User | null;
					if (
						!dbUser ||
						dbUser.banned ||
						(dbUser.role !== ADMIN_ROLE && dbUser.role !== USER_ROLE)
					) {
						throw new APIError('FORBIDDEN', {
							message: 'You do not have permission to sign in.'
						});
					}
				}
			}
		}
	},
	plugins: [
		admin({
			defaultRole: 'user',
			adminRoles: [ADMIN_ROLE]
		}),
		twoFactor({
			issuer: PUBLIC_APP_NAME
		}),
		oauthTwoFactorPlugin(),
		blockDisableTwoFactorPlugin(),
		sveltekitCookies(getRequestEvent)
	]
});
