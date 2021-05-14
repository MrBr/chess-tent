import { socket } from '@application';
import { ACTION_EVENT, SYNC_ACTION } from '@chess-tent/types';

socket.registerMiddleware(async (stream, next) => {
  if (stream.event === ACTION_EVENT && stream.data.type === SYNC_ACTION) {
    const action = stream.data;
    const { payload, meta } = action;
    const { id, type } = meta;
    console.log('Forwarding SYNC action');
    if (payload === undefined) {
      console.warn('Forwarding SYNC action Error - no payload');
      return;
    }
    socket.sendServerAction(`${type}-${id}`, action, action.meta.socketId);
  }

  next(stream);
});
