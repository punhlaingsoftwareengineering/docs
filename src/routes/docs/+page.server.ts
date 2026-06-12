import { error, redirect } from '@sveltejs/kit';
import { getFirstPublishedDocument } from '$lib/server/services/docs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const first = await getFirstPublishedDocument();
	if (!first) error(404, 'No published documentation yet');
	redirect(302, `/docs/${first.slug}`);
};
