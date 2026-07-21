import { defineEnvVars } from '@sveltejs/kit/hooks';
import { z } from 'zod';

const optionalString = z.string().optional();

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Postgres connection string for CMS tables (documents, categories, site settings).'
	},
	AUTH_DATABASE_URL: {
		description:
			'Portal Postgres URL for shared Better Auth tables (user, session, account, verification). Defaults to DATABASE_URL when unset.'
	},
	PORTAL_DATABASE_URL: {
		description:
			'Portal Postgres URL for permission checks (user_profile, access_role, service). Defaults to AUTH_DATABASE_URL when unset.'
	},
	ORIGIN: {
		description:
			'Public docs URL (scheme + host + port), e.g. `http://docs.local.test` or `https://docs.phh.com`. Required for Better Auth and CSRF.'
	},
	PORTAL_ORIGIN: {
		description:
			'Employee portal public URL for login redirects, e.g. `http://portal.local.test` or `https://phh.com`.'
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens — must match employee-portal and other SSO apps. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
	},
	AUTH_COOKIE_DOMAIN: {
		description:
			'Shared session cookie domain, e.g. `.local.test` (local SSO) or `.phh.com` (production). Must match portal and drive.'
	},
	AUTH_SESSION_EXPIRES_IN: {
		description: 'Better Auth session lifetime. Must match portal (default `7d`).'
	},
	AUTH_SESSION_UPDATE_AGE: {
		description: 'Better Auth session refresh interval. Must match portal (default `30m`).'
	},
	AUTH_SESSION_COOKIE_CACHE_MAX_AGE: {
		description: 'Better Auth cookie cache max age. Must match portal (default `30m`).'
	},
	PUBLIC_APP_NAME: {
		description: 'Default application name used in page titles and branding fallbacks.',
		public: true,
		default: 'zarnihlawn docs'
	},
	DRIVE_ORIGIN: {
		description:
			'Public PHH-DRIVE URL for returned file links, e.g. `http://drive.phh.com` or `http://drive.local.test`.',
		schema: optionalString
	},
	DRIVE_INTERNAL_ORIGIN: {
		description:
			'Server-side PHH-DRIVE base URL in Docker, e.g. `http://host.docker.internal:1025`. Falls back to DRIVE_ORIGIN.',
		schema: optionalString
	},
	DRIVE_TEAM_API_KEY: {
		description:
			'Team-scoped PHH-DRIVE API key (`znltv_…`) for documentation media uploads. Never expose to the browser.',
		schema: optionalString
	},
	DRIVE_STORAGE_PROVIDER: {
		description:
			'PHH-DRIVE storage target for uploads: `local` (default) or `tigris`. Must match the team drive.',
		schema: optionalString
	}
});
