<script lang="ts">
	import { resolve } from '$app/paths';
	import type { CategoryListingItem } from '$lib/types/docs-tree';

	let { items }: { items: CategoryListingItem[] } = $props();
</script>

{#snippet sectionTree(nodes: CategoryListingItem[])}
	<div class="grid gap-3">
		{#each nodes as node (node.slug)}
			<a
				href={resolve(`/docs/${node.slug}`)}
				class="card flex flex-col rounded-box border border-base-200 bg-base-200/40 p-4 transition-colors hover:border-primary/30"
			>
				<span class="font-medium text-base-content">{node.title}</span>
				{#if node.excerpt}
					<span class="mt-1 text-sm text-base-content/70">{node.excerpt}</span>
				{/if}
			</a>
			{#if node.children.length > 0}
				<div class="ml-4 border-l-2 border-base-200 pl-4">
					{@render sectionTree(node.children)}
				</div>
			{/if}
		{/each}
	</div>
{/snippet}

{@render sectionTree(items)}
