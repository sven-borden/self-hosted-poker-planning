import { io, Socket } from 'socket.io-client';

export function connect(slug: string): Socket {
  return io(`${process.env.NEXT_PUBLIC_WS_BASE}/room/${slug}`, { query: { slug } });
}
