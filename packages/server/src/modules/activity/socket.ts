import { socket } from '@application';
import { SUBSCRIBE_EVENT } from '@chess-tent/types';
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
  // if (
  //   stream.event === ACTION_EVENT &&
  //   (stream.data.type === UPDATE_ACTIVITY_STEP_STATE ||
  //     stream.data.type === UPDATE_ACTIVITY_STEP_ANALYSIS)
  // ) {
  //   const action = stream.data;
  //   socket.sendAction(`activity-${action.meta.activityId}`, stream);
  // }

  next(stream);
});
