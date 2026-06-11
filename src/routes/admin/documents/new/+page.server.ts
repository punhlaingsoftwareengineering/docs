import { fail, redirect } from '@sveltejs/kit';
import { documentFormSchema } from '$lib/schemas/document';
import { listCategories } from '$lib/server/services/categories';
import { createDocument } from '$lib/server/services/docs';
import { getSiteSettings } from '$lib/server/services/settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [categories, settings] = await Promise.all([listCategories(), getSiteSettings()]);
	return { categories, defaultPublished: settings.defaultPublished };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData());
		const parsed = documentFormSchema.safeParse(raw);

		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors,
				values: raw
			});
		}

		const doc = await createDocument(parsed.data);
		return redirect(303, `/admin/documents/${doc!.id}`);
	}
};
