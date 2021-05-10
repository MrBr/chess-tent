import { socket } from '@application';
import {
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
  SYNC_ACTIVITY_REQUEST_EVENT,
  SYNC_ACTIVITY_EVENT,
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
    const roomId = stream.data;
    const [, activityId] = roomId.split('-');
    const userId = tokenData.user.id;
    const canJoin = await canEditActivity(activityId, userId);
    if (canJoin) {
      console.log('Client joined to', roomId);
      const newSocket = stream.client.join(roomId);
      socket.sendDataToOwner(roomId, newSocket.id, SYNC_ACTIVITY_REQUEST_EVENT);
    }
  }

  // Handle activity channel unsubscription
  if (
    stream.event === UNSUBSCRIBE_EVENT &&
    stream.data?.indexOf('activity') > -1
  ) {
    const tokenData = socket.identify(stream);
    if (!tokenData) {
      console.log('Unauthorized socket unsubscribe');
      return;
    }
    console.log('Client left from', stream.data);
    stream.client.leave(stream.data);
  }

  // Handle activity channel sync
  // if (stream.event === SYNC_ACTIVITY_EVENT) {
  //   const { activity, fromUserId } = stream.data;
  //   console.log('SYNC_ACTIVITY_EVENT', activity, fromUserId);
  // }

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
