<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocTreeNode, SidebarGroup } from '$lib/types/docs-tree';

	let {
		groups,
		currentSlug,
		currentCategorySlug,
		onnavigate
	}: {
		groups: SidebarGroup[];
		currentSlug?: string;
		currentCategorySlug?: string;
		onnavigate?: () => void;
	} = $props();

	function isActive(slug: string) {
		return currentSlug === slug;
	}

	function isCategoryActive(slug: string) {
		return currentCategorySlug === slug;
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
				<li class="menu-title">
					<a
						href={resolve(`/docs/category/${group.slug}`)}
						class:font-semibold={isCategoryActive(group.slug)}
						class:text-primary={isCategoryActive(group.slug)}
						onclick={() => onnavigate?.()}
					>
						{group.name}
					</a>
				</li>
				{@render treeNodes(group.items)}
			{/if}
		{/each}
	</ul>
</nav>
