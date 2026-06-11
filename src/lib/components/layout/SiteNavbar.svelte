<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ThemeToggle from './ThemeToggle.svelte';
	import SearchTrigger from './SearchTrigger.svelte';

	let {
		siteTitle = 'zarnihlawn docs',
		hasAdmin = false,
		isSignedIn = false
	}: {
		siteTitle?: string;
		hasAdmin?: boolean;
		isSignedIn?: boolean;
	} = $props();

	const onLoginPage = $derived(page.url.pathname === '/login');
	const showSignIn = $derived(!hasAdmin && !onLoginPage);
	const showAdminLink = $derived(hasAdmin && isSignedIn);
</script>

<header class="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/80 px-4 backdrop-blur lg:px-8">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden" aria-label="Open menu">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</div>
			<div
				tabindex="0"
				role="menu"
				class="dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg"
			>
				<ul class="menu menu-sm">
					<li role="none"><a role="menuitem" href={resolve('/docs')}>Documentation</a></li>
					{#if showSignIn}
						<li role="none"><a role="menuitem" href={resolve('/login')}>Create admin</a></li>
					{/if}
					{#if showAdminLink}
						<li role="none"><a role="menuitem" href={resolve('/admin')}>Admin</a></li>
					{/if}
				</ul>
			</div>
		</div>
		<a href={resolve('/')} class="btn btn-ghost text-xl font-semibold normal-case">{siteTitle}</a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href={resolve('/docs')}>Documentation</a></li>
		</ul>
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
