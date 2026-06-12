<script lang="ts">
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';

	let { data, children } = $props();
</script>

<div class="flex h-screen overflow-hidden bg-base-100">
	<AdminSidebar user={data.user} />
	<div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
		{@render children()}
	</div>
</div>
