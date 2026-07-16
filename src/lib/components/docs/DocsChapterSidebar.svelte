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

{#snippet treeNodes(nodes: DocTreeNode[], depth = 0)}
	{#each nodes as node (node.slug)}
		{#if node.children.length > 0}
			<li>
				<a
					href={resolve(`/docs/${node.slug}`)}
					class="rounded-lg {isActive(node.slug) ? 'menu-active font-medium' : ''}"
					style="padding-left: {0.75 + depth * 0.75}rem"
					onclick={() => onnavigate?.()}
				>
					{node.title}
				</a>
				<ul>
					{@render treeNodes(node.children, depth + 1)}
				</ul>
			</li>
		{:else}
			<li>
				<a
					href={resolve(`/docs/${node.slug}`)}
					class="rounded-lg {isActive(node.slug) ? 'menu-active font-medium' : ''}"
					style="padding-left: {0.75 + depth * 0.75}rem"
					onclick={() => onnavigate?.()}
				>
					{node.title}
				</a>
			</li>
		{/if}
	{/each}
{/snippet}

<nav aria-label="Documentation chapters">
	<ul class="menu menu-md w-full gap-0.5 px-2">
		{#each groups as group (group.slug)}
			{#if group.items.length > 0}
				<li class="menu-title">
					<a
						href={resolve(`/docs/category/${group.slug}`)}
						class="rounded-lg {isCategoryActive(group.slug) ? 'font-semibold text-primary' : ''}"
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
