import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const pool = new pg.Pool({
	connectionString: process.env.AUTH_DATABASE_URL ?? process.env.DATABASE_URL
});
const db = drizzle(pool);

export const auth = betterAuth({
	appName: process.env.PUBLIC_APP_NAME ?? 'zarnihlawn docs',
	baseURL: process.env.ORIGIN ?? 'http://docs.local.test',
	secret: process.env.BETTER_AUTH_SECRET!,
	database: drizzleAdapter(db, { provider: 'pg' })
});
