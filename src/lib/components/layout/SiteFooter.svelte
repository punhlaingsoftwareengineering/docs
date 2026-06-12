<script lang="ts">
	import { resolve } from '$app/paths';
	import { APP_NAME } from '$lib/config/app-name';
	import { TEMPLATE_REPO_LABEL, TEMPLATE_REPO_URL } from '$lib/config/template-repo';
	import defaultFavicon from '$lib/assets/favicon.svg';
	import type { FooterSocialLink } from '$lib/types/footer';
	import type { FooterCategory } from '$lib/types/docs-tree';

	let {
		siteTitle = '',
		siteIconHref = null,
		appName = APP_NAME,
		copyrightNotice = 'zarnihlawn.com',
		tagline = '',
		categories = [],
		socialEnabled = false,
		socialLinks = [],
		showAdminLink = false
	}: {
		siteTitle?: string;
		siteIconHref?: string | null;
		appName?: string;
		copyrightNotice?: string;
		tagline?: string;
		categories?: FooterCategory[];
		socialEnabled?: boolean;
		socialLinks?: FooterSocialLink[];
		showAdminLink?: boolean;
	} = $props();

	const year = new Date().getFullYear();
	const showSocial = $derived(socialEnabled && socialLinks.length > 0);
	const displayName = $derived(siteTitle.trim() || appName);
	const displayIcon = $derived(siteIconHref ?? defaultFavicon);
</script>

{#if categories.length > 0}
	<footer class="footer sm:footer-horizontal bg-base-200 px-4 py-10 text-base-content lg:px-8">
		{#each categories as category (category.slug)}
			<nav>
				<h6 class="footer-title">
					<a href={resolve(`/docs/${category.entrySlug}`)} class="link link-hover">
						{category.name}
					</a>
				</h6>
				{#each category.documents as doc (doc.slug)}
					<a href={resolve(`/docs/${doc.slug}`)} class="link link-hover">{doc.title}</a>
				{/each}
			</nav>
		{/each}
	</footer>
{/if}

<footer
	class="footer bg-base-200 px-4 py-4 text-base-content border-t border-base-300 lg:px-8"
	class:sm:footer-horizontal={showSocial}
>
	<aside class="grid-flow-col items-center gap-3">
		<img src={displayIcon} alt="" class="h-6 w-6 shrink-0 rounded object-contain" />
		<p class="text-sm text-base-content/80">
			<span class="font-semibold text-base-content">{displayName}</span>
			{#if tagline}
				<br />
				{tagline}
			{/if}
			<br />
			&copy; {year} {copyrightNotice}
			<br />
			<span class="text-base-content/60">
				Template:
				<a
					href={TEMPLATE_REPO_URL}
					class="link link-hover"
					target="_blank"
					rel="noopener noreferrer"
				>
					{TEMPLATE_REPO_LABEL}
				</a>
			</span>
			{#if showAdminLink}
				<br />
				<a href={resolve('/admin')} class="link link-hover">Admin</a>
			{/if}
		</p>
	</aside>

	{#if showSocial}
		<nav class="md:place-self-center md:justify-self-end" aria-label="Social links">
			<div class="grid grid-flow-col gap-4">
				{#each socialLinks as link (link.url)}
					<a
						href={link.url}
						class="link link-hover text-sm"
						target="_blank"
						rel="noopener noreferrer"
					>
						{link.label}
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</footer>
