<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { closeDocsSearch, docsSearch } from '$lib/state/docs-search.svelte';
	import { highlightSearchText } from '$lib/utils/search-highlight';

	type SearchResult = {
		id: string;
		slug: string;
		title: string;
		excerpt: string | null;
		categoryName: string;
	};

	let dialog = $state<HTMLDialogElement | null>(null);
	let query = $state('');
	let results = $state<SearchResult[]>([]);
	let loading = $state(false);
	let activeIndex = $state(0);
	let fetchId = 0;

	const open = $derived(docsSearch.open);

	$effect(() => {
		if (!dialog) return;

		if (open) {
			query = '';
			results = [];
			activeIndex = 0;
			dialog.showModal();
			fetchResults('');
			queueMicrotask(() => dialog?.querySelector<HTMLInputElement>('input[type="search"]')?.focus());
		} else if (dialog.open) {
			dialog.close();
		}
	});

	async function fetchResults(q: string) {
		const id = ++fetchId;
		loading = true;
		try {
			const params = new URLSearchParams();
			if (q.trim()) params.set('q', q.trim());
			const res = await fetch(`/api/search?${params}`);
			const data = (await res.json()) as { results: SearchResult[] };
			if (id !== fetchId) return;
			results = data.results;
			activeIndex = 0;
		} finally {
			if (id === fetchId) loading = false;
		}
	}

	function onQueryInput(value: string) {
		query = value;
		fetchResults(value);
	}

	function navigateTo(result: SearchResult) {
		closeDocsSearch();
		goto(resolve(`/docs/${result.slug}`));
	}

	function onDialogKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (results.length > 0) activeIndex = (activeIndex + 1) % results.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (results.length > 0) activeIndex = (activeIndex - 1 + results.length) % results.length;
		} else if (e.key === 'Enter' && results[activeIndex]) {
			e.preventDefault();
			navigateTo(results[activeIndex]);
		}
	}

	function onWindowKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			if (docsSearch.open) closeDocsSearch();
			else docsSearch.open = true;
		}
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

<dialog
	bind:this={dialog}
	class="modal"
	onclose={closeDocsSearch}
	onkeydown={onDialogKeydown}
	aria-label="Search documentation"
>
	<div class="modal-box max-w-xl p-0">
		<div class="flex items-center gap-3 border-b border-base-300 px-4 py-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 shrink-0 text-base-content/50"
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
			<input
				type="search"
				class="grow bg-transparent text-base outline-none"
				placeholder="Search documentation…"
				value={query}
				oninput={(e) => onQueryInput(e.currentTarget.value)}
			/>
			<kbd class="kbd kbd-sm hidden sm:inline-flex">esc</kbd>
		</div>

		<div class="max-h-80 overflow-y-auto p-2">
			{#if loading}
				<p class="px-3 py-6 text-center text-sm text-base-content/50">Searching…</p>
			{:else if results.length === 0}
				<p class="px-3 py-6 text-center text-sm text-base-content/50">
					{query.trim() ? 'No results found.' : 'Type to search published docs.'}
				</p>
			{:else}
				<ul class="flex w-full flex-col gap-1">
					{#each results as result, i (result.id)}
						<li class="w-full">
							<button
								type="button"
								class="flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-colors"
								class:bg-base-200={i === activeIndex}
								onclick={() => navigateTo(result)}
								onmouseenter={() => (activeIndex = i)}
							>
								<span class="w-full font-medium">{@html highlightSearchText(result.title, query)}</span>
								<span class="text-xs text-base-content/50">{result.categoryName}</span>
								{#if result.excerpt}
									<span class="line-clamp-2 w-full text-xs text-base-content/60">
										{@html highlightSearchText(result.excerpt, query)}
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="flex items-center justify-between border-t border-base-300 px-4 py-2 text-xs text-base-content/50">
			<span><kbd class="kbd kbd-xs">↑</kbd> <kbd class="kbd kbd-xs">↓</kbd> navigate</span>
			<span><kbd class="kbd kbd-xs">↵</kbd> open</span>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button type="submit" aria-label="Close search">close</button>
	</form>
</dialog>
