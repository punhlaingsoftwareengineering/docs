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
		const [intro] = await db
			.insert(document)
			.values({
				title: 'Introduction',
				slug: 'intro',
				content:
					'# Introduction\n\nWelcome to your documentation site. This is the first page visitors see when they open **Documentation**.\n\n## What you can do\n\n- Browse nested pages in the left sidebar\n- Use search from the navbar\n- Edit everything in **Admin → Documents**\n',
				excerpt: 'Welcome to your documentation site.',
				published: true,
				categoryId: gettingStarted.id,
				sortOrder: 0
			})
			.returning();

		const [install] = await db
			.insert(document)
			.values({
				title: 'Install',
				slug: 'install',
				content:
					'# Install\n\nThis is a level-2 section page. It has its own content and child pages below.\n\n## Overview\n\nUse the admin editor to manage nested documentation up to three levels deep.\n',
				excerpt: 'How to set up your documentation site.',
				published: true,
				categoryId: gettingStarted.id,
				parentDocumentId: intro.id,
				sortOrder: 0
			})
			.returning();

		await db.insert(document).values([
			{
				title: 'Local setup',
				slug: 'local-setup',
				content:
					'# Local setup\n\n1. Copy `.env.example` to `.env`\n2. Set `DATABASE_URL`\n3. Run `npm run db:push` and `npm run db:seed`\n4. Start the dev server with `npm run dev`\n',
				excerpt: 'Run the site on your machine.',
				published: true,
				categoryId: gettingStarted.id,
				parentDocumentId: install.id,
				sortOrder: 0
			},
			{
				title: 'Writing in Markdown',
				slug: 'writing-markdown',
				content:
					'# Writing in Markdown\n\nUse the CodeMirror editor to write docs with **bold**, _italic_, lists, and code blocks.\n\n```ts\nconst hello = "world";\n```\n',
				excerpt: 'Tips for writing documentation in Markdown.',
				published: true,
				categoryId: gettingStarted.id,
				sortOrder: 1
			}
		]);
	}
}

console.log('Database seeded.');
