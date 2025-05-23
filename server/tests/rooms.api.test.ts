import app from '../src/index';
import Fastify from 'fastify';

test('create room', async () => {
  const fastify = await app;
  const res = await fastify.inject({
    method: 'POST',
    url: '/api/v1/rooms',
    payload: { deckId: 1, userName: 'Test' },
  });
  expect(res.statusCode).toBe(201);
  const body = JSON.parse(res.body);
  expect(body.slug).toHaveLength(8);
});
