import { Middleware, ROOM_USERS_ACTION } from '@types';
import application from '@application';
import { roomUsers } from '../record';

export const middleware: Middleware = store => next => action => {
  if (action.type === ROOM_USERS_ACTION && action.meta.push) {
    const { room } = action.meta;
    roomUsers(store, `room-${room}-users`).updateRaw(action.payload);
  }
  next(action);
};
application.state.registerMiddleware(middleware);
