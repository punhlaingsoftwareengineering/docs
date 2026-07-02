import { error } from '@sveltejs/kit';
import { categorySlugParamSchema } from '$lib/schemas/category';
import { DEFAULT_DOCS_CATEGORY_DESCRIPTIONS } from '$lib/landing/defaults';
import { getCategoryListingBySlug } from '$lib/server/services/categories';
import { getSiteSettings } from '$lib/server/services/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const parsed = categorySlugParamSchema.safeParse(params);

	if (!parsed.success) {
		error(404, 'Category not found');
	}

	const [result, settings] = await Promise.all([
		getCategoryListingBySlug(parsed.data.slug),
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
		description: descriptions[result.category.slug] ?? null
	};
};
