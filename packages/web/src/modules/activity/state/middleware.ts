import { Middleware } from '@types';
import application, { socket } from '@application';

export const middleware: Middleware = store => next => action => {
  // if (
  //   action.type === UPDATE_ACTIVITY_PROPERTY ||
  //   action.type === UPDATE_ACTIVITY_STEP_STATE
  // ) {
  //   if (!action.meta.push) {
  //     socket.sendAction(action);
  //   }
  // }
  next(action);
};
application.state.registerMiddleware(middleware);
