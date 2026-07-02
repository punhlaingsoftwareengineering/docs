<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);
	let actionError = $state('');
	let name = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	const enrollPath = '/admin/security/2fa';

	async function acceptWithGithub() {
		if (submitting || data.invalid) return;

		submitting = true;
		actionError = '';

		const { error } = await authClient.signIn.social({
			provider: 'github',
			callbackURL: enrollPath,
			errorCallbackURL: `/invite/${data.token}`,
			requestSignUp: true
		});

		if (error) {
			actionError = error.message || 'Could not start GitHub sign-in.';
			submitting = false;
		}
	}

	async function acceptWithEmail(event: SubmitEvent) {
		event.preventDefault();
		if (submitting || data.invalid) return;

		actionError = '';
		if (password !== confirmPassword) {
			actionError = 'Passwords do not match.';
			return;
		}
		if (password.length < 8) {
			actionError = 'Password must be at least 8 characters.';
			return;
		}

		submitting = true;

		const { error } = await authClient.signUp.email({
			name: name.trim(),
			email: data.email,
			password,
			callbackURL: enrollPath
		});

		if (error) {
			actionError = error.message || 'Could not create your account.';
			submitting = false;
			return;
		}

		await goto(enrollPath);
	}
</script>

<PageTitle title="Accept invitation" appName={data.site.appName} />

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
				<h1 class="text-2xl font-bold">Accept admin invitation</h1>
				{#if data.invalid}
					<p class="mt-2 text-sm text-base-content/70">
						This invitation link is invalid, expired, or has already been used.
					</p>
				{:else}
					<p class="mt-2 text-sm text-base-content/70">
						Create your account for <span class="font-medium">{data.email}</span> to access the admin
						area.
					</p>
					<p class="mt-2 text-xs text-base-content/60">
						After sign-up you will set up an authenticator app (for example Google Authenticator)
						before you can open the admin panel.
					</p>
				{/if}
			</div>

			{#if actionError}
				<div class="alert alert-error text-sm" role="alert">
					<span>{actionError}</span>
				</div>
			{/if}

			{#if !data.invalid}
				<button
					type="button"
					class="btn btn-primary btn-block gap-2"
					disabled={submitting}
					aria-busy={submitting}
					onclick={acceptWithGithub}
				>
					{#if submitting}
						<span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
					{:else}
						<GithubIcon />
					{/if}
					Accept with GitHub
				</button>

				<div class="divider my-0 text-xs">or</div>

				<form class="flex flex-col gap-4" onsubmit={acceptWithEmail}>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Email</span>
						</div>
						<input type="email" class="input input-bordered w-full" value={data.email} readonly />
					</label>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Name</span>
						</div>
						<input
							type="text"
							class="input input-bordered w-full"
							autocomplete="name"
							required
							bind:value={name}
						/>
					</label>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Password</span>
						</div>
						<input
							type="password"
							class="input input-bordered w-full"
							autocomplete="new-password"
							minlength="8"
							required
							bind:value={password}
						/>
					</label>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Confirm password</span>
						</div>
						<input
							type="password"
							class="input input-bordered w-full"
							autocomplete="new-password"
							minlength="8"
							required
							bind:value={confirmPassword}
						/>
					</label>
					<button
						type="submit"
						class="btn btn-outline btn-block"
						disabled={submitting}
						aria-busy={submitting}
					>
						{#if submitting}
							<span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
						{/if}
						Accept with email
					</button>
				</form>
			{/if}

			<a href={resolve('/admin/login')} class="btn btn-ghost btn-sm">Admin sign in</a>
		</div>
	</div>
</main>
