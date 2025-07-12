import type { FastifyPluginCallback } from 'fastify'
import z from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createQuestionRoute: FastifyPluginCallback = app => {
  app.post(
    '/rooms/:roomId/question',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          name: z.string().min(1),
          description: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const body = request.body as { question: string }
      const { question } = body
      const { roomId } = request.params as { roomId: string }

      const result = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
        })
        .returning()

      const insertQuestion = result[0]

      if (!insertQuestion) {
        throw new Error('failed to create new room')
      }

      return reply.status(201).send({ questionId: insertQuestion.id })
    }
  )
}
