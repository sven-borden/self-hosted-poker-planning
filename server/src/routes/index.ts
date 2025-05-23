import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import rooms from './rooms';
import decks from './decks';

export function registerRoutes(app: FastifyInstance, prisma: PrismaClient) {
  app.register(rooms, { prefix: '/api/v1', prisma });
  app.register(decks, { prefix: '/api/v1', prisma });
}
