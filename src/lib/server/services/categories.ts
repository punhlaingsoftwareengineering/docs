import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { category } from '$lib/server/db/schema';

export async function listCategories() {
	return db.select().from(category).orderBy(asc(category.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
	const [row] = await db.select().from(category).where(eq(category.slug, slug)).limit(1);
	return row ?? null;
}
