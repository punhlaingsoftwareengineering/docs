<script lang="ts">
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import TechStack from '$lib/components/landing/TechStack.svelte';
	import FeatureGrid from '$lib/components/landing/FeatureGrid.svelte';
	import CodePreview from '$lib/components/landing/CodePreview.svelte';
	import DocsCategories from '$lib/components/landing/DocsCategories.svelte';
	import LandingCta from '$lib/components/landing/LandingCta.svelte';

	let { data } = $props();
	const s = $derived(data.settings);
	const auth = $derived(data.auth);
	const showAdminAuth = $derived(!auth.hasAdmin || auth.isSignedIn);
</script>

<svelte:head>
	<title>{s.siteTitle} — {s.tagline}</title>
	<meta name="description" content={s.metaDescription} />
</svelte:head>

<SiteNavbar
	siteTitle={s.siteTitle}
	hasAdmin={auth.hasAdmin}
	isSignedIn={auth.isSignedIn}
/>

<main class="flex-1">
	<Hero
		tagline={s.tagline}
		heroTitle={s.heroTitle}
		heroSubtitle={s.heroSubtitle}
		heroPrimaryCta={s.heroPrimaryCta}
		heroPrimaryUrl={s.heroPrimaryUrl}
		heroSecondaryCta={auth.isSignedIn ? 'Admin' : s.heroSecondaryCta}
		heroSecondaryUrl={auth.isSignedIn ? '/admin' : s.heroSecondaryUrl}
		showSecondaryCta={showAdminAuth}
	/>
	<TechStack />
	<FeatureGrid />
	<CodePreview />
	<DocsCategories />
	<LandingCta showAdminLink={auth.isSignedIn} />
</main>

<SiteFooter siteTitle={s.siteTitle} showAdminLink={auth.isSignedIn} />
