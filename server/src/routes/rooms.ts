import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { calculateAverage } from '../services/average.util';

const plugin: FastifyPluginAsync<{ prisma: PrismaClient }> = async (f, opts) => {
  const prisma = opts.prisma;

  // Create room
  f.post('/rooms', async (req, rep) => {
    const body = z.object({ deckId: z.number(), userName: z.string().optional() }).parse(req.body);
    const slug = uuid().slice(0, 8);
    const user = await prisma.user.create({ data: { name: body.userName ?? 'Admin' } });
    await prisma.room.create({
      data: {
        id: uuid(),
        slug,
        deckId: body.deckId,
        memberships: { create: { userId: user.id, role: 'admin' } },
      },
    });
    const token = f.jwt.sign({ room: slug, uid: user.id, role: 'admin' });
    return rep.code(201).send({ slug, token });
  });

  // Get room state
  f.get('/rooms/:slug', async (req) => {
    const { slug } = req.params as { slug: string };
    const room = await prisma.room.findUnique({
      where: { slug },
      include: {
        memberships: { include: { user: true } },
        deck: { include: { cards: true } },
      },
    });
    if (!room) throw f.httpErrors.notFound();
    const votes = await prisma.vote.findMany({ where: { roomId: room.id, round: 1 } });
    return { ...room, votes, average: calculateAverage(room.deck.cards, votes) };
  });

  // Join room
  f.post('/rooms/:slug/join', async (req) => {
    const { slug } = req.params as { slug: string };
    const { userName } = req.body as { userName: string };
    const room = await prisma.room.findUnique({ where: { slug } });
    if (!room) throw f.httpErrors.notFound();
    const user = await prisma.user.create({ data: { name: userName } });
    await prisma.roomMember.create({ data: { roomId: room.id, userId: user.id, role: 'guest' } });
    const token = f.jwt.sign({ room: slug, uid: user.id, role: 'guest' });
    return { token };
  });

  // Change deck
  f.patch('/rooms/:slug', { preHandler: [f.authenticate] }, async (req) => {
    const { slug } = req.params as { slug: string };
    const { deckId } = req.body as { deckId: number };
    await prisma.room.update({ where: { slug }, data: { deckId } });
    f.io.to(slug).emit('state:update');
    return { ok: true };
  });

  // Cast vote (REST)
  f.post('/rooms/:slug/vote', { preHandler: [f.authenticate] }, async (req) => {
    const { slug } = req.params as { slug: string };
    const { cardId } = req.body as { cardId: number };
    await prisma.vote.upsert({
      where: { userId_roomId_round: { userId: req.user.uid, roomId: slug, round: 1 } },
      update: { cardId },
      create: { roomId: slug, userId: req.user.uid, cardId, round: 1 },
    });
    f.io.to(slug).emit('state:update');
    return { ok: true };
  });

  // Reveal
  f.post('/rooms/:slug/reveal', { preHandler: [f.authenticate] }, async (req) => {
    const { slug } = req.params as { slug: string };
    f.io.to(slug).emit('admin:reveal');
    return { ok: true };
  });

  // Next round
  f.post('/rooms/:slug/next', { preHandler: [f.authenticate] }, async (req) => {
    const { slug } = req.params as { slug: string };
    await prisma.vote.deleteMany({ where: { roomId: slug } });
    f.io.to(slug).emit('admin:nextRound');
    return { ok: true };
  });

  // Kick
  f.delete('/rooms/:slug/members/:uid', { preHandler: [f.authenticate] }, async (req) => {
    const { slug, uid } = req.params as { slug: string; uid: string };
    await prisma.roomMember.delete({ where: { roomId_userId: { roomId: slug, userId: uid } } });
    f.io.to(slug).emit('member:kicked', { userId: uid });
    return { ok: true };
  });
};

export default plugin;
