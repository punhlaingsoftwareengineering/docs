<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showSessionExpired = $state(false);

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		showSessionExpired = params.get('reason') === 'session';
	});
</script>

<PageTitle title="Sign in" appName={data.site.appName} />

<div class="flex min-h-screen flex-col items-center justify-center p-6">
	<div class="card w-full max-w-md border border-base-200 bg-base-100 shadow-sm">
		<div class="card-body gap-4">
			<a href={resolve('/')} class="btn btn-circle btn-ghost btn-sm self-start" aria-label="Back home">
				<ArrowLeft class="size-4" aria-hidden="true" />
			</a>

			<div>
				<h1 class="text-2xl font-bold">Sign in</h1>
				{#if showSessionExpired}
					<p class="mt-2 text-sm text-base-content/70">
						Your session expired. Sign in again on the employee portal to continue.
					</p>
				{:else}
					<p class="mt-2 text-sm text-base-content/70">
						Documentation admin uses your employee portal account.
					</p>
				{/if}
			</div>

			<a href={data.portalLoginUrl} class="btn btn-primary w-full">
				Sign in on employee portal
			</a>
		</div>
	</div>
</div>
