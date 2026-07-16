import pg from 'pg';

const PLACEHOLDER_PORTAL_DATABASE_URL = 'postgresql://build:build@placeholder.invalid/postgres';

function resolvePortalDatabaseUrl(): string {
	const fromEnv =
		(typeof process.env.PORTAL_DATABASE_URL === 'string' &&
		process.env.PORTAL_DATABASE_URL.trim()
			? process.env.PORTAL_DATABASE_URL.trim()
			: undefined) ??
		(typeof process.env.AUTH_DATABASE_URL === 'string' && process.env.AUTH_DATABASE_URL.trim()
			? process.env.AUTH_DATABASE_URL.trim()
			: undefined);

	if (!fromEnv) {
		console.warn(
			'PORTAL_DATABASE_URL is not set; falling back to placeholder (portal access checks will fail until configured).'
		);
	}
	return fromEnv ?? PLACEHOLDER_PORTAL_DATABASE_URL;
}

export const portalPool = new pg.Pool({
	connectionString: resolvePortalDatabaseUrl(),
	max: 5
});
