import type { ApiEpisode, Episode } from './types';

export function mapEpisode(apiEpisode: ApiEpisode): Episode {
	return {
		id: apiEpisode.id,
		name: apiEpisode.name,
		airDate: apiEpisode.air_date,
		episode: apiEpisode.episode,
		characterCount: apiEpisode.characters.length
	};
}
