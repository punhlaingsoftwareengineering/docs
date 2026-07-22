<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { DocNavItem } from '$lib/types/docs-tree';

	let {
		prev,
		next
	}: {
		prev: DocNavItem | null;
		next: DocNavItem | null;
	} = $props();
</script>

{#if prev || next}
	<nav
		aria-label="Document pagination"
		class="mt-12 grid gap-4 border-t border-base-200 pt-8 sm:grid-cols-2"
	>
		{#if prev}
			<a
				href={resolve(`/docs/${prev.id}`)}
				class="rounded-box border border-base-200 p-4 transition-colors hover:border-primary/40 hover:bg-base-200/40"
			>
				<span class="block text-xs text-base-content/60">Previous</span>
				<span class="mt-1 flex items-center gap-1.5 font-medium">
					<ChevronLeft class="h-4 w-4 shrink-0" aria-hidden="true" />
					{prev.title}
				</span>
			</a>
		{:else}
			<div></div>
		{/if}
		{#if next}
			<a
				href={resolve(`/docs/${next.id}`)}
				class="rounded-box border border-base-200 p-4 text-right transition-colors hover:border-primary/40 hover:bg-base-200/40 sm:col-start-2"
			>
				<span class="block text-xs text-base-content/60">Next</span>
				<span class="mt-1 flex items-center justify-end gap-1.5 font-medium">
					{next.title}
					<ChevronRight class="h-4 w-4 shrink-0" aria-hidden="true" />
				</span>
			</a>
		{/if}
	</nav>
{/if}
