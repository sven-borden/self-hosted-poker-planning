import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';

const plugin: FastifyPluginAsync<{ prisma: PrismaClient }> = async (f, opts) => {
  f.get('/decks', async () => opts.prisma.deck.findMany({ include: { cards: true } }));
};

export default plugin;
