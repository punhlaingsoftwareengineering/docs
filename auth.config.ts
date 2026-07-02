import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, twoFactor } from 'better-auth/plugins';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client);

export const auth = betterAuth({
	appName: process.env.PUBLIC_APP_NAME ?? 'zarnihlawn docs',
	baseURL: process.env.ORIGIN ?? 'http://localhost:1026',
	secret: process.env.BETTER_AUTH_SECRET!,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			disableImplicitSignUp: true
		}
	},
	plugins: [
		admin({ defaultRole: 'user', adminRoles: ['admin'] }),
		twoFactor({
			issuer: process.env.PUBLIC_APP_NAME ?? 'zarnihlawn docs'
		})
	]
});
