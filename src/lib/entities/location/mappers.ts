import type { ApiLocation, Location } from './types';

export function mapLocation(apiLocation: ApiLocation): Location {
	return {
		id: apiLocation.id,
		name: apiLocation.name,
		type: apiLocation.type,
		dimension: apiLocation.dimension,
		residentCount: apiLocation.residents.length
	};
}
