import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
	throw new Error(
		'DATABASE_URL is not set. Copy .env.example to .env and set the CMS Postgres URL.'
	);
}

export default defineConfig({
	// CMS tables only — auth tables live in portal Postgres (AUTH_DATABASE_URL).
	schema: './src/lib/server/db/cms.schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: databaseUrl },
	verbose: true,
	strict: true
});
