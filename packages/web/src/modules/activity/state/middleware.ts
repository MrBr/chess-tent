import { Middleware, UPDATE_ENTITY } from '@types';
import application, { socket, state } from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';

export const middleware: Middleware = store => next => action => {
  if (
    action.type === UPDATE_ENTITY &&
    action.meta.type === TYPE_ACTIVITY &&
    !action.meta.push &&
    // Not all UPDATE_ENTITY actions have a patch
    action.meta.patch
  ) {
    const { id, type, patch } = action.meta;
    const patchAction = state.actions.sendPatchAction(patch, id, type);
    socket.sendAction(patchAction);
  }
  next(action);
};
application.state.registerMiddleware(middleware);
