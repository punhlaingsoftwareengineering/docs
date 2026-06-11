import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { category, document, documentTag, tag } from '$lib/server/db/schema';
import { slugify } from '$lib/utils/slug';

export type DocumentListFilter = 'all' | 'draft' | 'published';

export async function listDocuments(options: {
	filter?: DocumentListFilter;
	search?: string;
	sort?: 'updated' | 'title' | 'category';
} = {}) {
	const { filter = 'all', search = '', sort = 'updated' } = options;

	const conditions = [];
	if (filter === 'draft') conditions.push(eq(document.published, false));
	if (filter === 'published') conditions.push(eq(document.published, true));
	if (search.trim()) {
		const q = `%${search.trim()}%`;
		conditions.push(
			or(ilike(document.title, q), ilike(document.content, q), ilike(document.excerpt, q))
		);
	}

	const orderBy =
		sort === 'title'
			? asc(document.title)
			: sort === 'category'
				? asc(category.name)
				: desc(document.updatedAt);

	const rows = await db
		.select({
			id: document.id,
			slug: document.slug,
			title: document.title,
			excerpt: document.excerpt,
			published: document.published,
			updatedAt: document.updatedAt,
			categoryName: category.name,
			categorySlug: category.slug
		})
		.from(document)
		.innerJoin(category, eq(document.categoryId, category.id))
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(orderBy);

	return rows;
}

export async function searchPublishedDocuments(query: string) {
	if (!query.trim()) return listPublishedDocuments();
	const q = `%${query.trim()}%`;
	return db
		.select({
			id: document.id,
			slug: document.slug,
			title: document.title,
			excerpt: document.excerpt,
			categoryName: category.name
		})
		.from(document)
		.innerJoin(category, eq(document.categoryId, category.id))
		.where(
			and(
				eq(document.published, true),
				or(ilike(document.title, q), ilike(document.content, q), ilike(document.excerpt, q))
			)
		)
		.orderBy(asc(document.title));
}

export async function listPublishedDocuments() {
	return db
		.select({
			id: document.id,
			slug: document.slug,
			title: document.title,
			excerpt: document.excerpt,
			categoryId: document.categoryId,
			categoryName: category.name,
			categorySlug: category.slug,
			categorySort: category.sortOrder
		})
		.from(document)
		.innerJoin(category, eq(document.categoryId, category.id))
		.where(eq(document.published, true))
		.orderBy(asc(category.sortOrder), asc(document.title));
}

export async function getDocumentById(id: string) {
	const [row] = await db.select().from(document).where(eq(document.id, id)).limit(1);
	if (!row) return null;
	const tags = await getTagsForDocument(id);
	return { ...row, tags };
}

export async function getDocumentBySlug(slug: string, options?: { includeUnpublished?: boolean }) {
	const conditions = [eq(document.slug, slug)];
	if (!options?.includeUnpublished) {
		conditions.push(eq(document.published, true));
	}
	const [row] = await db
		.select({
			id: document.id,
			slug: document.slug,
			title: document.title,
			content: document.content,
			excerpt: document.excerpt,
			published: document.published,
			updatedAt: document.updatedAt,
			categoryName: category.name,
			categorySlug: category.slug
		})
		.from(document)
		.innerJoin(category, eq(document.categoryId, category.id))
		.where(and(...conditions))
		.limit(1);
	if (!row) return null;
	const tags = await getTagsForDocument(row.id);
	return { ...row, tags };
}

async function getTagsForDocument(documentId: string) {
	return db
		.select({ id: tag.id, name: tag.name, slug: tag.slug })
		.from(documentTag)
		.innerJoin(tag, eq(documentTag.tagId, tag.id))
		.where(eq(documentTag.documentId, documentId));
}

async function syncDocumentTags(documentId: string, tagNames: string[]) {
	await db.delete(documentTag).where(eq(documentTag.documentId, documentId));

	const unique = [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];
	for (const name of unique) {
		const tagSlug = slugify(name);
		let [existing] = await db.select().from(tag).where(eq(tag.slug, tagSlug)).limit(1);
		if (!existing) {
			[existing] = await db.insert(tag).values({ name, slug: tagSlug }).returning();
		}
		await db.insert(documentTag).values({ documentId, tagId: existing.id });
	}
}

export async function createDocument(data: {
	title: string;
	slug?: string;
	content?: string;
	excerpt?: string;
	published: boolean;
	categoryId: string;
	tags?: string;
}) {
	const slug = data.slug?.trim() || slugify(data.title);
	const [row] = await db
		.insert(document)
		.values({
			title: data.title,
			slug,
			content: data.content ?? '',
			excerpt: data.excerpt || null,
			published: data.published,
			categoryId: data.categoryId
		})
		.returning();

	if (data.tags) {
		await syncDocumentTags(
			row.id,
			data.tags.split(',').map((t) => t.trim())
		);
	}

	return getDocumentById(row.id);
}

export async function updateDocument(
	id: string,
	data: {
		title: string;
		slug?: string;
		content: string;
		excerpt?: string;
		published: boolean;
		categoryId: string;
		tags?: string;
	}
) {
	const slug = data.slug?.trim() || slugify(data.title);
	await db
		.update(document)
		.set({
			title: data.title,
			slug,
			content: data.content,
			excerpt: data.excerpt || null,
			published: data.published,
			categoryId: data.categoryId
		})
		.where(eq(document.id, id));

	if (data.tags !== undefined) {
		await syncDocumentTags(
			id,
			data.tags.split(',').map((t) => t.trim())
		);
	}

	return getDocumentById(id);
}

export async function deleteDocument(id: string) {
	await db.delete(document).where(eq(document.id, id));
}

export async function deleteAllDrafts() {
	await db.delete(document).where(eq(document.published, false));
}

export async function getDocumentStats() {
	const [stats] = await db
		.select({
			total: sql<number>`count(*)::int`,
			published: sql<number>`count(*) filter (where ${document.published})::int`,
			drafts: sql<number>`count(*) filter (where not ${document.published})::int`
		})
		.from(document);

	return {
		total: stats?.total ?? 0,
		published: stats?.published ?? 0,
		drafts: stats?.drafts ?? 0
	};
}

export async function getRecentDocuments(limit = 5) {
	return db
		.select({
			id: document.id,
			title: document.title,
			slug: document.slug,
			published: document.published,
			updatedAt: document.updatedAt
		})
		.from(document)
		.orderBy(desc(document.updatedAt))
		.limit(limit);
}
