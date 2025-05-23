import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';
import { registerRoutes } from './routes';
import metrics from './plugins/metrics';
import socketPlugin from './plugins/socket';

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

// plugins
await app.register(cors, { origin: process.env.CORS_ORIGIN || '*' });
await app.register(jwt, { secret: process.env.JWT_SECRET || 'dev' });
await app.register(rateLimit, { max: +(process.env.RATE_LIMIT || 20), timeWindow: '1 hour' });
await app.register(metrics);
await app.register(socketPlugin, { prisma });

// auth decorate
app.decorate('authenticate', async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch {
    reply.code(401).send({ error: 'unauthorized' });
  }
});

// REST routes
registerRoutes(app, prisma);

// start
const port = Number(process.env.PORT) || 4000;
app.listen({ port, host: '0.0.0.0' }).then(() => {
  app.log.info(`API listening on ${port}`);
});
