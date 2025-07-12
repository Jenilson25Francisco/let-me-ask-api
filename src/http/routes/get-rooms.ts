import type { FastifyPluginCallback } from "fastify";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { id } from "zod/locales";

export const getRoomsRoute: FastifyPluginCallback = (app) => {
	app.get("/rooms", async () => {
		const results = await db
			.select({
				id: schema.rooms.id,
				name: schema.rooms.name,
			})
			.from(schema.rooms)
			.orderBy(schema.rooms.createdAt);
		return results;
	});
};
