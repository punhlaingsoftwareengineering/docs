<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { GripVertical, Pencil, Trash2 } from '@lucide/svelte';
	import type { DocumentOrderGroup } from '$lib/types/docs-tree';
	import { reorderSiblings, siblingKey } from '$lib/utils/document-order';

	let {
		groups: initialGroups
	}: {
		groups: DocumentOrderGroup[];
	} = $props();

	let groups = $state<DocumentOrderGroup[]>([]);
	let draggedId = $state<string | null>(null);
	let dropTargetId = $state<string | null>(null);
	let saving = $state(false);
	let errorMessage = $state<string | null>(null);

	$effect(() => {
		groups = structuredClone(initialGroups);
	});

	function canDropOn(targetId: string) {
		if (!draggedId || draggedId === targetId) return false;
		const dragged = findItem(draggedId);
		const target = findItem(targetId);
		if (!dragged || !target) return false;
		return siblingKey(dragged) === siblingKey(target);
	}

	function findItem(id: string) {
		for (const group of groups) {
			const item = group.items.find((row) => row.id === id);
			if (item) return item;
		}
		return null;
	}

	function findGroupIndex(categoryId: string) {
		return groups.findIndex((group) => group.categoryId === categoryId);
	}

	async function persistReorder(
		categoryId: string,
		parentDocumentId: string | null,
		orderedIds: string[]
	) {
		saving = true;
		errorMessage = null;

		const response = await fetch(resolve('/admin/api/documents/reorder'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ categoryId, parentDocumentId, orderedIds })
		});

		saving = false;

		if (!response.ok) {
			const payload = (await response.json().catch(() => null)) as { message?: string } | null;
			errorMessage = payload?.message ?? 'Could not save document order.';
			groups = structuredClone(initialGroups);
			return;
		}

		await invalidateAll();
	}

	async function handleDrop(categoryId: string, targetId: string) {
		if (!draggedId) return;

		const activeDragId = draggedId;
		const dragged = findItem(activeDragId);
		const parentDocumentId = dragged?.parentDocumentId ?? null;

		const groupIndex = findGroupIndex(categoryId);
		if (groupIndex === -1) return;

		const group = groups[groupIndex];
		const result = reorderSiblings(group.items, activeDragId, targetId);
		draggedId = null;
		dropTargetId = null;

		if (!result) {
			errorMessage = 'You can only reorder among pages with the same parent in this category.';
			return;
		}

		groups = groups.map((entry, index) =>
			index === groupIndex ? { ...entry, items: result.items } : entry
		);

		await persistReorder(categoryId, parentDocumentId, result.orderedIds);
	}

	async function deleteDocument(id: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;

		saving = true;
		errorMessage = null;

		const response = await fetch(resolve(`/admin/api/documents/${id}`), { method: 'DELETE' });
		saving = false;

		if (!response.ok) {
			errorMessage = 'Could not delete document.';
			return;
		}

		await invalidateAll();
	}
</script>

{#if errorMessage}
	<div class="alert alert-error" role="alert">
		<span>{errorMessage}</span>
	</div>
{/if}

<div class="space-y-6">
	{#each groups as group (group.categoryId)}
		<section class="w-full min-w-0 space-y-2">
			<div class="flex items-center justify-between gap-3">
				<h3 class="font-semibold">{group.categoryName}</h3>
				{#if saving}
					<span class="text-sm text-base-content/60">Saving…</span>
				{/if}
			</div>

			{#if group.items.length === 0}
				<div
					class="rounded-box border border-dashed border-base-300 px-4 py-6 text-center text-sm text-base-content/60"
				>
					No documents in this category.
				</div>
			{:else}
				<div class="overflow-hidden rounded-box border border-base-300">
					{#each group.items as item (item.id)}
						<div
							role="listitem"
							class={[
								'flex items-center gap-2 border-b border-base-300 px-3 py-2 last:border-b-0',
								dropTargetId === item.id && canDropOn(item.id) && 'bg-primary/10',
								draggedId === item.id && 'opacity-50'
							]
								.filter(Boolean)
								.join(' ')}
							ondragover={(event) => {
								if (!canDropOn(item.id)) return;
								event.preventDefault();
								dropTargetId = item.id;
							}}
							ondragleave={() => {
								if (dropTargetId === item.id) dropTargetId = null;
							}}
							ondrop={(event) => {
								event.preventDefault();
								void handleDrop(group.categoryId, item.id);
							}}
							style:padding-left={`${0.75 + (item.depth - 1) * 1.25}rem`}
						>
							<button
								type="button"
								class="btn btn-ghost btn-sm btn-square shrink-0 cursor-grab active:cursor-grabbing"
								aria-label="Drag to reorder {item.title}"
								draggable={true}
								disabled={saving}
								ondragstart={() => {
									draggedId = item.id;
									errorMessage = null;
								}}
								ondragend={() => {
									draggedId = null;
									dropTargetId = null;
								}}
							>
								<GripVertical class="h-4 w-4" aria-hidden="true" />
							</button>

							<div class="min-w-0 flex-1">
								<p class="truncate font-medium">{item.title}</p>
								<p class="truncate font-mono text-xs text-base-content/60">{item.slug}</p>
							</div>

							{#if item.published}
								<span class="badge badge-success badge-sm shrink-0">Published</span>
							{:else}
								<span class="badge badge-warning badge-sm shrink-0">Draft</span>
							{/if}

							<a
								href={resolve(`/admin/documents/${item.id}`)}
								class="btn btn-secondary btn-sm btn-square shrink-0"
								aria-label="Edit {item.title}"
							>
								<Pencil class="h-4 w-4" aria-hidden="true" />
							</a>

							<button
								type="button"
								class="btn btn-error btn-sm btn-square shrink-0"
								aria-label="Delete {item.title}"
								disabled={saving}
								onclick={() => deleteDocument(item.id, item.title)}
							>
								<Trash2 class="h-4 w-4" aria-hidden="true" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	{/each}
</div>
