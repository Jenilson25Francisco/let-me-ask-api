import type { FastifyPluginCallback } from 'fastify'
import z from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createRoomRoute: FastifyPluginCallback = app => {
  app.post(
    '/rooms',
    {
      schema: {
        body: z.object({
          name: z.string().min(1),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const body = request.body as { name: string; description?: string }
      const { name, description } = body

      const result = await db
        .insert(schema.rooms)
        .values({
          name,
          description,
        })
        .returning()

      const insertedRoom = result[0]

      if (!insertedRoom) {
        throw new Error('failed to create new room')
      }

      return reply.status(201).send({ roomId: insertedRoom.id })
    }
  )
}
