import { socket, action } from '@application';
import {
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
  SEND_PATCH,
  SYNC_ACTION,
} from '@chess-tent/types';
import { TYPE_ACTIVITY } from '@chess-tent/models';
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
      // Joining a room implicitly requires sending a sync request
      const newSocket = stream.client.join(roomId);
      const shouldSyncData = socket.shouldSyncData(roomId);
      const channel = `activity-${activityId}`;

      if (shouldSyncData) {
        console.log('Owner already exists');
        const sync = action.syncAction(
          activityId,
          TYPE_ACTIVITY,
          newSocket.id,
          undefined,
        );
        socket.sendServerAction(channel, sync, socket.getOwnerSocketId(roomId));
      } else {
        console.log('First user joined');
        const activity = await getActivity(activityId);
        const sync = action.syncAction(
          activityId,
          TYPE_ACTIVITY,
          newSocket.id,
          activity,
        );
        socket.sendServerAction(channel, sync, newSocket.id);
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
    stream.data.type === SEND_PATCH &&
    stream.data.meta.type === TYPE_ACTIVITY
  ) {
    const action = stream.data;
    socket.sendAction(`activity-${action.meta.id}`, stream);
  }

  if (stream.event === ACTION_EVENT && stream.data.type === SYNC_ACTION) {
    const action = stream.data;
    console.log('Forwarding SYNC action');
    if (action.payload === undefined) {
      console.warn('Forwarding SYNC action Error - no payload');
      return;
    }
    socket.sendServerAction(
      `activity-${action.meta.id}`,
      action,
      action.meta.socketId,
    );
  }

  next(stream);
});
