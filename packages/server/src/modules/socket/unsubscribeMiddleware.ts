import { socket } from '@application';
import { UNSUBSCRIBE_EVENT } from '@chess-tent/types';

socket.registerMiddleware(async (stream, next) => {
  if (stream.event === UNSUBSCRIBE_EVENT) {
    const tokenData = socket.identify(stream);
    if (!tokenData) {
      console.log('Unauthorized socket unsubscribe');
      return;
    }
    console.log('Client left from', stream.data);
    stream.client.leave(stream.data);
  }

  next(stream);
});
