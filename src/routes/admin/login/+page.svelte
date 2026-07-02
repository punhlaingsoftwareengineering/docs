<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient, redirectToTwoFactor } from '$lib/auth-client';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import { resolve } from '$app/paths';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);
	let actionError = $state('');
	let showEmailSignIn = $state(false);

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	const loadError = $derived(data.error ?? '');
	const enrollPath = '/admin/security/2fa';

	async function signInWithGithub(requestSignUp: boolean) {
		submitting = true;
		actionError = '';

		const { error } = await authClient.signIn.social({
			provider: 'github',
			callbackURL: data.isBootstrap ? enrollPath : '/admin',
			errorCallbackURL: '/admin/login',
			requestSignUp
		});

		if (error) {
			actionError = error.message || 'Could not start GitHub sign-in.';
			submitting = false;
		}
	}

	async function createAdminWithEmail(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

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
			email: email.trim(),
			password,
			callbackURL: enrollPath
		});

		if (error) {
			actionError = error.message || 'Could not create admin account.';
			submitting = false;
			return;
		}

		await goto(enrollPath);
	}

	async function signInWithEmail(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		actionError = '';
		submitting = true;

		const { data: signInData, error } = await authClient.signIn.email({
			email: email.trim(),
			password,
			callbackURL: '/admin'
		});

		if (error) {
			actionError = error.message || 'Could not sign in.';
			submitting = false;
			return;
		}

		if ((signInData as { twoFactorRedirect?: boolean } | undefined)?.twoFactorRedirect) {
			redirectToTwoFactor();
			return;
		}

		await goto('/admin');
	}
</script>

<PageTitle
	title={data.isBootstrap ? 'Create admin account' : 'Admin sign in'}
	appName={data.site.appName}
/>

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
				<h1 class="text-2xl font-bold">
					{data.isBootstrap ? 'Create admin account' : 'Admin sign in'}
				</h1>
				<p class="mt-2 text-sm text-base-content/70">
					{#if data.isBootstrap}
						One-time setup for the first admin. Use GitHub, or email if GitHub sign-in fails on your
						network.
					{:else}
						Sign in with GitHub or email. New admins must accept an invitation.
					{/if}
				</p>
			</div>

			{#if loadError || actionError}
				<div class="alert alert-error text-sm" role="alert">
					<span>{loadError || actionError}</span>
				</div>
			{/if}

			{#if data.isBootstrap}
				<button
					type="button"
					class="btn btn-primary btn-block gap-2"
					disabled={submitting}
					aria-busy={submitting}
					onclick={() => signInWithGithub(true)}
				>
					{#if submitting}
						<span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
					{:else}
						<GithubIcon />
					{/if}
					Create admin with GitHub
				</button>

				<div class="divider my-0 text-xs">or</div>

				<form class="flex flex-col gap-4" onsubmit={createAdminWithEmail}>
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
						Create admin with email
					</button>
				</form>
				<p class="text-center text-xs text-base-content/50">
					This form is only available until the first admin account exists.
				</p>
			{:else if showEmailSignIn}
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
					onclick={() => signInWithGithub(false)}
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

			<a href={resolve('/login')} class="btn btn-ghost btn-sm">User sign in</a>
			<a href={resolve('/')} class="btn btn-ghost btn-sm">Back to documentation</a>
		</div>
	</div>
</main>
