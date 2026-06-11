<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	let { data, form } = $props();

	const s = $derived(data.settings);
</script>

<AdminHeader
	title="Settings"
	breadcrumbs={[
		{ label: 'Admin', href: resolve('/admin') },
		{ label: 'Settings' }
	]}
/>

<div class="flex-1 space-y-8 p-6">
	{#if form?.success}
		<div class="alert alert-success">
			<span>Settings saved.</span>
		</div>
	{/if}

	<form method="POST" action="?/updateSettings" use:enhance class="space-y-8">
		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Site</h2>
			<div class="grid gap-4 lg:grid-cols-2">
				<div class="form-control">
					<label class="label" for="siteTitle"><span class="label-text">Site title</span></label>
					<input id="siteTitle" name="siteTitle" class="input input-bordered" value={s.siteTitle} />
				</div>
				<div class="form-control">
					<label class="label" for="tagline"><span class="label-text">Tagline</span></label>
					<input id="tagline" name="tagline" class="input input-bordered" value={s.tagline} />
				</div>
			</div>
			<div class="form-control">
				<label class="label" for="metaDescription"><span class="label-text">Meta description</span></label>
				<textarea id="metaDescription" name="metaDescription" class="textarea textarea-bordered" rows="2">{s.metaDescription}</textarea>
			</div>
		</section>

		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Landing hero</h2>
			<div class="form-control">
				<label class="label" for="heroTitle"><span class="label-text">Hero title</span></label>
				<input id="heroTitle" name="heroTitle" class="input input-bordered" value={s.heroTitle} />
			</div>
			<div class="form-control">
				<label class="label" for="heroSubtitle"><span class="label-text">Hero subtitle</span></label>
				<textarea id="heroSubtitle" name="heroSubtitle" class="textarea textarea-bordered" rows="3">{s.heroSubtitle}</textarea>
			</div>
			<div class="grid gap-4 lg:grid-cols-2">
				<div class="form-control">
					<label class="label" for="heroPrimaryCta"><span class="label-text">Primary CTA label</span></label>
					<input id="heroPrimaryCta" name="heroPrimaryCta" class="input input-bordered" value={s.heroPrimaryCta} />
				</div>
				<div class="form-control">
					<label class="label" for="heroPrimaryUrl"><span class="label-text">Primary CTA URL</span></label>
					<input id="heroPrimaryUrl" name="heroPrimaryUrl" class="input input-bordered" value={s.heroPrimaryUrl} />
				</div>
				<div class="form-control">
					<label class="label" for="heroSecondaryCta"><span class="label-text">Secondary CTA label</span></label>
					<input id="heroSecondaryCta" name="heroSecondaryCta" class="input input-bordered" value={s.heroSecondaryCta} />
				</div>
				<div class="form-control">
					<label class="label" for="heroSecondaryUrl"><span class="label-text">Secondary CTA URL</span></label>
					<input id="heroSecondaryUrl" name="heroSecondaryUrl" class="input input-bordered" value={s.heroSecondaryUrl} />
				</div>
			</div>
		</section>

		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Document defaults</h2>
			<label class="label cursor-pointer justify-start gap-3">
				<input
					type="checkbox"
					class="checkbox"
					checked={s.defaultPublished}
					onchange={(e) => {
						const input = e.currentTarget.form?.querySelector<HTMLInputElement>(
							'input[name="defaultPublished"]'
						);
						if (input) input.value = e.currentTarget.checked ? 'true' : 'false';
					}}
				/>
				<span class="label-text">New documents published by default</span>
			</label>
			<input type="hidden" name="defaultPublished" value={s.defaultPublished ? 'true' : 'false'} />
		</section>

		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Appearance</h2>
			<div class="form-control max-w-xs">
				<label class="label" for="defaultTheme"><span class="label-text">Default public theme</span></label>
				<select id="defaultTheme" name="defaultTheme" class="select select-bordered" value={s.defaultTheme}>
					<option value="system">System</option>
					<option value="winter">Winter (light)</option>
					<option value="night">Night (dark)</option>
				</select>
			</div>
		</section>

		<button type="submit" class="btn btn-primary">Save settings</button>
	</form>

	<section class="space-y-4 border-t border-base-300 pt-8">
		<h2 class="text-lg font-semibold">Account</h2>
		<div class="flex items-center gap-4">
			<div class="avatar">
				<div class="w-12 rounded-full">
					{#if data.user.image}
						<img src={data.user.image} alt="" />
					{/if}
				</div>
			</div>
			<div>
				<p class="font-medium">{data.user.name}</p>
				<p class="text-sm text-base-content/60">{data.user.email}</p>
			</div>
		</div>
		<form method="POST" action="?/signOut">
			<button type="submit" class="btn btn-outline btn-sm">Sign out</button>
		</form>
	</section>

	<section class="space-y-4 border-t border-base-300 pt-8">
		<h2 class="text-lg font-semibold text-error">Danger zone</h2>
		<form
			method="POST"
			action="?/deleteDrafts"
			use:enhance
			onsubmit={(e) => !confirm('Delete all draft documents?') && e.preventDefault()}
		>
			<button type="submit" class="btn btn-error btn-outline btn-sm">Delete all drafts</button>
		</form>
	</section>
</div>
