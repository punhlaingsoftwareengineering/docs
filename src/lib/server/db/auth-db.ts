import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { account, session, user, verification } from './auth.schema';

const PLACEHOLDER_AUTH_DATABASE_URL = 'postgresql://build:build@placeholder.invalid/postgres';

function resolveAuthDatabaseUrl(): string {
	const fromEnv =
		(typeof process.env.AUTH_DATABASE_URL === 'string' && process.env.AUTH_DATABASE_URL.trim()
			? process.env.AUTH_DATABASE_URL.trim()
			: undefined);

	if (!fromEnv) {
		console.warn(
			'AUTH_DATABASE_URL is not set; falling back to placeholder (auth will fail until configured).'
		);
	}
	return fromEnv ?? PLACEHOLDER_AUTH_DATABASE_URL;
}

const authPool = new pg.Pool({
	connectionString: resolveAuthDatabaseUrl(),
	max: 10
});

const authSchema = {
	user,
	session,
	account,
	verification
};

export const authDb = drizzle(authPool, { schema: authSchema });
