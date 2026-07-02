import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { settingsFormSchema } from '$lib/schemas/settings';
import { deleteAllDrafts } from '$lib/server/services/docs';
import { clearSiteIcon, saveSiteIcon } from '$lib/server/services/site-icon';
import { landingSettingsFormValues } from '$lib/landing/resolve-settings';
import { listCategories } from '$lib/server/services/categories';
import { getSiteSettings, updateSiteSettings } from '$lib/server/services/settings';
import { getSiteIconHref, hasCustomSiteIcon } from '$lib/utils/site-icon';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const [settings, categories] = await Promise.all([getSiteSettings(), listCategories()]);
	return {
		settings,
		landingForm: landingSettingsFormValues(settings),
		categories,
		siteIconHref: getSiteIconHref(settings),
		hasCustomSiteIcon: hasCustomSiteIcon(settings),
		user: event.locals.user!
	};
};

export const actions: Actions = {
	updateSettings: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData());
		const parsed = settingsFormSchema.safeParse(raw);

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			const formErrors = parsed.error.flatten().formErrors;
			const first =
				formErrors[0] ??
				Object.values(errors).flat()[0] ??
				'Please check your settings and try again.';
			return fail(400, {
				message: first,
				errors,
				values: raw
			});
		}

		await updateSiteSettings(parsed.data);
		return { success: true, message: 'Settings saved.' };
	},

	uploadSiteIcon: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('siteIcon');

		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { message: 'Choose an icon file to upload.' });
		}

		try {
			await saveSiteIcon(file);
			return { success: true, message: 'Site icon updated.' };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Could not upload site icon.';
			return fail(400, { message });
		}
	},

	removeSiteIcon: async () => {
		try {
			await clearSiteIcon();
			return { success: true, message: 'Site icon removed.' };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Could not remove site icon.';
			return fail(400, { message });
		}
	},

	deleteDrafts: async () => {
		await deleteAllDrafts();
		return { success: true, message: 'All draft documents deleted.' };
	},

	signOut: async (event) => {
		try {
			await auth.api.signOut({ headers: event.request.headers });
		} catch (error) {
			if (isRedirect(error)) throw error;
		}
		return redirect(302, '/');
	}
};
