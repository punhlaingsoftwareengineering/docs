<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocNavItem } from '$lib/types/docs-tree';

	let {
		categoryName,
		categoryId,
		ancestors,
		currentTitle
	}: {
		categoryName: string;
		categoryId?: string;
		ancestors: DocNavItem[];
		currentTitle: string;
	} = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumbs text-sm">
	<ul>
		<li><a href={resolve('/docs')}>Docs</a></li>
		{#if categoryId}
			<li><a href={resolve(`/docs/category/${categoryId}`)}>{categoryName}</a></li>
		{:else}
			<li><span>{categoryName}</span></li>
		{/if}
		{#each ancestors as ancestor (ancestor.id)}
			<li><a href={resolve(`/docs/${ancestor.id}`)}>{ancestor.title}</a></li>
		{/each}
		<li><span class="font-medium">{currentTitle}</span></li>
	</ul>
</nav>
