<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { APP_NAME } from '$lib/config/app-name';
	import type { NavLink } from '$lib/types/nav';
	import ThemeToggle from './ThemeToggle.svelte';
	import SearchTrigger from './SearchTrigger.svelte';

	let {
		siteTitle = APP_NAME,
		siteIconHref = null,
		canAccessAdmin = false,
		navLinksEnabled = false,
		navLinks = []
	}: {
		siteTitle?: string;
		siteIconHref?: string | null;
		canAccessAdmin?: boolean;
		navLinksEnabled?: boolean;
		navLinks?: NavLink[];
	} = $props();

	const configuredNavLinks = $derived(navLinksEnabled ? navLinks : []);
	const showBurger = $derived(configuredNavLinks.length > 0 || canAccessAdmin);

	const burgerLinks = $derived.by(() => {
		const links: NavLink[] = [...configuredNavLinks];
		if (canAccessAdmin) links.push({ label: 'Admin', url: '/admin' });
		return links;
	});

	function isExternal(url: string) {
		return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
	}

	function linkHref(url: string) {
		if (isExternal(url)) return url;
		if (url === '/admin') return resolve('/admin');
		if (url === '/') return resolve('/');
		return url;
	}
</script>

<header
	class="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/80 px-4 backdrop-blur lg:px-8"
>
	<div class="navbar-start">
		{#if showBurger}
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
						{#each burgerLinks as link (link.url + link.label)}
							<li role="none">
								<a
									role="menuitem"
									href={linkHref(link.url)}
									target={isExternal(link.url) ? '_blank' : undefined}
									rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}
								>
									{link.label}
								</a>
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

	{#if configuredNavLinks.length > 0}
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal gap-1 px-1">
				{#each configuredNavLinks as link (link.url + link.label)}
					<li>
						<a
							href={linkHref(link.url)}
							class="btn btn-ghost btn-sm"
							target={isExternal(link.url) ? '_blank' : undefined}
							rel={isExternal(link.url) ? 'noopener noreferrer' : undefined}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="navbar-end gap-1">
		<SearchTrigger compact />
		<ThemeToggle />
		{#if canAccessAdmin}
			<a href={resolve('/admin')} class="btn btn-primary btn-sm hidden sm:inline-flex">Admin</a>
		{/if}
	</div>
</header>
