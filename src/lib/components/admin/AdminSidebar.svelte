<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		ExternalLink,
		FileText,
		FolderTree,
		LayoutDashboard,
		LogOut,
		Settings,
		Users
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';

	let {
		user,
		onnavigate
	}: { user: { name: string; image?: string | null }; onnavigate?: () => void } = $props();

	let signingOut = $state(false);

	const links = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/documents', label: 'Documents', icon: FileText },
		{ href: '/admin/categories', label: 'Categories', icon: FolderTree },
		{ href: '/admin/users', label: 'Users', icon: Users },
		{ href: '/admin/settings', label: 'Settings', icon: Settings }
	] as const;

	function isActive(href: string) {
		const path = page.url.pathname;
		if (href === '/admin') return path === '/admin';
		return path.startsWith(href);
	}

	async function signOut() {
		if (signingOut) return;
		signingOut = true;
		onnavigate?.();
		await authClient.signOut();
		await goto(resolve('/'));
	}
</script>

<aside
	class="flex h-full min-h-screen w-72 max-w-[85vw] flex-col border-r border-base-300 bg-base-200 lg:w-64"
>
	<div class="flex items-center gap-3 border-b border-base-300 p-4">
		<div class="avatar">
			<div class="w-10 rounded-full">
				{#if user.image}
					<img src={user.image} alt="" />
				{:else}
					<div
						class="flex h-full w-full items-center justify-center bg-primary text-primary-content"
					>
						{user.name.charAt(0).toUpperCase()}
					</div>
				{/if}
			</div>
		</div>
		<div class="min-w-0">
			<p class="truncate text-sm font-semibold">{user.name}</p>
			<p class="text-xs text-base-content/60">Admin</p>
		</div>
	</div>

	<nav class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
		{#each links as link (link.href)}
			{@const Icon = link.icon}
			<a
				href={resolve(link.href)}
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
				class:bg-primary={isActive(link.href)}
				class:text-primary-content={isActive(link.href)}
				class:hover:bg-base-300={!isActive(link.href)}
				onclick={() => onnavigate?.()}
			>
				<Icon class="h-5 w-5 shrink-0" aria-hidden="true" />
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="space-y-1 border-t border-base-300 p-3">
		<a
			href={resolve('/')}
			class="btn btn-ghost btn-sm w-full justify-start gap-2"
			target="_blank"
			onclick={() => onnavigate?.()}
		>
			<ExternalLink class="h-4 w-4" aria-hidden="true" />
			View site
		</a>
		<button
			type="button"
			class="btn btn-ghost btn-sm w-full justify-start gap-2"
			disabled={signingOut}
			aria-busy={signingOut}
			onclick={() => void signOut()}
		>
			{#if signingOut}
				<span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
			{:else}
				<LogOut class="h-4 w-4" aria-hidden="true" />
			{/if}
			Sign out
		</button>
	</div>
</aside>
