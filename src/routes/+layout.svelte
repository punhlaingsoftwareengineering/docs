<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import SharedAppearanceSync from '$lib/components/SharedAppearanceSync.svelte';
	import SupportFab from '$lib/components/SupportFab.svelte';
	import DocsSearchModal from '$lib/components/docs/DocsSearchModal.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();

	const iconHref = $derived(data.site.siteIconHref ?? favicon);
</script>

<svelte:head>
	<link rel="icon" href={iconHref} />
	<link rel="apple-touch-icon" href={iconHref} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-base-100 text-base-content">
	{@render children()}
</div>

<SharedAppearanceSync />
<SupportFab />
<DocsSearchModal />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
