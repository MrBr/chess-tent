import { socket } from '@application';
import {
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
  UPDATE_ACTIVITY_PROPERTY,
  UPDATE_ACTIVITY_STEP_STATE,
  SYNC_ACTIVITY,
} from '@chess-tent/types';
import { syncActivityRequestAction, syncActivityAction } from './actions';
import { canEditActivity, getActivity } from './service';

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
    const activityId = roomId.substring(roomId.indexOf('-') + 1);

    const userId = tokenData.user.id;
    const canJoin = await canEditActivity(activityId, userId);
    if (canJoin) {
      console.log('Client joined to', roomId);
      const newSocket = stream.client.join(roomId);
      const shouldSyncData = socket.shouldSyncData(roomId);
      const channel = `activity-${activityId}`;

      if (shouldSyncData) {
        console.log('I am NOT the first!');
        socket.sendServerAction(
          channel,
          syncActivityRequestAction(
            activityId,
            newSocket.id,
            socket.getOwnerSocketId(roomId),
          ),
        );
      } else {
        console.log('I am the first!');
        const activity = await getActivity(activityId);
        if (!activity) {
          return null;
        }
        socket.sendServerAction(
          channel,
          syncActivityAction(activity, newSocket.id),
        );
      }
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

  // Forward activity action
  if (
    stream.event === ACTION_EVENT &&
    (stream.data.type === UPDATE_ACTIVITY_STEP_STATE ||
      stream.data.type === UPDATE_ACTIVITY_PROPERTY)
  ) {
    const action = stream.data;
    socket.sendAction(`activity-${action.meta.activityId}`, stream);
  }

  if (stream.event === ACTION_EVENT && stream.data.type === SYNC_ACTIVITY) {
    const action = stream.data;
    console.log('Forwarding SYNC_ACTIVITY action');
    socket.sendServerAction(`activity-${action.meta.entityId}`, action);
  }

  next(stream);
});
