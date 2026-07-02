import type { AdminDocumentOrderRow } from '$lib/types/docs-tree';

type OrderableDocument = {
	id: string;
	slug: string;
	title: string;
	parentDocumentId: string | null;
	sortOrder: number;
	categoryId: string;
	published: boolean;
};

export function computeDepthMap(
	docs: { id: string; parentDocumentId: string | null }[]
): Map<string, number> {
	const byId = new Map(docs.map((doc) => [doc.id, doc]));
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

export function flattenCategoryDocumentsForOrder(
	docs: OrderableDocument[]
): AdminDocumentOrderRow[] {
	const depthMap = computeDepthMap(docs);
	const childrenByParent = new Map<string | null, OrderableDocument[]>();

	for (const doc of docs) {
		const siblings = childrenByParent.get(doc.parentDocumentId) ?? [];
		siblings.push(doc);
		childrenByParent.set(doc.parentDocumentId, siblings);
	}

	for (const siblings of childrenByParent.values()) {
		siblings.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
	}

	const result: AdminDocumentOrderRow[] = [];
	function walk(parentId: string | null) {
		for (const doc of childrenByParent.get(parentId) ?? []) {
			result.push({
				id: doc.id,
				title: doc.title,
				slug: doc.slug,
				categoryId: doc.categoryId,
				parentDocumentId: doc.parentDocumentId,
				depth: depthMap.get(doc.id) ?? 1,
				published: doc.published,
				sortOrder: doc.sortOrder
			});
			walk(doc.id);
		}
	}
	walk(null);
	return result;
}

export function siblingKey(item: { categoryId: string; parentDocumentId: string | null }) {
	return `${item.categoryId}:${item.parentDocumentId ?? ''}`;
}

export function reorderSiblings(
	items: AdminDocumentOrderRow[],
	draggedId: string,
	targetId: string
): { items: AdminDocumentOrderRow[]; orderedIds: string[] } | null {
	const dragged = items.find((item) => item.id === draggedId);
	const target = items.find((item) => item.id === targetId);
	if (!dragged || !target || siblingKey(dragged) !== siblingKey(target)) {
		return null;
	}

	const siblings = items
		.filter((item) => siblingKey(item) === siblingKey(dragged))
		.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

	const fromIdx = siblings.findIndex((item) => item.id === draggedId);
	const toIdx = siblings.findIndex((item) => item.id === targetId);
	if (fromIdx === -1 || toIdx === -1) return null;

	const reordered = [...siblings];
	const [moved] = reordered.splice(fromIdx, 1);
	reordered.splice(toIdx, 0, moved);

	const sortById = new Map(reordered.map((item, index) => [item.id, index]));
	const updated = items.map((item) =>
		sortById.has(item.id) ? { ...item, sortOrder: sortById.get(item.id)! } : item
	);

	return {
		items: flattenCategoryDocumentsForOrder(updated),
		orderedIds: reordered.map((item) => item.id)
	};
}
