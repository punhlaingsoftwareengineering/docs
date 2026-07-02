import { defineEnvVars } from '@sveltejs/kit/hooks';

export const variables = defineEnvVars({
	DATABASE_URL: { description: 'The database connection string.' },
	ORIGIN: {
		description:
			'Public app URL (scheme + host + port), e.g. `http://localhost:1026` or `https://docs.example.com` behind a proxy. Required for Better Auth OAuth and CSRF. See `.env.example` and `docs/DEPLOYMENT.md`.'
	},
	BETTER_AUTH_SECRET: {
		description:
			'Secret used to sign tokens. For production use 32 characters generated with high entropy. See [Better Auth installation](https://www.better-auth.com/docs/installation).'
	},
	GITHUB_CLIENT_ID: {
		description:
			'GitHub OAuth client ID. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).'
	},
	GITHUB_CLIENT_SECRET: {
		description:
			'GitHub OAuth client secret. See [Better Auth GitHub provider](https://www.better-auth.com/docs/authentication/github).'
	},
	PUBLIC_APP_NAME: {
		description: 'Default application name used in page titles and branding fallbacks.',
		public: true,
		default: 'zarnihlawn docs'
	},
	SMTP_USER: {
		description:
			'Gmail address used to send admin invitation emails via SMTP. Optional; copy-link still works without it.'
	},
	SMTP_PASS: {
		description:
			'Gmail App Password for SMTP_USER (not your normal Google password). Create at Google Account → Security → App passwords.'
	},
	SMTP_HOST: {
		description: 'SMTP host. Defaults to `smtp.gmail.com` when unset.'
	},
	SMTP_PORT: {
		description: 'SMTP port. Defaults to `587` when unset.'
	},
	EMAIL_FROM: {
		description:
			'From address for invitation emails, e.g. `Docs <you@gmail.com>`. Defaults to SMTP_USER when unset.'
	}
});
