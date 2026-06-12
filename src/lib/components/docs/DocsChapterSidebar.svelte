<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocTreeNode, SidebarGroup } from '$lib/types/docs-tree';

	let {
		groups,
		currentSlug,
		onnavigate
	}: { groups: SidebarGroup[]; currentSlug?: string; onnavigate?: () => void } = $props();

	function isActive(slug: string) {
		return currentSlug === slug;
	}
</script>

{#snippet treeNodes(nodes: DocTreeNode[])}
	{#each nodes as node (node.slug)}
		{#if node.children.length > 0}
			<li>
				<a
					href={resolve(`/docs/${node.slug}`)}
					class:menu-active={isActive(node.slug)}
					onclick={() => onnavigate?.()}
				>
					{node.title}
				</a>
				<ul>
					{@render treeNodes(node.children)}
				</ul>
			</li>
		{:else}
			<li>
				<a
					href={resolve(`/docs/${node.slug}`)}
					class:menu-active={isActive(node.slug)}
					onclick={() => onnavigate?.()}
				>
					{node.title}
				</a>
			</li>
		{/if}
	{/each}
{/snippet}

<nav aria-label="Documentation chapters" class="pt-4">
	<ul class="menu menu-sm w-full">
		{#each groups as group (group.slug)}
			{#if group.items.length > 0}
				<li class="menu-title">{group.name}</li>
				{@render treeNodes(group.items)}
			{/if}
		{/each}
	</ul>
</nav>
