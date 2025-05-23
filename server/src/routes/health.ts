import { FastifyPluginAsync } from 'fastify';
const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => ({ status: 'ok' }));
  fastify.get('/ready', async () => ({ ready: true }));
};
export default plugin;
