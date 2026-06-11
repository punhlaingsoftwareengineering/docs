import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { settingsFormSchema } from '$lib/schemas/settings';
import { deleteAllDrafts } from '$lib/server/services/docs';
import { getSiteSettings, updateSiteSettings } from '$lib/server/services/settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const settings = await getSiteSettings();
	return { settings, user: event.locals.user! };
};

export const actions: Actions = {
	updateSettings: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData());
		const parsed = settingsFormSchema.safeParse(raw);

		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors,
				values: raw
			});
		}

		await updateSiteSettings(parsed.data);
		return { success: true };
	},

	deleteDrafts: async () => {
		await deleteAllDrafts();
		return { draftsDeleted: true };
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
