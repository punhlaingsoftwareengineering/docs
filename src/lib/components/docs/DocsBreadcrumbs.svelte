<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DocNavItem } from '$lib/types/docs-tree';

	let {
		categoryName,
		ancestors,
		currentTitle
	}: {
		categoryName: string;
		ancestors: DocNavItem[];
		currentTitle: string;
	} = $props();
</script>

<nav aria-label="Breadcrumb" class="breadcrumbs text-sm text-base-content/70">
	<ul>
		<li><a href={resolve('/docs')}>Docs</a></li>
		<li><span>{categoryName}</span></li>
		{#each ancestors as ancestor (ancestor.slug)}
			<li><a href={resolve(`/docs/${ancestor.slug}`)}>{ancestor.title}</a></li>
		{/each}
		<li class="text-base-content">{currentTitle}</li>
	</ul>
</nav>
