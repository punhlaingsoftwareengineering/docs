<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocTreeNode, SidebarGroup } from '$lib/types/docs-tree';

	let {
		groups,
		currentId,
		currentCategoryId,
		onnavigate
	}: {
		groups: SidebarGroup[];
		currentId?: string;
		currentCategoryId?: string;
		onnavigate?: () => void;
	} = $props();

	function isActive(id: string) {
		return currentId === id;
	}

	function isCategoryActive(id: string) {
		return currentCategoryId === id;
	}
</script>

{#snippet treeNodes(nodes: DocTreeNode[], depth = 0)}
	{#each nodes as node (node.id)}
		{#if node.children.length > 0}
			<li>
				<a
					href={resolve(`/docs/${node.id}`)}
					class="rounded-lg {isActive(node.id) ? 'menu-active font-medium' : ''}"
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
					href={resolve(`/docs/${node.id}`)}
					class="rounded-lg {isActive(node.id) ? 'menu-active font-medium' : ''}"
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
		{#each groups as group (group.id)}
			{#if group.items.length > 0}
				<li class="menu-title">
					<a
						href={resolve(`/docs/category/${group.id}`)}
						class="rounded-lg {isCategoryActive(group.id) ? 'font-semibold text-primary' : ''}"
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
