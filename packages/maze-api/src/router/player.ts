import { ERROR_CODE, GET_ALL_PLAYERS, GET_PLAYER } from "@nadir/global-types";
import { PlayerDBService } from "@nadir/maze-db";
import { Effect, pipe } from "effect";
import type { FastifyInstance } from "fastify";

export const PlayerRoutes = (server: FastifyInstance) =>
	pipe(
		Effect.sync(() => {
			server.get(GET_PLAYER, async (request, reply) => {
				const { playerID } = request.params as { playerID: string };

				return Router.getPlayer(playerID)
					.then((player) => {
						reply.send(player);
					})
					.catch((error) => {
						console.error("Error fetching maze:", error);
						reply.status(500).send({ error: "Failed to fetch player" });
					});
			});

			server.get(GET_ALL_PLAYERS, async (_, reply) => {
				return Router.getAllPlayers()
					.then((players) => {
						reply.send(players);
					})
					.catch(() => {
						reply
							.status(ERROR_CODE.INTERNAL_SERVER_ERROR)
							.send({ status: "error", error: "Failed to fetch all players" });
					});
			});
		}),
		Effect.map(() => server),
	);

const Router = {
	getPlayer: (playerID: string) =>
		pipe(
			PlayerDBService,
			Effect.flatMap((service) => service.getPlayerById(playerID)),
			Effect.provide(PlayerDBService.Default),
			Effect.runPromise,
		),
	getAllPlayers: () =>
		pipe(
			PlayerDBService,
			Effect.flatMap((service) => service.getAllPlayers),
			Effect.provide(PlayerDBService.Default),
			Effect.runPromise,
		),
};
