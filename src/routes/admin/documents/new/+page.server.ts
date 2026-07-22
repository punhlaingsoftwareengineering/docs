import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { requireDocsAdmin } from '$lib/server/auth-guards';
import { documentFormSchema } from '$lib/schemas/document';
import { listCategories } from '$lib/server/services/categories';
import {
	createDocument,
	listEligibleParents,
	validateDocumentHierarchy
} from '$lib/server/services/docs';
import { getSiteSettings } from '$lib/server/services/settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [categories, settings] = await Promise.all([listCategories(), getSiteSettings()]);

	const parentOptionsByCategory = Object.fromEntries(
		await Promise.all(
			categories.map(async (cat) => [
				cat.id,
				await listEligibleParents({ categoryId: cat.id, includeUnpublished: true })
			])
		)
	);

	return {
		categories,
		defaultPublished: settings.defaultPublished,
		parentOptionsByCategory
	};
};

export const actions: Actions = {
	default: async (event) => {
		await requireDocsAdmin(event);
		const raw = Object.fromEntries(await event.request.formData());
		const parsed = documentFormSchema.safeParse(raw);

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			const first = Object.values(errors).flat()[0];
			return fail(400, {
				message: first ?? 'Please check the form and try again.',
				errors,
				values: raw
			});
		}

		const hierarchy = await validateDocumentHierarchy({
			parentDocumentId: parsed.data.parentDocumentId ?? null,
			categoryId: parsed.data.categoryId
		});
		if (!hierarchy.valid) {
			return fail(400, {
				message: hierarchy.message,
				errors: { parentDocumentId: [hierarchy.message] }
			});
		}

		try {
			const doc = await createDocument(parsed.data);
			redirect(303, `/admin/documents/${doc!.id}`);
		} catch (error) {
			if (isRedirect(error)) throw error;
			const message =
				error instanceof Error ? error.message : 'Could not create document.';
			return fail(400, { message, values: raw });
		}
	}
};
