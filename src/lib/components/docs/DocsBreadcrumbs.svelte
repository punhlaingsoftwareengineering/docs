<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocNavItem } from '$lib/types/docs-tree';

	let {
		categoryName,
		categorySlug,
		ancestors,
		currentTitle
	}: {
		categoryName: string;
		categorySlug?: string;
		ancestors: DocNavItem[];
		currentTitle: string;
	} = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumbs text-sm text-base-content/70">
	<ul>
		<li><a href={resolve('/docs')}>Docs</a></li>
		{#if categorySlug}
			<li><a href={resolve(`/docs/category/${categorySlug}`)}>{categoryName}</a></li>
		{:else}
			<li><span>{categoryName}</span></li>
		{/if}
		{#each ancestors as ancestor (ancestor.slug)}
			<li><a href={resolve(`/docs/${ancestor.slug}`)}>{ancestor.title}</a></li>
		{/each}
		<li class="text-base-content">{currentTitle}</li>
	</ul>
</nav>
