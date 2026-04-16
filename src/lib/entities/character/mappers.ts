import type { ApiCharacter, Character } from './types';

export function mapCharacter(apiCharacter: ApiCharacter): Character {
	return {
		id: apiCharacter.id,
		name: apiCharacter.name,
		status: apiCharacter.status,
		species: apiCharacter.species,
		gender: apiCharacter.gender,
		image: apiCharacter.image,
		originName: apiCharacter.origin.name,
		locationName: apiCharacter.location.name
	};
}
