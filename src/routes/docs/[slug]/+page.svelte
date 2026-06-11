<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.doc.title} — Documentation</title>
</svelte:head>

{#if data.isPreview}
	<div class="alert alert-warning mb-6">
		<span>Draft preview — this page is not visible to visitors.</span>
	</div>
{/if}

<article>
	<header class="mb-8 border-b border-base-300 pb-6">
		<p class="text-sm text-base-content/60">{data.doc.categoryName}</p>
		<h1 class="mt-1 text-3xl font-bold">{data.doc.title}</h1>
		{#if data.doc.tags.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each data.doc.tags as tag (tag.id)}
					<span class="badge badge-outline badge-sm">{tag.name}</span>
				{/each}
			</div>
		{/if}
	</header>
	<div class="prose max-w-none">{@html data.html}</div>
</article>
