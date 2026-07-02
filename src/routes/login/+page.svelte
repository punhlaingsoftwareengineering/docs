<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import { resolve } from '$app/paths';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);
	let actionError = $state('');
	let showEmailSignIn = $state(false);

	let email = $state('');
	let password = $state('');

	const loadError = $derived(data.error ?? '');

	async function signInWithGithub() {
		submitting = true;
		actionError = '';

		const { error } = await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/',
			errorCallbackURL: '/login',
			requestSignUp: false
		});

		if (error) {
			actionError = error.message || 'Could not start GitHub sign-in.';
			submitting = false;
		}
	}

	async function signInWithEmail(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		actionError = '';
		submitting = true;

		const { error } = await authClient.signIn.email({
			email: email.trim(),
			password,
			callbackURL: '/'
		});

		if (error) {
			actionError = error.message || 'Could not sign in.';
			submitting = false;
			return;
		}

		await goto('/');
	}
</script>

<PageTitle title="Sign in" appName={data.site.appName} />

<SiteNavbar
	siteTitle={data.site.siteTitle}
	siteIconHref={data.site.siteIconHref}
	hasAdmin={data.auth.hasAdmin}
	isSignedIn={data.auth.isSignedIn}
	isAdmin={data.auth.isAdmin}
	navLinksEnabled={data.site.navLinksEnabled}
	navLinks={data.site.navLinks}
/>

<main class="flex flex-1 items-center justify-center px-4 py-16">
	<div class="card card-border w-full max-w-md bg-base-200 shadow-xl">
		<div class="card-body gap-6">
			<div class="text-center">
				<h1 class="text-2xl font-bold">Sign in</h1>
				<p class="mt-2 text-sm text-base-content/70">
					Sign in with GitHub or email. New accounts are not available here.
				</p>
			</div>

			{#if loadError || actionError}
				<div class="alert alert-error text-sm" role="alert">
					<span>{loadError || actionError}</span>
				</div>
			{/if}

			{#if showEmailSignIn}
				<form class="flex flex-col gap-4" onsubmit={signInWithEmail}>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Email</span>
						</div>
						<input
							type="email"
							class="input input-bordered w-full"
							autocomplete="email"
							required
							bind:value={email}
						/>
					</label>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Password</span>
						</div>
						<input
							type="password"
							class="input input-bordered w-full"
							autocomplete="current-password"
							required
							bind:value={password}
						/>
					</label>
					<button
						type="submit"
						class="btn btn-primary btn-block"
						disabled={submitting}
						aria-busy={submitting}
					>
						{#if submitting}
							<span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
						{/if}
						Sign in with email
					</button>
				</form>
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showEmailSignIn = false;
						actionError = '';
					}}
				>
					Use GitHub instead
				</button>
			{:else}
				<button
					type="button"
					class="btn btn-primary btn-block gap-2"
					disabled={submitting}
					aria-busy={submitting}
					onclick={signInWithGithub}
				>
					{#if submitting}
						<span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
					{:else}
						<GithubIcon />
					{/if}
					Sign in with GitHub
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					onclick={() => {
						showEmailSignIn = true;
						actionError = '';
					}}
				>
					Sign in with email instead
				</button>
			{/if}

			<div class="divider my-0 text-xs">or</div>

			<a href={resolve('/admin/login')} class="btn btn-ghost btn-sm">Admin sign in</a>
			<a href={resolve('/')} class="btn btn-ghost btn-sm">Back to documentation</a>
		</div>
	</div>
</main>
