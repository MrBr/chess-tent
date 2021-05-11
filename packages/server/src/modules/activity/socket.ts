import { socket } from '@application';
import { ACTION_EVENT, SEND_PATCH, SUBSCRIBE_EVENT } from '@chess-tent/types';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { canEditActivity } from './service';

socket.registerMiddleware(async (stream, next) => {
  // Handle activity channel subscription
  if (
    stream.event === SUBSCRIBE_EVENT &&
    stream.data?.indexOf('activity') > -1
  ) {
    const tokenData = socket.identify(stream);
    if (!tokenData) {
      console.log('Unauthorized socket subscribe');
      return;
    }
    const [, activityId] = stream.data.split('-');
    const canJoin = await canEditActivity(activityId, tokenData.user.id);
    if (canJoin) {
      console.log('Client joined to', stream.data);
      stream.client.join(stream.data);
    }
  }
  // Forward activity action
  if (
    stream.event === ACTION_EVENT &&
    stream.data.type === SEND_PATCH &&
    stream.data.meta.type === TYPE_ACTIVITY
  ) {
    const action = stream.data;
    socket.sendAction(`activity-${action.meta.id}`, stream);
  }

  next(stream);
});
