import { socket } from '@application';
import {
  ACTION_EVENT,
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';
import { TYPE_ACTIVITY } from '@chess-tent/models';

socket.registerMiddleware(async (stream, next) => {
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
