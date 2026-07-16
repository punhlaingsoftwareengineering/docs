import { DATABASE_URL as DATABASE_URL_ENV } from '$app/env/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

function resolveDatabaseUrl(): string {
	const fromEnv =
		(typeof DATABASE_URL_ENV === 'string' && DATABASE_URL_ENV.trim()
			? DATABASE_URL_ENV.trim()
			: undefined) ??
		(typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim()
			? process.env.DATABASE_URL.trim()
			: undefined);

	if (!fromEnv) {
		throw new Error('DATABASE_URL is not set');
	}

	return fromEnv;
}

const pool = new pg.Pool({ connectionString: resolveDatabaseUrl() });

export const db = drizzle(pool, { schema });
