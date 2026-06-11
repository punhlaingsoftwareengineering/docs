import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client);

export const auth = betterAuth({
	baseURL: process.env.ORIGIN ?? 'http://localhost:5173',
	secret: process.env.BETTER_AUTH_SECRET!,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: false },
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			disableImplicitSignUp: true
		}
	}
});
