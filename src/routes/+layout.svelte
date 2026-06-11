<script lang="ts">
	import type { Pathname } from '$app/types';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { applyTheme, getStoredTheme } from '$lib/utils/theme';
	import DocsSearchModal from '$lib/components/docs/DocsSearchModal.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		applyTheme(getStoredTheme());
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-base-100 text-base-content">
	{@render children()}
</div>

<DocsSearchModal />

<div style="display:none">
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
		>{locale}</a>
	{/each}
</div>
