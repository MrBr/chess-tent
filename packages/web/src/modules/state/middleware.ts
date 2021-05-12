import { Middleware, State, SYNC_ACTION } from '@types';
import { socket, utils, state } from '@application';

const {
  actions: { updateEntities },
} = state;

export const middleware: State['middleware'] = [];

export const registerMiddleware = (middlewareFunction: Middleware) =>
  middleware.push(middlewareFunction);

export const generalMiddleware: Middleware = store => next => action => {
  if (action.type === SYNC_ACTION) {
    const hasPayload = action.payload !== undefined;
    if (!hasPayload) {
      const { id, type } = action.meta;
      const entity = utils.denormalize(id, type, store.getState().entities);
      const actionWithPayload = { ...action, payload: entity };
      socket.sendAction(actionWithPayload);
    } else {
      const entity = action.payload;
      store.dispatch(updateEntities(entity));
    }
    return;
  }
  next(action);
};
