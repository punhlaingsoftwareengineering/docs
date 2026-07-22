<script lang="ts">
	import { ArrowDown, ArrowUp, CornerDownLeft, Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { closeDocsSearch, docsSearch } from '$lib/state/docs-search.svelte';
	import { highlightSearchText } from '$lib/utils/search-highlight';

	type SearchResult = {
		id: string;
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
			queueMicrotask(() =>
				dialog?.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
			);
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
		goto(resolve(`/docs/${result.id}`));
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
			<label class="input input-bordered flex min-w-0 flex-1 items-center gap-2">
				<Search class="h-5 w-5 shrink-0 opacity-50" aria-hidden="true" />
				<input
					type="search"
					class="grow"
					placeholder="Search documentation…"
					value={query}
					oninput={(e) => onQueryInput(e.currentTarget.value)}
				/>
			</label>
			<kbd class="kbd kbd-sm hidden shrink-0 sm:inline-flex">esc</kbd>
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
								class="flex w-full flex-col items-start gap-1 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-content/30"
								class:bg-base-200={i === activeIndex}
								onclick={() => navigateTo(result)}
								onmouseenter={() => (activeIndex = i)}
							>
								<span class="w-full font-medium"
									>{@html highlightSearchText(result.title, query)}</span
								>
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

		<div
			class="flex items-center justify-between border-t border-base-300 px-4 py-2 text-xs text-base-content/50"
		>
			<span class="inline-flex items-center gap-1">
				<ArrowUp class="h-3 w-3" aria-hidden="true" />
				<ArrowDown class="h-3 w-3" aria-hidden="true" />
				navigate
			</span>
			<span class="inline-flex items-center gap-1">
				<CornerDownLeft class="h-3 w-3" aria-hidden="true" />
				open
			</span>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button type="submit" aria-label="Close search">close</button>
	</form>
</dialog>
