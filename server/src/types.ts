import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { room: string; uid: string; role: 'admin' | 'guest' };
    user: { room: string; uid: string; role: 'admin' | 'guest' };
  }
}
