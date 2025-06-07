import {
	FetchHttpClient,
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
} from "@effect/platform";
import { Effect, type Schema, flow, pipe } from "effect";
import { APIURL } from "../constant.js";

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
// export const runPostRequest = <A, I, R>(
// 	endpoint: string,
// 	body: Record<string, unknown>,
// 	schema: Schema.Schema<A, I, R>,
// ) =>
// 	pipe(
// 		createHttpClient,
// 		Effect.flatMap((request) =>
// 			request.post(endpoint, HttpClientRequest.bodyJson(body)),
// 		),
// 		Effect.flatMap((response) => parseResponse(response, schema)),
// 		Effect.provide(FetchHttpClient.layer),
// 	);
