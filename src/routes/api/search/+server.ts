import { json } from '@sveltejs/kit';
import { searchQuerySchema } from '$lib/schemas/search';
import { searchPublishedDocuments } from '$lib/server/services/docs';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const parsed = searchQuerySchema.safeParse({ q: url.searchParams.get('q') ?? '' });

	if (!parsed.success) {
		return json({ results: [] });
	}

	const results = await searchPublishedDocuments(parsed.data.q);

	return json({
		results: results.map((doc) => ({
			id: doc.id,
			slug: doc.slug,
			title: doc.title,
			excerpt: doc.excerpt,
			categoryName: doc.categoryName
		}))
	});
};
