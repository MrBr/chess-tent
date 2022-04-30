import { socket } from '@application';
import {
  ACTION_EVENT,
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';

socket.registerMiddleware(async (stream, next) => {
  // Forward conferencing action
  if (
    stream.event === ACTION_EVENT &&
    (stream.data.type === CONFERENCING_ANSWER ||
      stream.data.type === CONFERENCING_OFFER ||
      stream.data.type === CONFERENCING_ICECANDIDATE)
  ) {
    socket.sendAction(stream.data.payload.room, stream);
  }

  next(stream);
});
