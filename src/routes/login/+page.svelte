<script lang="ts">
	import { enhance } from '$app/forms';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import { resolve } from '$app/paths';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import FormAlert from '$lib/components/FormAlert.svelte';
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import { formEnhance } from '$lib/utils/form-enhance';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const loadError = $derived(data.error ?? '');
</script>

<PageTitle title="Admin sign in" appName={data.site.appName} />

<SiteNavbar
	siteTitle={data.site.siteTitle}
	siteIconHref={data.site.siteIconHref}
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

			{#if loadError}
				<div class="alert alert-error text-sm" role="alert">
					<span>{loadError}</span>
				</div>
			{/if}

			<FormAlert {form} />

			{#if data.hasAdmin}
				<form method="post" action="?/signInGithub" use:enhance={formEnhance}>
					<input type="hidden" name="requestSignUp" value="false" />
					<button type="submit" class="btn btn-primary btn-block gap-2">
						{@render githubIcon()}
						Sign in with GitHub
					</button>
				</form>
			{:else}
				<form method="post" action="?/signInGithub" use:enhance={formEnhance}>
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
	<GithubIcon />
{/snippet}
