<script lang="ts">
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
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-4 w-4 shrink-0 opacity-70"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
		/>
	</svg>
	{#if !compact}
		<span class="hidden text-sm text-base-content/60 sm:inline">Search</span>
	{/if}
	<kbd class="kbd kbd-xs hidden sm:inline-flex">⌘K</kbd>
</button>
