import { Middleware, UPDATE_ENTITY } from '@types';
import application, { socket, state } from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';

export const middleware: Middleware = store => next => action => {
  if (
    action.type === UPDATE_ENTITY &&
    action.meta.type === TYPE_ACTIVITY &&
    !action.meta.push
  ) {
    const { id, type, patch } = action.meta;
    socket.sendAction(state.actions.sendPatchAction(patch, id, type));
  }
  next(action);
};
application.state.registerMiddleware(middleware);
