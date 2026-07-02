<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { Copy, Trash2, UserMinus } from '@lucide/svelte';
	import AdminFormTable from '$lib/components/admin/AdminFormTable.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import FormAlert from '$lib/components/FormAlert.svelte';
	import { confirmEnhance, formEnhance } from '$lib/utils/form-enhance';
	import type { PageData } from './$types';

	type FormState = {
		message?: string;
		success?: boolean;
		action?: string;
		inviteUrl?: string;
		emailSent?: boolean;
		email?: string;
	} | null;

	let { data, form }: { data: PageData; form: FormState } = $props();

	let inviteEmail = $state('');
	let copyMessage = $state('');

	function invitationStatus(invite: PageData['invitations'][number]) {
		if (invite.acceptedAt) return 'Accepted';
		if (invite.revokedAt) return 'Revoked';
		if (invite.expiresAt <= new Date()) return 'Expired';
		return 'Pending';
	}

	function inviteUrl(token: string) {
		return `${window.location.origin}/invite/${token}`;
	}

	async function copyInviteLink(url: string) {
		await navigator.clipboard.writeText(url);
		copyMessage = 'Invite link copied.';
		setTimeout(() => {
			copyMessage = '';
		}, 2000);
	}
</script>

<AdminHeader
	title="Users"
	breadcrumbs={[{ label: 'Admin', href: resolve('/admin') }, { label: 'Users' }]}
/>

<div class="flex min-w-0 flex-1 flex-col space-y-8 p-4 sm:p-6">
	<FormAlert {form} />

	{#if copyMessage}
		<div class="alert alert-success text-sm" role="status">
			<span>{copyMessage}</span>
		</div>
	{/if}

	{#if form?.success && form.action === 'invite' && form.inviteUrl}
		<div class="alert alert-info text-sm">
			<div class="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<span>
					{form.message}
					{#if form.emailSent}
						Email sent to {form.email}.
					{/if}
				</span>
				<button
					type="button"
					class="btn btn-sm btn-ghost gap-2"
					onclick={() => void copyInviteLink(form.inviteUrl!)}
				>
					<Copy class="h-4 w-4" aria-hidden="true" />
					Copy invite link
				</button>
			</div>
		</div>
	{/if}

	<section class="w-full min-w-0 space-y-4">
		<h2 class="text-lg font-semibold">Invite admin</h2>
		<form method="POST" action="?/invite" use:enhance={formEnhance} class="w-full min-w-0">
			<AdminFormTable>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="invite-email"
							><span class="label-text">Email</span></label
						>
					</td>
					<td class="min-w-0 p-0">
						<input
							id="invite-email"
							name="email"
							type="email"
							class="input input-bordered w-full"
							required
							bind:value={inviteEmail}
						/>
					</td>
					<td class="p-0" aria-hidden="true"></td>
					<td class="min-w-0 p-0">
						<button type="submit" class="btn btn-primary">Send invitation</button>
					</td>
				</tr>
			</AdminFormTable>
		</form>
		<p class="text-xs text-base-content/60">
			Invitations expire after 7 days. If Gmail SMTP is not configured, copy the invite link from
			the success message.
		</p>
	</section>

	<section class="w-full min-w-0 space-y-4">
		<h2 class="text-lg font-semibold">Admin users</h2>
		<div class="overflow-x-auto rounded-box border border-base-300">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>2FA</th>
						<th>Joined</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each data.admins as admin (admin.id)}
						<tr class="hover">
							<td class="font-medium">{admin.name}</td>
							<td>{admin.email}</td>
							<td>
								{#if admin.twoFactorEnabled}
									<span class="badge badge-success badge-sm">Enabled</span>
								{:else}
									<span class="badge badge-warning badge-sm">Pending</span>
								{/if}
							</td>
							<td class="text-sm text-base-content/60">
								{new Date(admin.createdAt).toLocaleDateString()}
							</td>
							<td>
								{#if admin.id !== data.currentUserId}
									<form
										method="POST"
										action="?/removeAdmin"
										use:enhance={confirmEnhance(() => `Remove admin access for ${admin.email}?`)}
									>
										<input type="hidden" name="userId" value={admin.id} />
										<button
											type="submit"
											class="btn btn-error btn-sm btn-square shrink-0"
											aria-label="Remove {admin.name}"
										>
											<UserMinus class="h-4 w-4" aria-hidden="true" />
										</button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="w-full min-w-0 space-y-4">
		<h2 class="text-lg font-semibold">Invitations</h2>
		{#if data.invitations.length === 0}
			<div
				class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/60"
			>
				No invitations yet.
			</div>
		{:else}
			<div class="overflow-x-auto rounded-box border border-base-300">
				<table class="table w-full">
					<thead>
						<tr>
							<th>Email</th>
							<th>Status</th>
							<th>Expires</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each data.invitations as invite (invite.id)}
							<tr class="hover">
								<td>{invite.email}</td>
								<td>
									<span class="badge badge-ghost badge-sm">{invitationStatus(invite)}</span>
								</td>
								<td class="text-sm text-base-content/60">
									{new Date(invite.expiresAt).toLocaleDateString()}
								</td>
								<td>
									<div class="flex justify-end gap-1">
										{#if invitationStatus(invite) === 'Pending'}
											<button
												type="button"
												class="btn btn-ghost btn-sm btn-square"
												aria-label="Copy invite link for {invite.email}"
												onclick={() => void copyInviteLink(inviteUrl(invite.token))}
											>
												<Copy class="h-4 w-4" aria-hidden="true" />
											</button>
											<form method="POST" action="?/revoke" use:enhance={formEnhance}>
												<input type="hidden" name="id" value={invite.id} />
												<button
													type="submit"
													class="btn btn-error btn-sm btn-square"
													aria-label="Revoke invitation for {invite.email}"
												>
													<Trash2 class="h-4 w-4" aria-hidden="true" />
												</button>
											</form>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>
