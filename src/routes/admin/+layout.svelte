<script lang="ts">
	import { setAdminNavContext } from '$lib/admin/nav-context';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';

	let { data, children } = $props();

	let drawerOpen = $state(false);

	setAdminNavContext({
		open: () => {
			drawerOpen = true;
		},
		close: () => {
			drawerOpen = false;
		}
	});
</script>

<div class="drawer lg:drawer-open min-h-screen">
	<input id="admin-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
	<div class="drawer-content flex min-h-screen min-w-0 flex-col bg-base-100">
		{@render children()}
	</div>
	<div class="drawer-side z-40">
		<label for="admin-drawer" aria-label="Close menu" class="drawer-overlay"></label>
		<AdminSidebar
			user={data.user}
			onnavigate={() => {
				drawerOpen = false;
			}}
		/>
	</div>
</div>
