export type ApiLocation = {
	id: number;
	name: string;
	type: string;
	dimension: string;
	residents: string[];
	url: string;
	created: string;
};

export type Location = {
	id: number;
	name: string;
	type: string;
	dimension: string;
	residentCount: number;
};
