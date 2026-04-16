import { environment } from '$lib/core/config/environment';
import { createHttpClient, type QueryParams } from './http';
import { mapCharacter } from '$lib/entities/character/mappers';
import type { ApiCharacter, Character } from '$lib/entities/character/types';
import { mapEpisode } from '$lib/entities/episode';
import type { ApiEpisode, Episode } from '$lib/entities/episode';
import { mapLocation } from '$lib/entities/location';
import type { ApiLocation, Location } from '$lib/entities/location';

type ApiInfo = {
	count: number;
	pages: number;
	next: string | null;
	prev: string | null;
};

type ApiListResponse<T> = {
	info: ApiInfo;
	results: T[];
};

export type PaginationInfo = ApiInfo;

export type CharacterFilters = {
	page?: number;
	name?: string;
	status?: string;
	species?: string;
	type?: string;
	gender?: string;
};

export type EpisodeFilters = {
	page?: number;
	name?: string;
	episode?: string;
};

export type LocationFilters = {
	page?: number;
	name?: string;
	type?: string;
	dimension?: string;
};

export type CharacterListResult = {
	characters: Character[];
	total: number;
	pagination: PaginationInfo;
	filters: CharacterFilters;
};

export type EpisodeListResult = {
	episodes: Episode[];
	total: number;
	pagination: PaginationInfo;
	filters: EpisodeFilters;
};

export type LocationListResult = {
	locations: Location[];
	total: number;
	pagination: PaginationInfo;
	filters: LocationFilters;
};

export type RickAndMortyService = {
	listCharacters(filters?: CharacterFilters): Promise<CharacterListResult>;
	getCharacterById(id: number): Promise<Character>;
	listEpisodes(filters?: EpisodeFilters): Promise<EpisodeListResult>;
	getEpisodeById(id: number): Promise<Episode>;
	listLocations(filters?: LocationFilters): Promise<LocationListResult>;
	getLocationById(id: number): Promise<Location>;
};

function createRickAndMortyHttp(fetchImpl: typeof fetch) {
	return createHttpClient(environment.rickAndMortyApiBaseUrl, fetchImpl);
}

function toCharacterFilters(filters?: CharacterFilters): CharacterFilters {
	return {
		page: filters?.page && filters.page > 0 ? filters.page : undefined,
		name: filters?.name?.trim() || undefined,
		status: filters?.status?.trim() || undefined,
		species: filters?.species?.trim() || undefined,
		type: filters?.type?.trim() || undefined,
		gender: filters?.gender?.trim() || undefined
	};
}

function toEpisodeFilters(filters?: EpisodeFilters): EpisodeFilters {
	return {
		page: filters?.page && filters.page > 0 ? filters.page : undefined,
		name: filters?.name?.trim() || undefined,
		episode: filters?.episode?.trim() || undefined
	};
}

function toLocationFilters(filters?: LocationFilters): LocationFilters {
	return {
		page: filters?.page && filters.page > 0 ? filters.page : undefined,
		name: filters?.name?.trim() || undefined,
		type: filters?.type?.trim() || undefined,
		dimension: filters?.dimension?.trim() || undefined
	};
}

function mapListResponse<TApi, TDomain>(
	response: ApiListResponse<TApi>,
	mapper: (item: TApi) => TDomain
): { items: TDomain[]; pagination: PaginationInfo; total: number } {
	return {
		items: response.results.map(mapper),
		pagination: response.info,
		total: response.info.count
	};
}

function createCharacterService(fetchImpl: typeof fetch) {
	const http = createRickAndMortyHttp(fetchImpl);

	return {
		async listCharacters(filters: CharacterFilters = {}): Promise<CharacterListResult> {
			const normalizedFilters = toCharacterFilters(filters);
			const response = await http.get<ApiListResponse<ApiCharacter>>('/character', {
				query: normalizedFilters as QueryParams,
				memoize: true
			});
			const list = mapListResponse(response, mapCharacter);

			return {
				characters: list.items,
				total: list.total,
				pagination: list.pagination,
				filters: normalizedFilters
			};
		},

		async getCharacterById(id: number): Promise<Character> {
			const response = await http.get<ApiCharacter>(`/character/${id}`, {
				memoize: true
			});
			return mapCharacter(response);
		}
	};
}

function createEpisodeService(fetchImpl: typeof fetch) {
	const http = createRickAndMortyHttp(fetchImpl);

	return {
		async listEpisodes(filters: EpisodeFilters = {}): Promise<EpisodeListResult> {
			const normalizedFilters = toEpisodeFilters(filters);
			const response = await http.get<ApiListResponse<ApiEpisode>>('/episode', {
				query: normalizedFilters as QueryParams,
				memoize: true
			});
			const list = mapListResponse(response, mapEpisode);

			return {
				episodes: list.items,
				total: list.total,
				pagination: list.pagination,
				filters: normalizedFilters
			};
		},

		async getEpisodeById(id: number): Promise<Episode> {
			const response = await http.get<ApiEpisode>(`/episode/${id}`, {
				memoize: true
			});
			return mapEpisode(response);
		}
	};
}

function createLocationService(fetchImpl: typeof fetch) {
	const http = createRickAndMortyHttp(fetchImpl);

	return {
		async listLocations(filters: LocationFilters = {}): Promise<LocationListResult> {
			const normalizedFilters = toLocationFilters(filters);
			const response = await http.get<ApiListResponse<ApiLocation>>('/location', {
				query: normalizedFilters as QueryParams,
				memoize: true
			});
			const list = mapListResponse(response, mapLocation);

			return {
				locations: list.items,
				total: list.total,
				pagination: list.pagination,
				filters: normalizedFilters
			};
		},

		async getLocationById(id: number): Promise<Location> {
			const response = await http.get<ApiLocation>(`/location/${id}`, {
				memoize: true
			});
			return mapLocation(response);
		}
	};
}

export function createRickAndMortyService(fetchImpl: typeof fetch): RickAndMortyService {
	const characters = createCharacterService(fetchImpl);
	const episodes = createEpisodeService(fetchImpl);
	const locations = createLocationService(fetchImpl);

	return {
		listCharacters: characters.listCharacters,
		getCharacterById: characters.getCharacterById,
		listEpisodes: episodes.listEpisodes,
		getEpisodeById: episodes.getEpisodeById,
		listLocations: locations.listLocations,
		getLocationById: locations.getLocationById
	};
}

export async function listCharacters(
	fetchImpl: typeof fetch,
	filters: CharacterFilters = {}
): Promise<CharacterListResult> {
	return createRickAndMortyService(fetchImpl).listCharacters(filters);
}

export async function getCharacterById(fetchImpl: typeof fetch, id: number): Promise<Character> {
	return createRickAndMortyService(fetchImpl).getCharacterById(id);
}

export async function listEpisodes(
	fetchImpl: typeof fetch,
	filters: EpisodeFilters = {}
): Promise<EpisodeListResult> {
	return createRickAndMortyService(fetchImpl).listEpisodes(filters);
}

export async function getEpisodeById(fetchImpl: typeof fetch, id: number): Promise<Episode> {
	return createRickAndMortyService(fetchImpl).getEpisodeById(id);
}

export async function listLocations(
	fetchImpl: typeof fetch,
	filters: LocationFilters = {}
): Promise<LocationListResult> {
	return createRickAndMortyService(fetchImpl).listLocations(filters);
}

export async function getLocationById(fetchImpl: typeof fetch, id: number): Promise<Location> {
	return createRickAndMortyService(fetchImpl).getLocationById(id);
}

export async function searchCharacters(
	fetchImpl: typeof fetch,
	query: string
): Promise<CharacterListResult> {
	return listCharacters(fetchImpl, {
		name: query
	});
}
