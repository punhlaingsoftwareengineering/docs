<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Documentation</title>
</svelte:head>

<h1 class="text-3xl font-bold">Documentation</h1>
<p class="mt-2 text-base-content/70">Browse guides, reference, and examples.</p>

<form method="GET" class="mt-6 flex gap-2">
	<input
		type="search"
		name="q"
		value={data.q}
		placeholder="Search documentation…"
		class="input input-bordered flex-1"
	/>
	<button type="submit" class="btn btn-primary">Search</button>
</form>

<div class="mt-8 space-y-4">
	{#if data.results.length === 0}
		<p class="text-base-content/60">No documents found.</p>
	{:else}
		{#each data.results as doc (doc.id)}
			<article class="rounded-box border border-base-300 p-4 transition-colors hover:border-primary">
				<a href={resolve(`/docs/${doc.slug}`)} class="text-lg font-semibold link link-hover">
					{doc.title}
				</a>
				{#if doc.excerpt}
					<p class="mt-1 text-sm text-base-content/70">{doc.excerpt}</p>
				{/if}
				<p class="mt-2 text-xs text-base-content/50">{doc.categoryName}</p>
			</article>
		{/each}
	{/if}
</div>
