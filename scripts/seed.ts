import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/server/db/schema';
import { category, document, siteSettings } from '../src/lib/server/db/schema';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const db = drizzle(neon(process.env.DATABASE_URL), { schema });

const DEFAULT_CATEGORIES = [
	{ name: 'Getting Started', slug: 'getting-started', sortOrder: 0 },
	{ name: 'Guides', slug: 'guides', sortOrder: 1 },
	{ name: 'Reference', slug: 'reference', sortOrder: 2 },
	{ name: 'Examples', slug: 'examples', sortOrder: 3 },
	{ name: 'Changelog', slug: 'changelog', sortOrder: 4 }
] as const;

const existingCategories = await db.select().from(category).limit(1);
if (existingCategories.length === 0) {
	await db.insert(category).values([...DEFAULT_CATEGORIES]);
}

await db.insert(siteSettings).values({ id: 'default' }).onConflictDoNothing();

const [existingDoc] = await db.select().from(document).limit(1);
if (!existingDoc) {
	const [gettingStarted] = await db
		.select()
		.from(category)
		.where(eq(category.slug, 'getting-started'))
		.limit(1);

	if (gettingStarted) {
		await db.insert(document).values([
			{
				title: 'Welcome',
				slug: 'welcome',
				content:
					'# Welcome\n\nThis is your documentation site. Edit this page in **Admin → Documents**.\n\n## Getting started\n\n1. Sign in at `/login`\n2. Create or edit documents\n3. Publish when ready\n',
				excerpt: 'Get started with your new documentation site.',
				published: true,
				categoryId: gettingStarted.id
			},
			{
				title: 'Writing in Markdown',
				slug: 'writing-markdown',
				content:
					'# Writing in Markdown\n\nUse the CodeMirror editor to write docs with **bold**, _italic_, lists, and code blocks.\n\n```ts\nconst hello = "world";\n```\n',
				excerpt: 'Tips for writing documentation in Markdown.',
				published: true,
				categoryId: gettingStarted.id
			}
		]);
	}
}

console.log('Database seeded.');
