import fp from 'fastify-plugin';
import client from 'prom-client';

export default fp(async (fastify) => {
  const register = new client.Registry();
  client.collectDefaultMetrics({ register });

  fastify.get('/metrics', async (_, reply) => {
    reply.header('Content-Type', register.contentType);
    return register.metrics();
  });

  fastify.get('/health', async () => ({ status: 'ok' }));
});
