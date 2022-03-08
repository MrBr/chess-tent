import { socket } from '@application';
import { CONNECTION_EVENT } from '@chess-tent/types';

socket.registerMiddleware((stream, next) => {
  if (stream.event === CONNECTION_EVENT) {
    const { client } = stream;
    const userId = socket.identify(client)?.user.id;
    if (userId) {
      client.data.userId = userId;
    }
  }
  next(stream);
});
