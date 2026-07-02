<script lang="ts">
	import { page } from '$app/state';
	import { setAdminNavContext } from '$lib/admin/nav-context';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';

	let { data, children } = $props();

	let drawerOpen = $state(false);

	const isLoginPage = $derived(
		page.url.pathname === '/admin/login' || page.url.pathname.startsWith('/admin/login/')
	);

	setAdminNavContext({
		open: () => {
			drawerOpen = true;
		},
		close: () => {
			drawerOpen = false;
		}
	});
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="drawer lg:drawer-open min-h-screen">
		<input id="admin-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
		<div class="drawer-content flex min-h-screen min-w-0 flex-col bg-base-100">
			{@render children()}
		</div>
		<div class="drawer-side z-40">
			<label for="admin-drawer" aria-label="Close menu" class="drawer-overlay"></label>
			<AdminSidebar
				user={data.user!}
				onnavigate={() => {
					drawerOpen = false;
				}}
			/>
		</div>
	</div>
{/if}
