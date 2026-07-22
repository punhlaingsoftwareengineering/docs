<script lang="ts">
	import { BookOpen, Menu, Moon, Search, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import DocsChapterSidebar from '$lib/components/docs/DocsChapterSidebar.svelte';
	import { openDocsSearch } from '$lib/state/docs-search.svelte';
	import type { SidebarGroup } from '$lib/types/docs-tree';
	import { type Theme, getStoredTheme, toggleTheme } from '$lib/utils/theme';

	let {
		appName,
		sidebarGroups,
		currentId,
		currentCategoryId,
		children,
		breadcrumbs
	}: {
		appName: string;
		sidebarGroups: SidebarGroup[];
		currentId?: string;
		currentCategoryId?: string;
		children: Snippet;
		breadcrumbs?: Snippet;
	} = $props();

	const drawerId = 'docs-drawer-nav';

	let drawerOpen = $state(false);
	let theme = $state<Theme>('winter');

	function closeDrawer() {
		drawerOpen = false;
	}

	onMount(() => {
		theme = getStoredTheme();
	});

	function handleThemeToggle() {
		theme = toggleTheme(theme);
	}
</script>

<div class="drawer min-h-[100dvh] lg:drawer-open">
	<input id={drawerId} type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
	<div class="drawer-content flex min-h-[100dvh] flex-col bg-base-100">
		<div class="navbar sticky top-0 z-30 border-b border-base-200 bg-base-100/95 backdrop-blur">
			<div class="flex-none lg:hidden">
				<label for={drawerId} class="btn btn-square btn-ghost" aria-label="Open sidebar">
					<Menu class="size-5" />
				</label>
			</div>
			<div class="flex flex-1 items-center gap-2 px-2">
				<a href={resolve('/')} class="btn px-2 text-lg font-semibold btn-ghost">
					{appName}
				</a>
				<span class="hidden text-base-content/40 sm:inline">/</span>
				<span class="flex items-center gap-1 text-sm font-medium text-base-content/80">
					<BookOpen class="size-4 shrink-0 opacity-70" aria-hidden="true" />
					Docs
				</span>
			</div>
			<div class="flex flex-none items-center gap-1">
				<button
					type="button"
					class="btn btn-ghost btn-sm btn-square"
					aria-label="Search documentation"
					onclick={() => openDocsSearch()}
				>
					<Search class="size-5" aria-hidden="true" />
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-sm btn-square"
					aria-label={theme === 'winter' ? 'Switch to dark theme' : 'Switch to light theme'}
					onclick={handleThemeToggle}
				>
					{#if theme === 'winter'}
						<Sun class="size-5" aria-hidden="true" />
					{:else}
						<Moon class="size-5" aria-hidden="true" />
					{/if}
				</button>
			</div>
		</div>

		<main class="flex min-h-0 flex-1 flex-col">
			{#if breadcrumbs}
				<div class="border-b border-base-200 bg-base-200/30 px-4 py-3 lg:px-8">
					{@render breadcrumbs()}
				</div>
			{/if}

			<div
				id="docs-prose-root"
				class="[&_a]:link-primary prose prose-sm max-w-none flex-1 px-4 py-8 lg:px-10 {theme === 'night'
					? 'prose-invert'
					: ''}"
			>
				{@render children()}
			</div>

			<footer
				class="mt-auto border-t border-base-200 px-4 py-6 text-center text-xs text-base-content/50 lg:px-8"
			>
				{appName} documentation
			</footer>
		</main>
	</div>

	<div class="drawer-side z-40 h-full max-h-[100dvh] border-r border-base-200">
		<label for={drawerId} class="drawer-overlay" aria-label="Close menu"></label>
		<aside
			class="flex h-full w-72 max-w-[85vw] flex-col gap-2 overflow-y-auto bg-base-200/80 pt-4 pb-8 backdrop-blur"
		>
			<div class="px-4 pb-2">
				<p class="text-xs font-semibold tracking-wide text-base-content/60 uppercase">
					On this site
				</p>
			</div>
			<DocsChapterSidebar
				groups={sidebarGroups}
				{currentId}
				{currentCategoryId}
				onnavigate={closeDrawer}
			/>
		</aside>
	</div>
</div>
