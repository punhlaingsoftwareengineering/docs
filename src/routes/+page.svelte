<script lang="ts">
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import TechStack from '$lib/components/landing/TechStack.svelte';
	import FeatureGrid from '$lib/components/landing/FeatureGrid.svelte';
	import CodePreview from '$lib/components/landing/CodePreview.svelte';
	import DocsCategories from '$lib/components/landing/DocsCategories.svelte';
	import LandingCta from '$lib/components/landing/LandingCta.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	let { data } = $props();
	const s = $derived(data.settings);
	const landing = $derived(data.landing);
	const auth = $derived(data.auth);
	const showAdminAuth = $derived(!auth.hasAdmin || auth.isSignedIn);
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
		searchPlaceholder={landing.heroSearchPlaceholder}
		showSecondaryCta={showAdminAuth}
	/>
	<TechStack heading={landing.techStack.heading} items={landing.techStack.items} />
	<FeatureGrid
		heading={landing.features.heading}
		subtitle={landing.features.subtitle}
		items={landing.features.items}
	/>
	<CodePreview
		heading={landing.codePreview.heading}
		subtitle={landing.codePreview.subtitle}
		terminalLabel={landing.codePreview.terminalLabel}
		lines={landing.codePreview.lines}
	/>
	<DocsCategories
		heading={landing.docsCategories.heading}
		subtitle={landing.docsCategories.subtitle}
		ctaLabel={landing.docsCategories.ctaLabel}
		ctaUrl={landing.docsCategories.ctaUrl}
		descriptions={landing.docsCategories.descriptions}
		categories={data.landingCategories}
	/>
	<LandingCta
		heading={landing.cta.heading}
		subtitle={landing.cta.subtitle}
		primaryLabel={landing.cta.primaryLabel}
		primaryUrl={landing.cta.primaryUrl}
		secondaryLabel={auth.isSignedIn ? 'Admin area' : landing.cta.secondaryLabel}
		secondaryUrl={auth.isSignedIn ? '/admin' : landing.cta.secondaryUrl}
		showSecondaryCta={showAdminAuth}
	/>
</main>

<SiteFooter
	siteTitle={s.siteTitle}
	siteIconHref={data.site.siteIconHref}
	appName={data.site.appName}
	copyrightNotice={s.copyrightNotice ?? 'zarnihlawn.com'}
	tagline={s.tagline}
	categories={data.footerCategories}
	socialEnabled={s.footerSocialEnabled ?? false}
	socialLinks={s.footerSocialLinks ?? []}
	showAdminLink={auth.isSignedIn}
/>
