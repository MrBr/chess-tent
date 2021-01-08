import { socket } from '@application';
import {
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UPDATE_ACTIVITY_PROPERTY,
  UPDATE_ACTIVITY_STEP_STATE,
} from '@chess-tent/types';
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
    (stream.data.type === UPDATE_ACTIVITY_STEP_STATE ||
      stream.data.type === UPDATE_ACTIVITY_PROPERTY)
  ) {
    const action = stream.data;
    socket.sendAction(`activity-${action.meta.activityId}`, stream);
  }

  next(stream);
});
