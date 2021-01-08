import { socket } from '@application';
import { SUBSCRIBE_EVENT } from '@chess-tent/types';

socket.registerMiddleware((stream, next) => {
  // Handle user channel subscription
  if (stream.event === SUBSCRIBE_EVENT && stream.data?.indexOf('user') > -1) {
    const tokenData = socket.identify(stream);
    if (!tokenData) {
      console.log('Unauthorized socket subscribe');
      return;
    }
    if (`user-${tokenData.user.id}` === stream.data) {
      console.log('Client joined to', stream.data);
      stream.client.join(stream.data);
    }
  }
  next(stream);
});
