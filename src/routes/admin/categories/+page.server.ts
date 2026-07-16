import { fail } from '@sveltejs/kit';
import { requireDocsAdmin } from '$lib/server/auth-guards';
import { categoryFormSchema, categoryIdSchema } from '$lib/schemas/category';
import {
	categoryErrorMessage,
	createCategory,
	deleteCategory,
	listCategoriesWithCounts,
	updateCategory
} from '$lib/server/services/categories';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const categories = await listCategoriesWithCounts();
	return { categories };
};

export const actions: Actions = {
	create: async (event) => {
		await requireDocsAdmin(event);
		const raw = Object.fromEntries(await event.request.formData());
		const parsed = categoryFormSchema.safeParse(raw);

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			const first = Object.values(errors).flat()[0];
			return fail(400, {
				message: first ?? 'Please check the form and try again.',
				errors,
				values: raw,
				action: 'create'
			});
		}

		try {
			await createCategory(parsed.data);
			return { success: true, message: 'Category created.' };
		} catch (error) {
			return fail(400, {
				message: categoryErrorMessage(error, 'Could not create category.'),
				values: raw,
				action: 'create'
			});
		}
	},

	update: async (event) => {
		await requireDocsAdmin(event);
		const formData = await event.request.formData();
		const raw = Object.fromEntries(formData);
		const idParsed = categoryIdSchema.safeParse({ id: raw.id });

		if (!idParsed.success) {
			return fail(400, { message: 'Invalid category.', action: 'update' });
		}

		const parsed = categoryFormSchema.safeParse(raw);
		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			const first = Object.values(errors).flat()[0];
			return fail(400, {
				message: first ?? 'Please check the form and try again.',
				errors,
				values: raw,
				action: 'update',
				editId: idParsed.data.id
			});
		}

		try {
			await updateCategory(idParsed.data.id, parsed.data);
			return { success: true, message: 'Category updated.' };
		} catch (error) {
			return fail(400, {
				message: categoryErrorMessage(error, 'Could not update category.'),
				values: raw,
				action: 'update',
				editId: idParsed.data.id
			});
		}
	},

	delete: async (event) => {
		await requireDocsAdmin(event);
		const formData = await event.request.formData();
		const parsed = categoryIdSchema.safeParse({ id: formData.get('id') });

		if (!parsed.success) {
			return fail(400, { message: 'Invalid category.', action: 'delete' });
		}

		try {
			await deleteCategory(parsed.data.id);
			return { success: true, message: 'Category deleted.' };
		} catch (error) {
			return fail(400, {
				message: categoryErrorMessage(error, 'Could not delete category.'),
				action: 'delete'
			});
		}
	}
};
