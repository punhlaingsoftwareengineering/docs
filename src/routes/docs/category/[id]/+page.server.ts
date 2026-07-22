import { error } from '@sveltejs/kit';
import { categoryIdParamSchema } from '$lib/schemas/category';
import {
	categoryDescriptionForId,
	DEFAULT_DOCS_CATEGORY_DESCRIPTIONS
} from '$lib/landing/defaults';
import { getCategoryListingById } from '$lib/server/services/categories';
import { getSiteSettings } from '$lib/server/services/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const parsed = categoryIdParamSchema.safeParse(params);

	if (!parsed.success) {
		error(404, 'Category not found');
	}

	const [result, settings] = await Promise.all([
		getCategoryListingById(parsed.data.id),
		getSiteSettings()
	]);

	if (!result) {
		error(404, 'Category not found');
	}

	const descriptions = {
		...DEFAULT_DOCS_CATEGORY_DESCRIPTIONS,
		...(settings.docsCategoryDescriptions ?? {})
	};

	return {
		category: result.category,
		items: result.items,
		description: categoryDescriptionForId(result.category.id, result.category.name, descriptions)
	};
};
