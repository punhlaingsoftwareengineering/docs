<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { openDocsSearch } from '$lib/state/docs-search.svelte';

	let {
		class: className = '',
		compact = false
	}: {
		class?: string;
		compact?: boolean;
	} = $props();
</script>

<button
	type="button"
	class="btn btn-ghost gap-2 {className}"
	class:btn-sm={compact}
	aria-label="Search documentation"
	onclick={() => openDocsSearch()}
>
	<Search class="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
	{#if !compact}
		<span class="hidden text-sm text-base-content/60 sm:inline">Search</span>
	{/if}
	<span class="hidden items-center gap-1 sm:inline-flex">
		<kbd class="kbd">ctrl</kbd>
		<span class="text-base-content/50">+</span>
		<kbd class="kbd">k</kbd>
	</span>
</button>
