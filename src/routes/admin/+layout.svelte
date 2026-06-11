<script lang="ts">
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';

	let { data, children } = $props();
</script>

<div class="flex min-h-screen bg-base-100">
	<AdminSidebar user={data.user} />
	<div class="flex min-w-0 flex-1 flex-col">
		{@render children()}
	</div>
</div>
