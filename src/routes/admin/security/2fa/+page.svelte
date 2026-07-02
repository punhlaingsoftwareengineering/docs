<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_APP_NAME } from '$app/env/public';
	import TotpQrCode from '$lib/components/auth/TotpQrCode.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import { authClient } from '$lib/auth-client';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Step = 'password' | 'setup' | 'verify' | 'backup';

	const initialStep = $derived<Step>(data.hasCredentialPassword ? 'setup' : 'password');
	let stepOverride = $state<Step | null>(null);
	const step = $derived(stepOverride ?? initialStep);
	let submitting = $state(false);
	let actionError = $state('');

	let newPassword = $state('');
	let confirmPassword = $state('');
	let accountPassword = $state('');
	let totpCode = $state('');
	let totpUri = $state('');
	let backupCodes = $state<string[]>([]);
	let trustDevice = $state(false);

	async function setAccountPassword(event: SubmitEvent) {
		event.preventDefault();
		if (submitting) return;

		actionError = '';
		if (newPassword !== confirmPassword) {
			actionError = 'Passwords do not match.';
			return;
		}
		if (newPassword.length < 8) {
			actionError = 'Password must be at least 8 characters.';
			return;
		}

		submitting = true;
		const { error } = await authClient.$fetch('/set-password', {
			method: 'POST',
			body: { newPassword }
		});

		if (error) {
			actionError = error.message || 'Could not set password.';
			submitting = false;
			return;
		}

		accountPassword = newPassword;
		newPassword = '';
		confirmPassword = '';
		submitting = false;
		await startTotpSetup();
	}

	async function startTotpSetup() {
		if (submitting) return;

		actionError = '';
		if (!accountPassword) {
			actionError = 'Enter your account password to continue.';
			return;
		}

		submitting = true;
		const { data: enableData, error } = await authClient.twoFactor.enable({
			password: accountPassword,
			issuer: PUBLIC_APP_NAME
		});

		if (error || !enableData) {
			actionError = error?.message || 'Could not start authenticator setup.';
			submitting = false;
			return;
		}

		totpUri = enableData.totpURI;
		backupCodes = enableData.backupCodes;
		stepOverride = 'verify';
		submitting = false;
	}

	async function verifyEnrollment(event: SubmitEvent) {
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

		stepOverride = 'backup';
		submitting = false;
	}

	async function finishEnrollment() {
		await goto('/admin');
	}
</script>

<AdminHeader title="Set up authenticator" />

<main class="flex flex-1 justify-center px-4 py-6 sm:px-6 sm:py-10">
	<div class="card card-border w-full max-w-lg bg-base-200 shadow-xl">
		<div class="card-body gap-6">
			<div>
				<h2 class="text-xl font-bold">Two-factor authentication required</h2>
				<p class="mt-2 text-sm text-base-content/70">
					Scan a QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
					before you can manage documentation.
				</p>
			</div>

			{#if actionError}
				<div class="alert alert-error text-sm" role="alert">
					<span>{actionError}</span>
				</div>
			{/if}

			{#if step === 'password'}
				<form class="flex flex-col gap-4" onsubmit={setAccountPassword}>
					<p class="text-sm text-base-content/70">
						Set a local password for your account. You will need it to manage your authenticator and
						to sign in with email.
					</p>
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
							bind:value={newPassword}
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
						class="btn btn-primary btn-block"
						disabled={submitting}
						aria-busy={submitting}
					>
						{#if submitting}
							<span class="loading loading-spinner loading-sm" aria-hidden="true"></span>
						{/if}
						Continue
					</button>
				</form>
			{:else if step === 'setup'}
				<form
					class="flex flex-col gap-4"
					onsubmit={(e) => {
						e.preventDefault();
						void startTotpSetup();
					}}
				>
					<label class="form-control w-full">
						<div class="label py-0">
							<span class="label-text">Account password</span>
						</div>
						<input
							type="password"
							class="input input-bordered w-full"
							autocomplete="current-password"
							required
							bind:value={accountPassword}
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
						Generate QR code
					</button>
				</form>
			{:else if step === 'verify'}
				<div class="flex flex-col items-center gap-4">
					<TotpQrCode uri={totpUri} />
					<p class="text-center text-xs text-base-content/60">
						Or enter this secret manually in your authenticator app if you cannot scan the QR code.
					</p>
				</div>
				<form class="flex flex-col gap-4" onsubmit={verifyEnrollment}>
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
						Verify and enable
					</button>
				</form>
			{:else}
				<div class="flex flex-col gap-4">
					<p class="text-sm text-base-content/70">
						Save these backup codes somewhere safe. Each code works once if you lose access to your
						authenticator app.
					</p>
					<ul class="rounded-box border border-base-300 bg-base-100 p-4 font-mono text-sm">
						{#each backupCodes as code (code)}
							<li>{code}</li>
						{/each}
					</ul>
					<button type="button" class="btn btn-primary btn-block" onclick={finishEnrollment}>
						Continue to admin
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>
