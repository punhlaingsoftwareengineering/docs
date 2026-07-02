<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminFormTable from '$lib/components/admin/AdminFormTable.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import FormAlert from '$lib/components/FormAlert.svelte';
	import defaultFavicon from '$lib/assets/favicon.svg';
	import { confirmEnhance, formEnhance } from '$lib/utils/form-enhance';

	let { data, form } = $props();

	const s = $derived(data.settings);
	const landing = $derived(data.landingForm);
	const iconPreviewHref = $derived(data.siteIconHref ?? defaultFavicon);
	const footerSocialLinksJson = $derived(JSON.stringify(s.footerSocialLinks ?? [], null, 2));
	const navLinksJson = $derived(JSON.stringify(s.navLinks ?? [], null, 2));
</script>

<AdminHeader
	title="Settings"
	breadcrumbs={[{ label: 'Admin', href: resolve('/admin') }, { label: 'Settings' }]}
/>

<div class="flex min-w-0 flex-1 flex-col space-y-8 p-4 sm:p-6">
	<FormAlert {form} />

	<section class="w-full min-w-0 space-y-4">
		<h2 class="text-lg font-semibold">Site</h2>
		<AdminFormTable>
			<tr>
				<td class="align-top p-0 pt-3">
					<span class="label py-0"><span class="label-text">Site icon</span></span>
				</td>
				<td class="min-w-0 p-0" colspan="3">
					<div class="flex flex-wrap items-start gap-4">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-box border border-base-300 bg-base-200 p-2"
						>
							<img src={iconPreviewHref} alt="" class="max-h-full max-w-full object-contain" />
						</div>
						<div class="min-w-0 flex-1 space-y-2">
							<p class="text-sm text-base-content/70">
								Used as the favicon and in the navbar. PNG, JPEG, WebP, SVG, or ICO up to 512 KB.
							</p>
							<form
								method="POST"
								action="?/uploadSiteIcon"
								enctype="multipart/form-data"
								use:enhance={formEnhance}
								class="flex flex-wrap items-center gap-2"
							>
								<input
									type="file"
									name="siteIcon"
									accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico"
									class="file-input file-input-bordered file-input-sm w-full max-w-md"
									required
								/>
								<button type="submit" class="btn btn-primary btn-sm">Upload icon</button>
							</form>
							{#if data.hasCustomSiteIcon}
								<form method="POST" action="?/removeSiteIcon" use:enhance={formEnhance}>
									<button type="submit" class="btn btn-ghost btn-sm">Remove custom icon</button>
								</form>
							{/if}
						</div>
					</div>
				</td>
			</tr>
		</AdminFormTable>

		<form
			method="POST"
			action="?/updateSettings"
			use:enhance={formEnhance}
			class="flex w-full min-w-0 flex-col space-y-8"
		>
			<AdminFormTable>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="siteTitle"
							><span class="label-text">Site title</span></label
						>
					</td>
					<td class="min-w-0 p-0">
						<input
							id="siteTitle"
							name="siteTitle"
							class="input input-bordered w-full"
							value={s.siteTitle}
						/>
					</td>
					<td class="align-middle p-0">
						<label class="label py-0" for="tagline"><span class="label-text">Tagline</span></label>
					</td>
					<td class="min-w-0 p-0">
						<input
							id="tagline"
							name="tagline"
							class="input input-bordered w-full"
							value={s.tagline}
						/>
					</td>
				</tr>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="copyrightNotice"
							><span class="label-text">Copyright notice</span></label
						>
					</td>
					<td class="min-w-0 p-0" colspan="3">
						<input
							id="copyrightNotice"
							name="copyrightNotice"
							class="input input-bordered w-full"
							value={s.copyrightNotice}
							placeholder="zarnihlawn.com"
						/>
						<p class="mt-1 text-xs text-base-content/60">
							Shown in the footer as © {new Date().getFullYear()} [notice].
						</p>
					</td>
				</tr>
				<tr>
					<td class="min-w-0 p-0" colspan="4">
						<label class="label cursor-pointer justify-start gap-3 py-0">
							<input
								type="checkbox"
								class="checkbox"
								checked={s.navLinksEnabled}
								onchange={(e) => {
									const input = e.currentTarget.form?.querySelector<HTMLInputElement>(
										'input[name="navLinksEnabled"]'
									);
									if (input) input.value = e.currentTarget.checked ? 'true' : 'false';
								}}
							/>
							<span class="label-text">Show links in navbar</span>
						</label>
						<input
							type="hidden"
							name="navLinksEnabled"
							value={s.navLinksEnabled ? 'true' : 'false'}
						/>
					</td>
				</tr>
				<tr>
					<td class="align-top p-0 pt-3">
						<label class="label py-0" for="navLinks"
							><span class="label-text">Navbar links</span></label
						>
					</td>
					<td class="min-w-0 p-0" colspan="3">
						<textarea
							id="navLinks"
							name="navLinks"
							class="textarea textarea-bordered w-full font-mono text-sm"
							rows="6">{navLinksJson}</textarea
						>
						<p class="mt-1 text-xs text-base-content/60">
							JSON array of <code>label</code> and <code>url</code> objects. Shown in the navbar center
							on large screens and in the mobile menu when enabled.
						</p>
					</td>
				</tr>
				<tr>
					<td class="min-w-0 p-0" colspan="4">
						<label class="label cursor-pointer justify-start gap-3 py-0">
							<input
								type="checkbox"
								class="checkbox"
								checked={s.footerSocialEnabled}
								onchange={(e) => {
									const input = e.currentTarget.form?.querySelector<HTMLInputElement>(
										'input[name="footerSocialEnabled"]'
									);
									if (input) input.value = e.currentTarget.checked ? 'true' : 'false';
								}}
							/>
							<span class="label-text">Show social links in footer</span>
						</label>
						<input
							type="hidden"
							name="footerSocialEnabled"
							value={s.footerSocialEnabled ? 'true' : 'false'}
						/>
					</td>
				</tr>
				<tr>
					<td class="align-top p-0 pt-3">
						<label class="label py-0" for="footerSocialLinks"
							><span class="label-text">Social links</span></label
						>
					</td>
					<td class="min-w-0 p-0" colspan="3">
						<textarea
							id="footerSocialLinks"
							name="footerSocialLinks"
							class="textarea textarea-bordered w-full font-mono text-sm"
							rows="6">{footerSocialLinksJson}</textarea
						>
						<p class="mt-1 text-xs text-base-content/60">
							JSON array of <code>label</code> and <code>url</code> objects. Shown in the footer bar when
							social links are enabled.
						</p>
					</td>
				</tr>
				<tr>
					<td class="align-top p-0 pt-3">
						<label class="label py-0" for="metaDescription"
							><span class="label-text">Meta description</span></label
						>
					</td>
					<td class="min-w-0 p-0" colspan="3">
						<textarea
							id="metaDescription"
							name="metaDescription"
							class="textarea textarea-bordered w-full"
							rows="2">{s.metaDescription}</textarea
						>
					</td>
				</tr>
			</AdminFormTable>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Landing hero</h2>
				<AdminFormTable>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="heroTitle"
								><span class="label-text">Hero title</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<input
								id="heroTitle"
								name="heroTitle"
								class="input input-bordered w-full"
								value={s.heroTitle}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="heroSubtitle"
								><span class="label-text">Hero subtitle</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
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
						<td class="min-w-0 p-0">
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
						<td class="min-w-0 p-0">
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
						<td class="min-w-0 p-0">
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
						<td class="min-w-0 p-0">
							<input
								id="heroSecondaryUrl"
								name="heroSecondaryUrl"
								class="input input-bordered w-full"
								value={s.heroSecondaryUrl}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="heroSearchPlaceholder"
								><span class="label-text">Search placeholder</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<input
								id="heroSearchPlaceholder"
								name="heroSearchPlaceholder"
								class="input input-bordered w-full"
								value={landing.heroSearchPlaceholder}
							/>
						</td>
					</tr>
				</AdminFormTable>
			</section>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Tech stack strip</h2>
				<AdminFormTable>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="techStackHeading"
								><span class="label-text">Section heading</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<input
								id="techStackHeading"
								name="techStackHeading"
								class="input input-bordered w-full"
								value={landing.techStackHeading}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="techStackItems"
								><span class="label-text">Stack badges</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<textarea
								id="techStackItems"
								name="techStackItems"
								class="textarea textarea-bordered w-full font-mono text-sm"
								rows="6">{landing.techStackItems}</textarea
							>
							<p class="mt-1 text-xs text-base-content/60">One badge label per line.</p>
						</td>
					</tr>
				</AdminFormTable>
			</section>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Features grid</h2>
				<AdminFormTable>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="featuresHeading"
								><span class="label-text">Section heading</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<input
								id="featuresHeading"
								name="featuresHeading"
								class="input input-bordered w-full"
								value={landing.featuresHeading}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="featuresSubtitle"
								><span class="label-text">Section subtitle</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<textarea
								id="featuresSubtitle"
								name="featuresSubtitle"
								class="textarea textarea-bordered w-full"
								rows="2">{landing.featuresSubtitle}</textarea
							>
						</td>
					</tr>
					<tr>
						<td class="min-w-0 p-0" colspan="4">
							<p class="text-sm text-base-content/60">
								Category cards are generated from your documentation categories and published
								documents. Edit category descriptions below to customize each card.
							</p>
						</td>
					</tr>
				</AdminFormTable>
			</section>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Welcome video</h2>
				<AdminFormTable>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="codePreviewHeading"
								><span class="label-text">Section heading</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<input
								id="codePreviewHeading"
								name="codePreviewHeading"
								class="input input-bordered w-full"
								value={landing.codePreviewHeading}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="codePreviewSubtitle"
								><span class="label-text">Section subtitle</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<textarea
								id="codePreviewSubtitle"
								name="codePreviewSubtitle"
								class="textarea textarea-bordered w-full"
								rows="2">{landing.codePreviewSubtitle}</textarea
							>
						</td>
					</tr>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="welcomeVideoUrl"
								><span class="label-text">Video URL</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<input
								id="welcomeVideoUrl"
								name="welcomeVideoUrl"
								type="url"
								inputmode="url"
								autocomplete="url"
								class="input input-bordered w-full"
								value={landing.welcomeVideoUrl}
								placeholder="https://www.youtube.com/watch?v=..."
							/>
							<p class="mt-1 text-xs text-base-content/60">
								YouTube, Vimeo, or a direct <code class="text-xs">https://</code> video file
								(mp4, webm). Shown on the home page for new and returning employees.
							</p>
						</td>
					</tr>
				</AdminFormTable>
			</section>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Category cards</h2>
				<input type="hidden" name="docsCategoriesHeading" value={landing.docsCategoriesHeading} />
				<input type="hidden" name="docsCategoriesSubtitle" value={landing.docsCategoriesSubtitle} />
				<AdminFormTable>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="docsCategoriesCtaLabel"
								><span class="label-text">CTA label</span></label
							>
						</td>
						<td class="min-w-0 p-0">
							<input
								id="docsCategoriesCtaLabel"
								name="docsCategoriesCtaLabel"
								class="input input-bordered w-full"
								value={landing.docsCategoriesCtaLabel}
							/>
						</td>
						<td class="align-middle p-0">
							<label class="label py-0" for="docsCategoriesCtaUrl"
								><span class="label-text">CTA URL</span></label
							>
						</td>
						<td class="min-w-0 p-0">
							<input
								id="docsCategoriesCtaUrl"
								name="docsCategoriesCtaUrl"
								class="input input-bordered w-full"
								value={landing.docsCategoriesCtaUrl}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="docsCategoryDescriptions"
								><span class="label-text">Category descriptions</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<textarea
								id="docsCategoryDescriptions"
								name="docsCategoryDescriptions"
								class="textarea textarea-bordered w-full font-mono text-sm"
								rows="8">{landing.docsCategoryDescriptions}</textarea
							>
							<p class="mt-1 text-xs text-base-content/60">
								JSON object keyed by category slug. Cards load from your categories:
								{data.categories.map((cat) => cat.slug).join(', ') || 'none yet'}.
							</p>
						</td>
					</tr>
				</AdminFormTable>
			</section>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Bottom call to action</h2>
				<AdminFormTable>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="landingCtaHeading"
								><span class="label-text">Section heading</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<input
								id="landingCtaHeading"
								name="landingCtaHeading"
								class="input input-bordered w-full"
								value={landing.landingCtaHeading}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-top p-0 pt-3">
							<label class="label py-0" for="landingCtaSubtitle"
								><span class="label-text">Section subtitle</span></label
							>
						</td>
						<td class="min-w-0 p-0" colspan="3">
							<textarea
								id="landingCtaSubtitle"
								name="landingCtaSubtitle"
								class="textarea textarea-bordered w-full"
								rows="2">{landing.landingCtaSubtitle}</textarea
							>
						</td>
					</tr>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="landingCtaPrimaryLabel"
								><span class="label-text">Primary CTA label</span></label
							>
						</td>
						<td class="min-w-0 p-0">
							<input
								id="landingCtaPrimaryLabel"
								name="landingCtaPrimaryLabel"
								class="input input-bordered w-full"
								value={landing.landingCtaPrimaryLabel}
							/>
						</td>
						<td class="align-middle p-0">
							<label class="label py-0" for="landingCtaPrimaryUrl"
								><span class="label-text">Primary CTA URL</span></label
							>
						</td>
						<td class="min-w-0 p-0">
							<input
								id="landingCtaPrimaryUrl"
								name="landingCtaPrimaryUrl"
								class="input input-bordered w-full"
								value={landing.landingCtaPrimaryUrl}
							/>
						</td>
					</tr>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="landingCtaSecondaryLabel"
								><span class="label-text">Secondary CTA label</span></label
							>
						</td>
						<td class="min-w-0 p-0">
							<input
								id="landingCtaSecondaryLabel"
								name="landingCtaSecondaryLabel"
								class="input input-bordered w-full"
								value={landing.landingCtaSecondaryLabel}
							/>
						</td>
						<td class="align-middle p-0">
							<label class="label py-0" for="landingCtaSecondaryUrl"
								><span class="label-text">Secondary CTA URL</span></label
							>
						</td>
						<td class="min-w-0 p-0">
							<input
								id="landingCtaSecondaryUrl"
								name="landingCtaSecondaryUrl"
								class="input input-bordered w-full"
								value={landing.landingCtaSecondaryUrl}
							/>
						</td>
					</tr>
				</AdminFormTable>
			</section>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Document defaults</h2>
				<AdminFormTable>
					<tr>
						<td class="min-w-0 p-0" colspan="4">
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
							<input
								type="hidden"
								name="defaultPublished"
								value={s.defaultPublished ? 'true' : 'false'}
							/>
						</td>
					</tr>
				</AdminFormTable>
			</section>

			<section class="w-full min-w-0 space-y-4">
				<h2 class="text-lg font-semibold">Appearance</h2>
				<AdminFormTable>
					<tr>
						<td class="align-middle p-0">
							<label class="label py-0" for="defaultTheme"
								><span class="label-text">Default public theme</span></label
							>
						</td>
						<td class="min-w-0 p-0">
							<select
								id="defaultTheme"
								name="defaultTheme"
								class="select select-bordered w-full"
								value={s.defaultTheme}
							>
								<option value="system">System</option>
								<option value="winter">Winter (light)</option>
								<option value="night">Night (dark)</option>
							</select>
						</td>
						<td class="p-0" colspan="2" aria-hidden="true"></td>
					</tr>
				</AdminFormTable>
			</section>

			<button type="submit" class="btn btn-primary">Save settings</button>
		</form>
	</section>

	<section class="w-full min-w-0 space-y-4 border-t border-base-300 pt-8">
		<h2 class="text-lg font-semibold">Account</h2>
		<AdminFormTable>
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
				<td class="min-w-0 p-0" colspan="3">
					<p class="font-medium">{data.user.name}</p>
					<p class="text-sm text-base-content/60">{data.user.email}</p>
				</td>
			</tr>
		</AdminFormTable>
		<form method="POST" action="?/signOut" use:enhance={formEnhance}>
			<button type="submit" class="btn btn-outline btn-sm">Sign out</button>
		</form>
	</section>

	<section class="w-full min-w-0 space-y-4 border-t border-base-300 pt-8">
		<h2 class="text-lg font-semibold text-error">Danger zone</h2>
		<form
			method="POST"
			action="?/deleteDrafts"
			use:enhance={confirmEnhance('Delete all draft documents?')}
		>
			<button type="submit" class="btn btn-error btn-outline btn-sm">Delete all drafts</button>
		</form>
	</section>
</div>
