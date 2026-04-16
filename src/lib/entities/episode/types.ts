export type ApiEpisode = {
	id: number;
	name: string;
	air_date: string;
	episode: string;
	characters: string[];
	url: string;
	created: string;
};

export type Episode = {
	id: number;
	name: string;
	airDate: string;
	episode: string;
	characterCount: number;
};
