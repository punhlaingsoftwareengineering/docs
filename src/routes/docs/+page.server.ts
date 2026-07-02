import { error, redirect } from '@sveltejs/kit';
import { getFirstPublishedCategory } from '$lib/server/services/categories';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const first = await getFirstPublishedCategory();
	if (!first) error(404, 'No published documentation yet');
	redirect(302, `/docs/category/${first.slug}`);
};
