<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import SiteNavbar from '$lib/components/layout/SiteNavbar.svelte';
	import { authClient } from '$lib/auth-client';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let submitting = $state(false);
	let actionError = $state('');
	let useBackupCode = $state(false);
	let totpCode = $state('');
	let backupCode = $state('');
	let trustDevice = $state(false);

	async function verifyTotp(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		actionError = '';
		submitting = true;

		const { error } = await authClient.twoFactor.verifyTotp({
			code: totpCode.trim(),
			trustDevice
		});

		if (error) {
			actionError = error.message || 'Invalid code. Try again.';
			submitting = false;
			return;
		}

		await goto('/admin');
	}

	async function verifyBackup(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		actionError = '';
		submitting = true;

		const { error } = await authClient.twoFactor.verifyBackupCode({
			code: backupCode.trim(),
			trustDevice
		});

		if (error) {
			actionError = error.message || 'Invalid backup code.';
			submitting = false;
			return;
		}

		await goto('/admin');
	}
</script>

<PageTitle title="Two-factor sign in" appName={data.site.appName} />

<SiteNavbar
	siteTitle={data.site.siteTitle}
	siteIconHref={data.site.siteIconHref}
	hasAdmin={data.auth.hasAdmin}
	isSignedIn={false}
	isAdmin={false}
	navLinksEnabled={data.site.navLinksEnabled}
	navLinks={data.site.navLinks}
/>

<main class="flex flex-1 items-center justify-center px-4 py-16">
	<div class="card card-border w-full max-w-md bg-base-200 shadow-xl">
		<div class="card-body gap-6">
			<div class="text-center">
				<h1 class="text-2xl font-bold">Authenticator code</h1>
				<p class="mt-2 text-sm text-base-content/70">
					Enter the 6-digit code from your authenticator app to finish signing in.
				</p>
			</div>

			{#if actionError}
				<div class="alert alert-error text-sm" role="alert">
					<span>{actionError}</span>
				</div>
			{/if}

			{#if useBackupCode}
				<form class="flex flex-col gap-4" onsubmit={verifyBackup}>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Backup code</span>
						</div>
						<input
							type="text"
							class="input input-bordered w-full font-mono"
							autocomplete="off"
							required
							bind:value={backupCode}
						/>
					</label>
					<label class="label cursor-pointer justify-start gap-3">
						<input type="checkbox" class="checkbox checkbox-sm" bind:checked={trustDevice} />
						<span class="label-text">Trust this device for 30 days</span>
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
						Verify backup code
					</button>
				</form>
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					onclick={() => {
						useBackupCode = false;
						actionError = '';
					}}
				>
					Use authenticator code instead
				</button>
			{:else}
				<form class="flex flex-col gap-4" onsubmit={verifyTotp}>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">6-digit code</span>
						</div>
						<input
							type="text"
							inputmode="numeric"
							pattern="[0-9]*"
							maxlength="8"
							class="input input-bordered w-full font-mono tracking-widest"
							autocomplete="one-time-code"
							required
							bind:value={totpCode}
						/>
					</label>
					<label class="label cursor-pointer justify-start gap-3">
						<input type="checkbox" class="checkbox checkbox-sm" bind:checked={trustDevice} />
						<span class="label-text">Trust this device for 30 days</span>
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
						Verify and continue
					</button>
				</form>
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					onclick={() => {
						useBackupCode = true;
						actionError = '';
					}}
				>
					Use a backup code instead
				</button>
			{/if}

			<a href={resolve('/admin/login')} class="btn btn-ghost btn-sm">Back to admin sign in</a>
		</div>
	</div>
</main>
