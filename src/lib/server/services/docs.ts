import { and, asc, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { category, document, documentTag, tag } from '$lib/server/db/schema';
import type { DocNavItem, DocTreeNode, ParentOption, SidebarGroup } from '$lib/types/docs-tree';
import { slugify } from '$lib/utils/slug';

export const MAX_DOCUMENT_DEPTH = 3;

export type DocumentListFilter = 'all' | 'draft' | 'published';

export type DocumentTreeRow = {
	id: string;
	slug: string;
	title: string;
	parentDocumentId: string | null;
	sortOrder: number;
	categoryId: string;
	categoryName: string;
	categorySlug: string;
	categorySort: number;
};

const documentListSelect = {
	id: document.id,
	slug: document.slug,
	title: document.title,
	excerpt: document.excerpt,
	published: document.published,
	updatedAt: document.updatedAt,
	parentDocumentId: document.parentDocumentId,
	sortOrder: document.sortOrder,
	categoryName: category.name,
	categorySlug: category.slug
};

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
		.select(documentListSelect)
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
			categoryName: category.name,
			parentDocumentId: document.parentDocumentId
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
	return listDocumentsForTree({ includeUnpublished: false });
}

export async function listDocumentsForTree(options?: {
	categoryId?: string;
	includeUnpublished?: boolean;
}) {
	const conditions = [];
	if (options?.categoryId) conditions.push(eq(document.categoryId, options.categoryId));
	if (!options?.includeUnpublished) conditions.push(eq(document.published, true));

	return db
		.select({
			id: document.id,
			slug: document.slug,
			title: document.title,
			excerpt: document.excerpt,
			categoryId: document.categoryId,
			parentDocumentId: document.parentDocumentId,
			sortOrder: document.sortOrder,
			categoryName: category.name,
			categorySlug: category.slug,
			categorySort: category.sortOrder
		})
		.from(document)
		.innerJoin(category, eq(document.categoryId, category.id))
		.where(conditions.length ? and(...conditions) : undefined)
		.orderBy(asc(category.sortOrder), asc(document.sortOrder), asc(document.title));
}

export function computeDepthMap(
	docs: { id: string; parentDocumentId: string | null }[]
): Map<string, number> {
	const byId = new Map(docs.map((d) => [d.id, d]));
	const cache = new Map<string, number>();

	function depthOf(id: string): number {
		const cached = cache.get(id);
		if (cached !== undefined) return cached;
		const doc = byId.get(id);
		if (!doc) return 1;
		const depth = doc.parentDocumentId ? depthOf(doc.parentDocumentId) + 1 : 1;
		cache.set(id, depth);
		return depth;
	}

	for (const doc of docs) depthOf(doc.id);
	return cache;
}

export function getDescendantIds(
	docs: { id: string; parentDocumentId: string | null }[],
	rootId: string
): Set<string> {
	const childrenByParent = new Map<string, string[]>();
	for (const doc of docs) {
		if (!doc.parentDocumentId) continue;
		const siblings = childrenByParent.get(doc.parentDocumentId) ?? [];
		siblings.push(doc.id);
		childrenByParent.set(doc.parentDocumentId, siblings);
	}

	const descendants = new Set<string>();
	const stack = [...(childrenByParent.get(rootId) ?? [])];
	while (stack.length > 0) {
		const id = stack.pop()!;
		descendants.add(id);
		stack.push(...(childrenByParent.get(id) ?? []));
	}
	return descendants;
}

export function computeSubtreeMaxDepth(
	docs: { id: string; parentDocumentId: string | null }[],
	rootId: string
): number {
	const depthMap = computeDepthMap(docs);
	const rootDepth = depthMap.get(rootId) ?? 1;
	let max = rootDepth;
	const descendants = getDescendantIds(docs, rootId);
	for (const id of descendants) {
		const d = depthMap.get(id) ?? rootDepth;
		if (d > max) max = d;
	}
	return max - rootDepth + 1;
}

export function buildDocumentTree(
	docs: Pick<DocumentTreeRow, 'id' | 'slug' | 'title' | 'parentDocumentId' | 'sortOrder'>[]
): DocTreeNode[] {
	const childrenByParent = new Map<string, typeof docs>();

	for (const doc of docs) {
		if (!doc.parentDocumentId) continue;
		const siblings = childrenByParent.get(doc.parentDocumentId) ?? [];
		siblings.push(doc);
		childrenByParent.set(doc.parentDocumentId, siblings);
	}

	for (const siblings of childrenByParent.values()) {
		siblings.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
	}

	function toNode(doc: (typeof docs)[0], depth: number): DocTreeNode {
		const children =
			depth >= MAX_DOCUMENT_DEPTH
				? []
				: (childrenByParent.get(doc.id) ?? []).map((child) => toNode(child, depth + 1));
		return { slug: doc.slug, title: doc.title, children };
	}

	const roots = docs.filter((doc) => !doc.parentDocumentId);
	roots.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
	return roots.map((root) => toNode(root, 1));
}

export function buildSidebarGroups(docs: DocumentTreeRow[]): SidebarGroup[] {
	const groupMap = new Map<string, SidebarGroup>();

	for (const doc of docs) {
		if (!groupMap.has(doc.categorySlug)) {
			groupMap.set(doc.categorySlug, {
				name: doc.categoryName,
				slug: doc.categorySlug,
				items: []
			});
		}
	}

	const byCategory = new Map<string, DocumentTreeRow[]>();
	for (const doc of docs) {
		const rows = byCategory.get(doc.categorySlug) ?? [];
		rows.push(doc);
		byCategory.set(doc.categorySlug, rows);
	}

	for (const [categorySlug, rows] of byCategory) {
		groupMap.get(categorySlug)!.items = buildDocumentTree(rows);
	}

	return [...groupMap.values()].sort((a, b) => {
		const aSort = docs.find((d) => d.categorySlug === a.slug)?.categorySort ?? 0;
		const bSort = docs.find((d) => d.categorySlug === b.slug)?.categorySort ?? 0;
		return aSort - bSort || a.name.localeCompare(b.name);
	});
}

export function flattenSidebarGroups(groups: SidebarGroup[]): DocNavItem[] {
	const items: DocNavItem[] = [];
	function walk(nodes: DocTreeNode[]) {
		for (const node of nodes) {
			items.push({ slug: node.slug, title: node.title });
			walk(node.children);
		}
	}
	for (const group of groups) walk(group.items);
	return items;
}

export async function getFirstPublishedDocument() {
	const docs = await listPublishedDocuments();
	return docs[0] ?? null;
}

export async function getDocumentAncestors(slug: string, options?: { includeUnpublished?: boolean }) {
	const doc = await getDocumentBySlug(slug, { includeUnpublished: options?.includeUnpublished });
	if (!doc) return [];

	const ancestors: DocNavItem[] = [];
	let parentId = doc.parentDocumentId;

	while (parentId) {
		const parent = await getDocumentById(parentId);
		if (!parent) break;
		ancestors.unshift({ slug: parent.slug, title: parent.title });
		parentId = parent.parentDocumentId;
	}

	return ancestors;
}

export async function getAdjacentDocuments(slug: string) {
	const docs = await listPublishedDocuments();
	const groups = buildSidebarGroups(docs);
	const flat = flattenSidebarGroups(groups);
	const index = flat.findIndex((item) => item.slug === slug);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: index > 0 ? flat[index - 1] : null,
		next: index < flat.length - 1 ? flat[index + 1] : null
	};
}

export async function listEligibleParents(options: {
	categoryId: string;
	excludeId?: string;
	includeUnpublished?: boolean;
}): Promise<ParentOption[]> {
	const docs = await listDocumentsForTree({
		categoryId: options.categoryId,
		includeUnpublished: options.includeUnpublished ?? true
	});
	const depthMap = computeDepthMap(docs);
	const excluded = options.excludeId
		? new Set([options.excludeId, ...getDescendantIds(docs, options.excludeId)])
		: new Set<string>();

	return docs
		.filter((doc) => !excluded.has(doc.id) && (depthMap.get(doc.id) ?? 1) < MAX_DOCUMENT_DEPTH)
		.sort((a, b) => {
			const depthA = depthMap.get(a.id) ?? 1;
			const depthB = depthMap.get(b.id) ?? 1;
			return depthA - depthB || a.sortOrder - b.sortOrder || a.title.localeCompare(b.title);
		})
		.map((doc) => {
			const depth = depthMap.get(doc.id) ?? 1;
			const indent = depth > 1 ? `${'  '.repeat(depth - 1)}↳ ` : '';
			return {
				id: doc.id,
				title: doc.title,
				depth,
				label: `${indent}${doc.title}`
			};
		});
}

export async function validateDocumentHierarchy(options: {
	documentId?: string;
	parentDocumentId: string | null;
	categoryId: string;
}): Promise<{ valid: true } | { valid: false; message: string }> {
	if (!options.parentDocumentId) return { valid: true };

	if (options.documentId && options.parentDocumentId === options.documentId) {
		return { valid: false, message: 'A page cannot be its own parent.' };
	}

	const parent = await getDocumentById(options.parentDocumentId);
	if (!parent) return { valid: false, message: 'Parent page not found.' };
	if (parent.categoryId !== options.categoryId) {
		return { valid: false, message: 'Parent must be in the same category.' };
	}

	const allDocs = await listDocumentsForTree({ includeUnpublished: true });
	const depthMap = computeDepthMap(allDocs);
	const parentDepth = depthMap.get(options.parentDocumentId) ?? 1;

	if (parentDepth >= MAX_DOCUMENT_DEPTH) {
		return { valid: false, message: `Maximum nesting depth is ${MAX_DOCUMENT_DEPTH} levels.` };
	}

	if (options.documentId) {
		const descendants = getDescendantIds(allDocs, options.documentId);
		if (descendants.has(options.parentDocumentId)) {
			return { valid: false, message: 'A page cannot be nested under its own descendant.' };
		}

		const subtreeDepth = computeSubtreeMaxDepth(allDocs, options.documentId);
		const newRootDepth = parentDepth + 1;
		if (newRootDepth + subtreeDepth - 1 > MAX_DOCUMENT_DEPTH) {
			return {
				valid: false,
				message: `Moving this page would exceed the maximum depth of ${MAX_DOCUMENT_DEPTH} levels.`
			};
		}
	}

	return { valid: true };
}

export async function getDocumentDepth(id: string): Promise<number> {
	const allDocs = await listDocumentsForTree({ includeUnpublished: true });
	return computeDepthMap(allDocs).get(id) ?? 1;
}

export async function listParentDocuments(options?: { categoryId?: string; includeUnpublished?: boolean }) {
	const conditions = [isNull(document.parentDocumentId)];
	if (options?.categoryId) conditions.push(eq(document.categoryId, options.categoryId));
	if (!options?.includeUnpublished) conditions.push(eq(document.published, true));

	return db
		.select({
			id: document.id,
			slug: document.slug,
			title: document.title,
			categoryId: document.categoryId,
			categoryName: category.name
		})
		.from(document)
		.innerJoin(category, eq(document.categoryId, category.id))
		.where(and(...conditions))
		.orderBy(asc(document.sortOrder), asc(document.title));
}

export async function listChildDocuments(
	parentId: string,
	options?: { includeUnpublished?: boolean }
) {
	const conditions = [eq(document.parentDocumentId, parentId)];
	if (!options?.includeUnpublished) conditions.push(eq(document.published, true));

	return db
		.select({
			id: document.id,
			slug: document.slug,
			title: document.title,
			excerpt: document.excerpt,
			sortOrder: document.sortOrder,
			published: document.published
		})
		.from(document)
		.where(and(...conditions))
		.orderBy(asc(document.sortOrder), asc(document.title));
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
			parentDocumentId: document.parentDocumentId,
			sortOrder: document.sortOrder,
			categoryId: document.categoryId,
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

type DocumentWriteData = {
	title: string;
	slug?: string;
	content?: string;
	excerpt?: string;
	published: boolean;
	categoryId: string;
	parentDocumentId?: string | null;
	sortOrder?: number;
	tags?: string;
};

export async function createDocument(data: DocumentWriteData) {
	const hierarchy = await validateDocumentHierarchy({
		parentDocumentId: data.parentDocumentId ?? null,
		categoryId: data.categoryId
	});
	if (!hierarchy.valid) throw new Error(hierarchy.message);

	const slug = data.slug?.trim() || slugify(data.title);
	const [row] = await db
		.insert(document)
		.values({
			title: data.title,
			slug,
			content: data.content ?? '',
			excerpt: data.excerpt || null,
			published: data.published,
			categoryId: data.categoryId,
			parentDocumentId: data.parentDocumentId ?? null,
			sortOrder: data.sortOrder ?? 0
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

export async function updateDocument(id: string, data: DocumentWriteData & { content: string }) {
	const hierarchy = await validateDocumentHierarchy({
		documentId: id,
		parentDocumentId: data.parentDocumentId ?? null,
		categoryId: data.categoryId
	});
	if (!hierarchy.valid) throw new Error(hierarchy.message);

	const slug = data.slug?.trim() || slugify(data.title);
	await db
		.update(document)
		.set({
			title: data.title,
			slug,
			content: data.content,
			excerpt: data.excerpt || null,
			published: data.published,
			categoryId: data.categoryId,
			parentDocumentId: data.parentDocumentId ?? null,
			sortOrder: data.sortOrder ?? 0
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
