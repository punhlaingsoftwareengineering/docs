<script lang="ts">
	import { resolve } from '$app/paths';
	import type { CategoryListingItem } from '$lib/types/docs-tree';

	let { items }: { items: CategoryListingItem[] } = $props();
</script>

{#snippet sectionTree(nodes: CategoryListingItem[], nested = false)}
	<ul
		class="menu menu-sm rounded-box border border-base-300 bg-base-100"
		class:ml-4={nested}
		class:mt-2={nested}
		class:border-l-2={nested}
		class:border-t-0={nested}
		class:rounded-l-none={nested}
	>
		{#each nodes as node (node.slug)}
			<li>
				<a href={resolve(`/docs/${node.slug}`)}>
					<span class="font-medium">{node.title}</span>
					{#if node.excerpt}
						<span class="text-xs text-base-content/60">{node.excerpt}</span>
					{/if}
				</a>
				{#if node.children.length > 0}
					{@render sectionTree(node.children, true)}
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{@render sectionTree(items)}
