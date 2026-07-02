<script lang="ts">
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import TechStack from '$lib/components/landing/TechStack.svelte';
	import FeatureGrid from '$lib/components/landing/FeatureGrid.svelte';
	import WelcomeVideo from '$lib/components/landing/WelcomeVideo.svelte';
	import LandingCta from '$lib/components/landing/LandingCta.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	let { data } = $props();
	const s = $derived(data.settings);
	const landing = $derived(data.landing);
	const auth = $derived(data.auth);
	const showAdminAuth = $derived(!auth.isAdmin);
</script>

<PageTitle title={s.tagline} appName={data.site.appName} />

<svelte:head>
	<meta name="description" content={s.metaDescription} />
</svelte:head>

<SiteNavbar
	siteTitle={s.siteTitle}
	siteIconHref={data.site.siteIconHref}
	hasAdmin={auth.hasAdmin}
	isSignedIn={auth.isSignedIn}
	isAdmin={auth.isAdmin}
	navLinksEnabled={data.site.navLinksEnabled}
	navLinks={data.site.navLinks}
/>

<main class="flex-1">
	<Hero
		tagline={s.tagline}
		heroTitle={s.heroTitle}
		heroSubtitle={s.heroSubtitle}
		heroPrimaryCta={s.heroPrimaryCta}
		heroPrimaryUrl={s.heroPrimaryUrl}
		heroSecondaryCta={auth.isAdmin ? 'Admin' : auth.hasAdmin ? 'Sign in' : 'Set up admin'}
		heroSecondaryUrl={auth.isAdmin ? '/admin' : auth.hasAdmin ? '/login' : '/admin/login'}
		searchPlaceholder={landing.heroSearchPlaceholder}
		showSecondaryCta={showAdminAuth}
	/>
	<TechStack heading={landing.techStack.heading} items={landing.techStack.items} />
	<FeatureGrid
		heading={landing.features.heading}
		subtitle={landing.features.subtitle}
		ctaLabel={landing.docsCategories.ctaLabel}
		ctaUrl={landing.docsCategories.ctaUrl}
		sections={data.categorySections}
	/>
	<WelcomeVideo
		heading={landing.codePreview.heading}
		subtitle={landing.codePreview.subtitle}
		videoUrl={landing.codePreview.videoUrl}
	/>
	<LandingCta
		heading={landing.cta.heading}
		subtitle={landing.cta.subtitle}
		primaryLabel={landing.cta.primaryLabel}
		primaryUrl={landing.cta.primaryUrl}
		secondaryLabel={auth.isAdmin ? 'Admin area' : landing.cta.secondaryLabel}
		secondaryUrl={auth.isAdmin ? '/admin' : landing.cta.secondaryUrl}
		showSecondaryCta={showAdminAuth}
	/>
</main>
