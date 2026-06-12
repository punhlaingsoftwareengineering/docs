<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { APP_NAME } from '$lib/config/app-name';
	import ThemeToggle from './ThemeToggle.svelte';
	import SearchTrigger from './SearchTrigger.svelte';

	let {
		siteTitle = APP_NAME,
		siteIconHref = null,
		hasAdmin = false,
		isSignedIn = false
	}: {
		siteTitle?: string;
		siteIconHref?: string | null;
		hasAdmin?: boolean;
		isSignedIn?: boolean;
	} = $props();

	const onLoginPage = $derived(page.url.pathname === '/login');
	const showSignIn = $derived(!hasAdmin && !onLoginPage);
	const showAdminLink = $derived(hasAdmin && isSignedIn);
	const mobileLinks = $derived.by(() => {
		const links: { href: string; label: string }[] = [];
		if (showSignIn) links.push({ href: resolve('/login'), label: 'Create admin' });
		if (showAdminLink) links.push({ href: resolve('/admin'), label: 'Admin' });
		return links;
	});
</script>

<header class="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/80 px-4 backdrop-blur lg:px-8">
	<div class="navbar-start">
		{#if mobileLinks.length > 0}
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden" aria-label="Open menu">
					<Menu class="h-5 w-5" aria-hidden="true" />
				</div>
				<div
					tabindex="0"
					role="menu"
					class="dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg"
				>
					<ul class="menu menu-sm">
						{#each mobileLinks as link (link.href)}
							<li role="none">
								<a role="menuitem" href={link.href}>{link.label}</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
		<a href={resolve('/')} class="btn btn-ghost gap-2 text-xl font-semibold normal-case">
			{#if siteIconHref}
				<img src={siteIconHref} alt="" class="h-7 w-7 shrink-0 rounded object-contain" />
			{/if}
			<span>{siteTitle}</span>
		</a>
	</div>

	<div class="navbar-end gap-1">
		<SearchTrigger compact />
		<ThemeToggle />
		{#if showSignIn}
			<a href={resolve('/login')} class="btn btn-primary btn-sm hidden sm:inline-flex">Create admin</a>
		{/if}
		{#if showAdminLink}
			<a href={resolve('/admin')} class="btn btn-primary btn-sm hidden sm:inline-flex">Admin</a>
		{/if}
	</div>
</header>
