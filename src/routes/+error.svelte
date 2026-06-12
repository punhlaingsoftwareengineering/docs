<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();
</script>

<PageTitle title={page.error?.message ?? 'Something went wrong'} appName={data.site.appName} />

<div class="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
	<h1 class="text-2xl font-bold">{page.status}</h1>
	<p class="text-base-content/70">{page.error?.message ?? 'Something went wrong'}</p>
	<a href={resolve('/')} class="btn btn-primary">Go home</a>
</div>
