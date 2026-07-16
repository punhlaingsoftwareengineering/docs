<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { APP_NAME } from '$lib/config/app-name';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import type { LayoutData } from './$types';

	let {
		data,
		error
	}: {
		data?: LayoutData;
		error: Error & { message?: string };
	} = $props();

	const status = $derived(page.status ?? 500);

	const appName = $derived(data?.site?.appName ?? APP_NAME);
	const message = $derived(
		error?.message?.trim() ||
			(status === 404 ? 'This page could not be found.' : 'Something went wrong.')
	);

	function goHome() {
		void goto(resolve('/'), { replaceState: false });
	}

	function goBack() {
		if (browser && window.history.length > 1) {
			window.history.back();
		} else {
			goHome();
		}
	}

	function goLogin() {
		void goto(`${resolve('/auth/login')}?reason=session`, { replaceState: false });
	}
</script>

<PageTitle title={message} {appName} />

<div class="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4 py-16">
	<div class="card w-full max-w-lg border border-base-300 bg-base-100 shadow-lg">
		<div class="card-body gap-6 text-center">
			<div>
				<p class="text-sm font-medium tracking-wide text-base-content/60 uppercase">Error</p>
				<p class="text-5xl font-bold text-primary tabular-nums">{status}</p>
				<h1 class="mt-2 text-xl font-semibold">{message}</h1>
				{#if page.url?.pathname}
					<p class="mt-2 text-xs break-all text-base-content/50">{page.url.pathname}</p>
				{/if}
			</div>

			{#if status === 401}
				<p class="text-sm text-base-content/70">
					Your session may have expired. Sign in again on the employee portal to continue.
				</p>
			{:else if status === 403}
				<p class="text-sm text-base-content/70">
					You do not have permission to access this area. Ask a portal admin to assign the Docs
					service to your access role.
				</p>
			{:else if status === 503}
				<p class="text-sm text-base-content/70">
					The service or database is temporarily unavailable. Try again in a moment.
				</p>
			{/if}

			<div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
				<button type="button" class="btn btn-primary" onclick={goHome}>Home</button>
				<button type="button" class="btn btn-outline" onclick={goBack}>Back</button>
				{#if status === 401}
					<button type="button" class="btn btn-secondary" onclick={goLogin}>Sign in</button>
				{/if}
			</div>
		</div>
	</div>
</div>
