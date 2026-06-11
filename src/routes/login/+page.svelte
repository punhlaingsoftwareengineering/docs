<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const message = $derived(form?.message ?? data.error ?? '');
</script>

<svelte:head>
	<title>Admin sign in — {data.site.siteTitle}</title>
</svelte:head>

<SiteNavbar
	siteTitle={data.site.siteTitle}
	hasAdmin={data.auth.hasAdmin}
	isSignedIn={data.auth.isSignedIn}
/>

<main class="flex flex-1 items-center justify-center px-4 py-16">
	<div class="card card-border w-full max-w-md bg-base-200 shadow-xl">
		<div class="card-body gap-6">
			<div class="text-center">
				<h1 class="text-2xl font-bold">
					{data.hasAdmin ? 'Admin sign in' : 'Create admin account'}
				</h1>
				<p class="mt-2 text-sm text-base-content/70">
					{#if data.hasAdmin}
						Sign in with GitHub to manage documentation. New accounts are not accepted.
					{:else}
						The first GitHub sign-in becomes the sole site admin. No one else can register.
					{/if}
				</p>
			</div>

			{#if message}
				<div class="alert alert-error text-sm" role="alert">
					<span>{message}</span>
				</div>
			{/if}

			{#if data.hasAdmin}
				<form method="post" action="?/signInGithub" use:enhance>
					<input type="hidden" name="requestSignUp" value="false" />
					<button type="submit" class="btn btn-primary btn-block gap-2">
						{@render githubIcon()}
						Sign in with GitHub
					</button>
				</form>
			{:else}
				<form method="post" action="?/signInGithub" use:enhance>
					<input type="hidden" name="requestSignUp" value="true" />
					<button type="submit" class="btn btn-primary btn-block gap-2">
						{@render githubIcon()}
						Sign up with GitHub
					</button>
				</form>
				<p class="text-center text-xs text-base-content/50">
					After you sign up, this button is removed for all other visitors.
				</p>
			{/if}

			<div class="divider my-0 text-xs">or</div>

			<a href={resolve('/')} class="btn btn-ghost btn-sm">Back to documentation</a>
		</div>
	</div>
</main>

{#snippet githubIcon()}
	<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path
			d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-1.005-.54-2.43-1.365-2.43-3.315 0-1.545 1.11-2.775 2.475-2.775 1.155 0 1.71.855 1.71 1.875 0 1.14-.735 2.85-1.11 4.35-.315 1.305.675 2.37 1.98 2.37 2.37 0 4.23-2.49 4.23-6.075 0-3.18-2.28-5.415-5.55-5.415-3.78 0-6 2.835-6 6.015 0 1.185.45 2.46 1.02 3.15.12.135.135.255.09.39-.09.375-.3 1.185-.345 1.35-.06.225-.195.27-.45.165-1.68-.78-2.73-3.225-2.73-5.19 0-4.23 3.075-8.115 8.865-8.115 4.65 0 8.265 3.315 8.265 7.74 0 4.62-2.91 8.34-6.96 8.34-1.365 0-2.64-.705-3.075-1.53 0 0-.675 2.565-.84 3.195-.3 1.14-1.11 2.565-1.65 3.435 1.245.375 2.565.57 3.93.57 6.63 0 12-5.37 12-12S18.63 0 12 0Z"
		/>
	</svg>
{/snippet}
