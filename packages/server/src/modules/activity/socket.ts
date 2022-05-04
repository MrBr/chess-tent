import { action, socket } from '@application';
import {
  ACTION_EVENT,
  SEND_PATCH,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBED_EVENT,
} from '@chess-tent/types';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { canEditActivity, getActivity } from './service';

socket.registerMiddleware(async (stream, next) => {
  // Handle activity channel subscription
  if (
    stream.event === SUBSCRIBE_EVENT &&
    stream.data?.indexOf(TYPE_ACTIVITY) > -1
  ) {
    const tokenData = socket.identify(stream);
    if (!tokenData) {
      console.log(`Unauthorized channel socket subscribe: ${stream.data}`);
      return;
    }
    const roomId = stream.data;
    const activityId = roomId.substring(roomId.indexOf('-') + 1);

    const userId = tokenData.user.id;
    const canJoin = await canEditActivity(activityId, userId);
    if (canJoin) {
      console.log('Client joined to', roomId);
      // Joining a room implicitly requires sending a sync request
      const socketId = stream.client.id;
      const shouldSyncData = socket.shouldSyncData(roomId);
      const channel = `${TYPE_ACTIVITY}-${activityId}`;

      stream.client.join(roomId);

      if (shouldSyncData) {
        console.log('Owner already exists');
        const sync = action.syncAction(
          activityId,
          TYPE_ACTIVITY,
          socketId,
          undefined,
        );
        socket.sendServerAction(channel, sync, socket.getOwnerSocketId(roomId));
      } else {
        console.log('First user joined');
        const activity = await getActivity(activityId);
        const sync = action.syncAction(
          activityId,
          TYPE_ACTIVITY,
          socketId,
          activity,
        );
        socket.sendServerAction(channel, sync, socketId);
      }

      socket.dispatchRoomUsers(channel);
    }
  }

  if (
    stream.event === UNSUBSCRIBED_EVENT &&
    stream.data.indexOf(TYPE_ACTIVITY) > -1
  ) {
    socket.dispatchRoomUsers(stream.data);
  }

  // Forward activity action
  if (
    stream.event === ACTION_EVENT &&
    stream.data.type === SEND_PATCH &&
    stream.data.meta.type === TYPE_ACTIVITY
  ) {
    const action = stream.data;
    socket.sendAction(`${TYPE_ACTIVITY}-${action.meta.id}`, stream);
  }

  next(stream);
});
