import type { Character } from '$lib/entities/character/types';
import type { PaginationInfo, CharacterFilters } from '$lib/core/api/rick-and-morty';

export type CharacterBrowserData = {
	characters: Character[];
	total: number;
	query: string;
	pagination?: PaginationInfo;
	filters?: CharacterFilters;
	error?: string;
};
