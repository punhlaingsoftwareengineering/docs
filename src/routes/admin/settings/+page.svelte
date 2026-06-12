<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import FormAlert from '$lib/components/FormAlert.svelte';
	import { formEnhance } from '$lib/utils/form-enhance';

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
	<FormAlert {form} />

	<form method="POST" action="?/updateSettings" use:enhance={formEnhance} class="space-y-8">
		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Site</h2>
			<table class="table w-full max-w-6xl border-separate [border-spacing:0.75rem]">
				<colgroup>
					<col class="w-[11%]" />
					<col class="w-[22%]" />
					<col class="w-[11%]" />
					<col class="w-[22%]" />
					<col class="w-[11%]" />
					<col class="w-[23%]" />
				</colgroup>
				<tbody>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="siteTitle"><span class="label-text">Site title</span></label>
						</td>
						<td class="p-0" colspan="2">
							<input id="siteTitle" name="siteTitle" class="input input-bordered w-full" value={s.siteTitle} />
						</td>
						<td class="align-middle p-0">
							<label class="label py-0" for="tagline"><span class="label-text">Tagline</span></label>
						</td>
						<td class="p-0" colspan="2">
							<input id="tagline" name="tagline" class="input input-bordered w-full" value={s.tagline} />
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="metaDescription"
								><span class="label-text">Meta description</span></label
							>
						</td>
						<td class="p-0" colspan="5">
							<textarea
								id="metaDescription"
								name="metaDescription"
								class="textarea textarea-bordered w-full"
								rows="2">{s.metaDescription}</textarea
							>
						</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Landing hero</h2>
			<table class="table w-full max-w-6xl border-separate [border-spacing:0.75rem]">
				<colgroup>
					<col class="w-[11%]" />
					<col class="w-[22%]" />
					<col class="w-[11%]" />
					<col class="w-[22%]" />
					<col class="w-[11%]" />
					<col class="w-[23%]" />
				</colgroup>
				<tbody>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="heroTitle"><span class="label-text">Hero title</span></label>
						</td>
						<td class="p-0" colspan="5">
							<input id="heroTitle" name="heroTitle" class="input input-bordered w-full" value={s.heroTitle} />
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="heroSubtitle"
								><span class="label-text">Hero subtitle</span></label
							>
						</td>
						<td class="p-0" colspan="5">
							<textarea
								id="heroSubtitle"
								name="heroSubtitle"
								class="textarea textarea-bordered w-full"
								rows="3">{s.heroSubtitle}</textarea
							>
						</td>
					</tr>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="heroPrimaryCta"
								><span class="label-text">Primary CTA label</span></label
							>
						</td>
						<td class="p-0" colspan="2">
							<input
								id="heroPrimaryCta"
								name="heroPrimaryCta"
								class="input input-bordered w-full"
								value={s.heroPrimaryCta}
							/>
						</td>
						<td class="align-middle p-0">
							<label class="label py-0" for="heroPrimaryUrl"
								><span class="label-text">Primary CTA URL</span></label
							>
						</td>
						<td class="p-0" colspan="2">
							<input
								id="heroPrimaryUrl"
								name="heroPrimaryUrl"
								class="input input-bordered w-full"
								value={s.heroPrimaryUrl}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="heroSecondaryCta"
								><span class="label-text">Secondary CTA label</span></label
							>
						</td>
						<td class="p-0" colspan="2">
							<input
								id="heroSecondaryCta"
								name="heroSecondaryCta"
								class="input input-bordered w-full"
								value={s.heroSecondaryCta}
							/>
						</td>
						<td class="align-middle p-0">
							<label class="label py-0" for="heroSecondaryUrl"
								><span class="label-text">Secondary CTA URL</span></label
							>
						</td>
						<td class="p-0" colspan="2">
							<input
								id="heroSecondaryUrl"
								name="heroSecondaryUrl"
								class="input input-bordered w-full"
								value={s.heroSecondaryUrl}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Document defaults</h2>
			<table class="table w-full max-w-6xl border-separate [border-spacing:0.75rem]">
				<tbody>
					<tr>
						<td class="p-0" colspan="6">
							<label class="label cursor-pointer justify-start gap-3 py-0">
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
						</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section class="space-y-4">
			<h2 class="text-lg font-semibold">Appearance</h2>
			<table class="table w-full max-w-6xl border-separate [border-spacing:0.75rem]">
				<colgroup>
					<col class="w-[11%]" />
					<col class="w-[22%]" />
					<col class="w-[11%]" />
					<col class="w-[22%]" />
					<col class="w-[11%]" />
					<col class="w-[23%]" />
				</colgroup>
				<tbody>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="defaultTheme"
								><span class="label-text">Default public theme</span></label
							>
						</td>
						<td class="p-0" colspan="2">
							<select id="defaultTheme" name="defaultTheme" class="select select-bordered w-full" value={s.defaultTheme}>
								<option value="system">System</option>
								<option value="winter">Winter (light)</option>
								<option value="night">Night (dark)</option>
							</select>
						</td>
						<td class="p-0" colspan="3"></td>
					</tr>
				</tbody>
			</table>
		</section>

		<button type="submit" class="btn btn-primary">Save settings</button>
	</form>

	<section class="space-y-4 border-t border-base-300 pt-8">
		<h2 class="text-lg font-semibold">Account</h2>
		<table class="table w-full max-w-6xl border-separate [border-spacing:0.75rem]">
			<tbody>
				<tr>
					<td class="w-16 p-0">
						<div class="avatar">
							<div class="w-12 rounded-full">
								{#if data.user.image}
									<img src={data.user.image} alt="" />
								{/if}
							</div>
						</div>
					</td>
					<td class="p-0" colspan="5">
						<p class="font-medium">{data.user.name}</p>
						<p class="text-sm text-base-content/60">{data.user.email}</p>
					</td>
				</tr>
			</tbody>
		</table>
		<form method="POST" action="?/signOut" use:enhance={formEnhance}>
			<button type="submit" class="btn btn-outline btn-sm">Sign out</button>
		</form>
	</section>

	<section class="space-y-4 border-t border-base-300 pt-8">
		<h2 class="text-lg font-semibold text-error">Danger zone</h2>
		<form
			method="POST"
			action="?/deleteDrafts"
			use:enhance={formEnhance}
			onsubmit={(e) => !confirm('Delete all draft documents?') && e.preventDefault()}
		>
			<button type="submit" class="btn btn-error btn-outline btn-sm">Delete all drafts</button>
		</form>
	</section>
</div>
