import { asc, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { category, document } from '$lib/server/db/schema';
import type { FooterCategory } from '$lib/types/docs-tree';
import type { LandingCategoryCard } from '$lib/types/landing';
import { slugify } from '$lib/utils/slug';
import { listDocumentsForTree } from '$lib/server/services/docs';

export async function listCategories() {
	return db.select().from(category).orderBy(asc(category.sortOrder));
}

export async function listFooterCategories(): Promise<FooterCategory[]> {
	const [categories, docs] = await Promise.all([
		listCategories(),
		listDocumentsForTree({ includeUnpublished: false })
	]);

	return categories
		.map((cat) => {
			const catDocs = docs.filter((doc) => doc.categoryId === cat.id);
			if (catDocs.length === 0) return null;

			const roots = catDocs
				.filter((doc) => !doc.parentDocumentId)
				.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

			const entry = roots[0] ?? catDocs[0];

			return {
				name: cat.name,
				slug: cat.slug,
				entrySlug: entry.slug,
				documents: roots.map((doc) => ({ title: doc.title, slug: doc.slug }))
			};
		})
		.filter((cat): cat is FooterCategory => cat !== null);
}

export async function listLandingCategories(): Promise<LandingCategoryCard[]> {
	const [categories, docs] = await Promise.all([
		listCategoriesWithCounts(),
		listDocumentsForTree({ includeUnpublished: false })
	]);

	return categories.map((cat) => {
		const catDocs = docs.filter((doc) => doc.categoryId === cat.id);
		const roots = catDocs
			.filter((doc) => !doc.parentDocumentId)
			.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
		const entry = roots[0] ?? catDocs[0];

		return {
			name: cat.name,
			slug: cat.slug,
			entrySlug: entry?.slug ?? cat.slug,
			documentCount: cat.documentCount
		};
	});
}

export async function listCategoriesWithCounts() {
	return db
		.select({
			id: category.id,
			name: category.name,
			slug: category.slug,
			sortOrder: category.sortOrder,
			documentCount: sql<number>`count(${document.id})::int`
		})
		.from(category)
		.leftJoin(document, eq(document.categoryId, category.id))
		.groupBy(category.id)
		.orderBy(asc(category.sortOrder));
}

export async function getCategoryById(id: string) {
	const [row] = await db.select().from(category).where(eq(category.id, id)).limit(1);
	return row ?? null;
}

export async function getCategoryBySlug(slug: string) {
	const [row] = await db.select().from(category).where(eq(category.slug, slug)).limit(1);
	return row ?? null;
}

export async function createCategory(data: {
	name: string;
	slug?: string;
	sortOrder?: number;
}) {
	const slug = data.slug?.trim() || slugify(data.name);
	const [row] = await db
		.insert(category)
		.values({
			name: data.name,
			slug,
			sortOrder: data.sortOrder ?? 0
		})
		.returning();
	return row;
}

export async function updateCategory(
	id: string,
	data: { name: string; slug?: string; sortOrder?: number }
) {
	const slug = data.slug?.trim() || slugify(data.name);
	const [row] = await db
		.update(category)
		.set({
			name: data.name,
			slug,
			sortOrder: data.sortOrder ?? 0
		})
		.where(eq(category.id, id))
		.returning();
	return row ?? null;
}

export async function deleteCategory(id: string) {
	const [stats] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(document)
		.where(eq(document.categoryId, id));

	if ((stats?.count ?? 0) > 0) {
		throw new Error(
			`Cannot delete a category that has ${stats!.count} document(s). Move or delete them first.`
		);
	}

	await db.delete(category).where(eq(category.id, id));
}

function isUniqueViolation(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code: string }).code === '23505'
	);
}

export function categoryErrorMessage(error: unknown, fallback: string): string {
	if (isUniqueViolation(error)) {
		return 'A category with this slug already exists.';
	}
	return error instanceof Error ? error.message : fallback;
}
