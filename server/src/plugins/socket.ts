import fp from 'fastify-plugin';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import type { PrismaClient } from '@prisma/client';

interface Opts { prisma: PrismaClient }

const socketPlugin = fp<Opts>(async (fastify, opts) => {
  const http = createServer(fastify.server);
  const io = new Server(http, { cors: { origin: process.env.CORS_ORIGIN || '*' } });

  // mount Redis adapter
  const pub = createClient({ url: process.env.REDIS_URL });
  const sub = pub.duplicate();
  await pub.connect();
  await sub.connect();
  io.adapter(createAdapter(pub, sub));

  http.listen(Number(process.env.PORT) || 4000);

  io.on('connection', (socket) => {
    const { slug } = socket.handshake.query as { slug?: string };
    if (!slug) return socket.disconnect();

    socket.join(slug);

    socket.on('vote:cast', async ({ cardId }) => {
      await opts.prisma.vote.upsert({
        where: { userId_roomId_round: { userId: socket.id, roomId: slug, round: 1 } },
        update: { cardId },
        create: { roomId: slug, userId: socket.id, cardId, round: 1 },
      });
      io.to(slug).emit('state:update');
    });

    socket.on('admin:reveal', () => io.to(slug).emit('admin:reveal'));
    socket.on('admin:nextRound', () => io.to(slug).emit('admin:nextRound'));
  });

  fastify.decorate('io', io);
  fastify.addHook('onClose', async () => {
    await pub.quit();
    await sub.quit();
    io.close();
  });
});

export default socketPlugin;
