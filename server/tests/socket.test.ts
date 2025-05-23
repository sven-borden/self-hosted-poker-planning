import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';

// example test using socket.io/testing helpers
test('socket vote', (done) => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  io.on('connection', (socket) => {
    socket.on('vote:cast', (data) => {
      expect(data.cardId).toBe(1);
      done();
    });
  });
  httpServer.listen(() => {
    const port = httpServer.address().port;
    const client = Client(`http://localhost:${port}`, { query: { slug: 'test' } });
    client.emit('vote:cast', { cardId: 1 });
  });
});
