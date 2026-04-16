import type { PageServerLoad } from './$types';
import { listCharacters, type CharacterFilters } from '$lib/core/api/rick-and-morty';

function readFilters(url: URL): CharacterFilters {
	const query = url.searchParams.get('q') ?? url.searchParams.get('name') ?? '';
	const pageParam = url.searchParams.get('page');
	const page = pageParam ? Number(pageParam) : undefined;

	return {
		page: page && Number.isFinite(page) ? page : undefined,
		name: query,
		status: url.searchParams.get('status') ?? undefined,
		species: url.searchParams.get('species') ?? undefined,
		type: url.searchParams.get('type') ?? undefined,
		gender: url.searchParams.get('gender') ?? undefined
	};
}

export const load: PageServerLoad = async ({ fetch, url }) => {
	const filters = readFilters(url);
	const query = filters.name ?? '';

	try {
		const result = await listCharacters(fetch, filters);

		return {
			characters: result.characters,
			total: result.total,
			pagination: result.pagination,
			filters: result.filters,
			query
		};
	} catch (error) {
		return {
			characters: [],
			total: 0,
			pagination: undefined,
			filters,
			query,
			error: error instanceof Error ? error.message : 'No se pudo cargar la API de Rick and Morty.'
		};
	}
};
