<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { user }: { user: { name: string; image?: string | null } } = $props();

	const links = [
		{ href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
		{ href: '/admin/documents', label: 'Documents', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
		{ href: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
	] as const;

	function isActive(href: string) {
		const path = page.url.pathname;
		if (href === '/admin') return path === '/admin';
		return path.startsWith(href);
	}
</script>

<aside class="flex h-full w-64 flex-col border-r border-base-300 bg-base-200">
	<div class="flex items-center gap-3 border-b border-base-300 p-4">
		<div class="avatar">
			<div class="w-10 rounded-full">
				{#if user.image}
					<img src={user.image} alt="" />
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-primary text-primary-content">
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

	<nav class="flex-1 space-y-1 p-3">
		{#each links as link (link.href)}
			<a
				href={resolve(link.href)}
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
				class:bg-primary={isActive(link.href)}
				class:text-primary-content={isActive(link.href)}
				class:hover:bg-base-300={!isActive(link.href)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={link.icon} />
				</svg>
				{link.label}
			</a>
		{/each}
	</nav>

	<div class="border-t border-base-300 p-3">
		<a href={resolve('/')} class="btn btn-ghost btn-sm w-full justify-start gap-2" target="_blank">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				/>
			</svg>
			View site
		</a>
	</div>
</aside>
