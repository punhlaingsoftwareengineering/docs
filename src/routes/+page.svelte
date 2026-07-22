<script lang="ts">
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import TechStack from '$lib/components/landing/TechStack.svelte';
	import FeatureGrid from '$lib/components/landing/FeatureGrid.svelte';
	import WelcomeVideo from '$lib/components/landing/WelcomeVideo.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	let { data } = $props();
	const s = $derived(data.settings);
	const landing = $derived(data.landing);
	const auth = $derived(data.auth);
</script>

<PageTitle title={s.tagline} appName={data.site.appName} />

<svelte:head>
	<meta name="description" content={s.metaDescription} />
</svelte:head>

<SiteNavbar
	siteTitle={s.siteTitle}
	siteIconHref={data.site.siteIconHref}
	canAccessAdmin={auth.canAccessAdmin}
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
	/>
	<TechStack heading={landing.techStack.heading} items={landing.techStack.items} />
	<FeatureGrid
		heading={landing.features.heading}
		subtitle={landing.features.subtitle}
		sections={data.categorySections}
	/>
	<WelcomeVideo
		heading={landing.codePreview.heading}
		subtitle={landing.codePreview.subtitle}
		videoUrl={landing.codePreview.videoUrl}
	/>
</main>
