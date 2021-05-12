import { Middleware, State, SYNC_ACTION } from '@types';
import { socket, utils, state } from '@application';

const {
  actions: { updateEntities },
} = state;

export const middleware: State['middleware'] = [];

export const registerMiddleware = (middlewareFunction: Middleware) =>
  middleware.push(middlewareFunction);

export const generalMiddleware: Middleware = store => next => action => {
  console.log('generalMiddleware');
  if (action.type === SYNC_ACTION) {
    console.log('generalMiddleware SYNC_ACTION');
    const hasPayload = action.payload !== undefined;
    if (!hasPayload) {
      const { id, type } = action.meta;
      const entity = store.getState().entities[type][id];
      const payload = utils.normalize(entity);
      console.log('action before', action);
      const actionWithPayload = { ...action, payload };
      console.log('action after', actionWithPayload);
      socket.sendAction(actionWithPayload);
    } else {
      const entity = action.payload;
      store.dispatch(updateEntities(entity));
    }
    return;
  }
  next(action);
};
