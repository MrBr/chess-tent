import { socket } from '@application';
import {
  ACTION_EVENT,
  CONFERENCING_ANSWER,
  CONFERENCING_CONNECTION,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
  CONFERENCING_ROOM,
} from '@chess-tent/types';
import { TYPE_ACTIVITY } from '@chess-tent/models';

socket.registerMiddleware(async (stream, next) => {
  if (stream.event === ACTION_EVENT && stream.data.type === CONFERENCING_ROOM) {
    console.log(stream.event);
    socket.sendAction(`${TYPE_ACTIVITY}-${stream.data.payload.activityId}`, {
      data: {
        type: CONFERENCING_CONNECTION,
        payload: {
          startConnection: true,
        },
        meta: {},
      },
      client: stream.client,
    });
  }

  // Forward conferencing action
  if (
    stream.event === ACTION_EVENT &&
    (stream.data.type === CONFERENCING_ANSWER ||
      stream.data.type === CONFERENCING_OFFER ||
      stream.data.type === CONFERENCING_ICECANDIDATE)
  ) {
    socket.sendAction(
      `${TYPE_ACTIVITY}-${stream.data.payload.activityId}`,
      stream,
    );
  }

  next(stream);
});
