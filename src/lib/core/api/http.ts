export type QueryValue = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryValue>;

export type HttpRequestOptions = Omit<RequestInit, 'method'> & {
	query?: QueryParams;
	memoize?: boolean | { ttlMs?: number };
};

export type HttpClient = {
	get<T>(path: string, init?: HttpRequestOptions): Promise<T>;
};

export class HttpClientError extends Error {
	status: number;
	statusText: string;
	url: string;
	responseBody?: string;
	data?: unknown;

	constructor({
		message,
		status,
		statusText,
		url,
		responseBody,
		data
	}: {
		message: string;
		status: number;
		statusText: string;
		url: string;
		responseBody?: string;
		data?: unknown;
	}) {
		super(message);
		this.name = 'HttpClientError';
		this.status = status;
		this.statusText = statusText;
		this.url = url;
		this.responseBody = responseBody;
		this.data = data;
	}
}

export function createQueryString(query?: QueryParams): string {
	if (!query) {
		return '';
	}

	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null || value === '') {
			continue;
		}

		searchParams.set(key, String(value));
	}

	const result = searchParams.toString();
	return result ? `?${result}` : '';
}

function mergeHeaders(
	defaultHeaders: HeadersInit | undefined,
	overrides: HeadersInit | undefined
): HeadersInit {
	const headers = new Headers(defaultHeaders);
	const mergedOverrides = new Headers(overrides);

	mergedOverrides.forEach((value, key) => {
		headers.set(key, value);
	});

	headers.set('accept', 'application/json');
	return headers;
}

type CacheEntry = {
	expiresAt: number;
	value: Promise<unknown>;
};

const responseCache = new Map<string, CacheEntry>();

function getCachedResponse<T>(key: string): Promise<T> | undefined {
	const entry = responseCache.get(key);

	if (!entry) {
		return undefined;
	}

	if (entry.expiresAt <= Date.now()) {
		responseCache.delete(key);
		return undefined;
	}

	return entry.value as Promise<T>;
}

function memoizeResponse<T>(key: string, value: Promise<T>, ttlMs: number): Promise<T> {
	responseCache.set(key, {
		expiresAt: Date.now() + ttlMs,
		value
	});

	value.catch(() => {
		responseCache.delete(key);
	});

	return value;
}

export function createHttpClient(
	baseUrl: string,
	fetchImpl: typeof fetch,
	defaultInit: RequestInit = {}
): HttpClient {
	const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

	return {
		async get<T>(path: string, init: HttpRequestOptions = {}): Promise<T> {
			const url = new URL(path.replace(/^\//, ''), normalizedBaseUrl);
			const queryString = createQueryString(init.query);
			const memoize =
				typeof init.memoize === 'object'
					? init.memoize
					: init.memoize
						? { ttlMs: 30_000 }
						: undefined;

			if (queryString) {
				url.search = queryString.slice(1);
			}

			const cacheKey = `GET:${url.toString()}`;

			if (memoize) {
				const cachedResponse = getCachedResponse<T>(cacheKey);

				if (cachedResponse) {
					return cachedResponse;
				}
			}

			const request = (async () => {
				const response = await fetchImpl(url, {
					...defaultInit,
					...init,
					headers: mergeHeaders(defaultInit.headers, init.headers)
				});

				if (!response.ok) {
					const responseText = await response.text().catch(() => '');
					let data: unknown;

					try {
						data = responseText ? JSON.parse(responseText) : undefined;
					} catch {
						data = responseText || undefined;
					}

					throw new HttpClientError({
						message: `HTTP ${response.status} calling ${url.pathname}${url.search}`,
						status: response.status,
						statusText: response.statusText,
						url: url.toString(),
						responseBody: responseText || undefined,
						data
					});
				}

				return (await response.json()) as T;
			})();

			if (!memoize) {
				return request;
			}

			return memoizeResponse(cacheKey, request, memoize.ttlMs ?? 30_000);
		}
	};
}
