import {
	FetchHttpClient,
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
} from "@effect/platform";
import { Effect, type Schema, flow, pipe } from "effect";
import { env } from '$env/dynamic/public';

// For static environment variables (known at build time), use:
// import { PUBLIC_API_URL } from '$env/static/public';

const APIURL = env.PUBLIC_API_URL || "http://localhost:8080"; // Fallback URL if env variable is not set
export const createHttpClient = Effect.map(HttpClient.HttpClient, (client) =>
	client.pipe(
		HttpClient.mapRequest(
			flow(HttpClientRequest.acceptJson, HttpClientRequest.prependUrl(APIURL)),
		),
	),
);

export const parseResponse = <A, I, R>(
	response: HttpClientResponse.HttpClientResponse,
	schema: Schema.Schema<A, I, R>,
) =>
	Effect.succeed(
		HttpClientResponse.matchStatus({
			200: (response) => HttpClientResponse.schemaBodyJson(schema)(response),
			orElse: (_: HttpClientResponse.HttpClientResponse) => Effect.fail(_),
		})(response),
	).pipe(Effect.flatMap((result) => result));

export const runGetRequest = <A, I, R>(
	endpoint: string,
	schema: Schema.Schema<A, I, R>,
) =>
	pipe(
		createHttpClient,
		Effect.flatMap((request) => request.get(endpoint)),
		Effect.flatMap((response) => parseResponse(response, schema)),
		Effect.provide(FetchHttpClient.layer),
	);

export const runRequestWithParams = <A, I, R>(
	endpoint: string,
	params: Record<string, string>,
	schema: Schema.Schema<A, I, R>,
) =>
	pipe(
		createHttpClient,
		Effect.flatMap((request) =>
			request.get(
				Object.entries(params).reduce(
					(url, [key, value]) => url.replace(`:${key}`, value),
					endpoint,
				),
			),
		),
		Effect.flatMap((response) => parseResponse(response, schema)),
		Effect.provide(FetchHttpClient.layer),
	);

export const runPostRequest = async (endpoint: string, body: unknown) => {
	const response = await fetch(`${APIURL}${endpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
};
