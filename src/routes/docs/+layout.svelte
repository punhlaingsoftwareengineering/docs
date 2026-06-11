<script lang="ts">
	import { page } from '$app/state';
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte';

	let { data, children } = $props();

	const currentSlug = $derived(page.params.slug);
</script>

<SiteNavbar
	siteTitle={data.site.siteTitle}
	hasAdmin={data.auth.hasAdmin}
	isSignedIn={data.auth.isSignedIn}
/>

<main class="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 lg:px-8">
	<aside class="hidden w-56 shrink-0 lg:block">
		<DocsSidebar groups={data.sidebarGroups} {currentSlug} />
	</aside>
	<div class="min-w-0 flex-1">
		{@render children()}
	</div>
</main>

<SiteFooter siteTitle={data.site.siteTitle} showAdminLink={data.auth.isSignedIn} />
