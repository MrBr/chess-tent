import { Middleware, State, SYNC_ACTION } from '@types';
import { socket, utils, records } from '@application';

export const middleware: State['middleware'] = [];

export const registerMiddleware = (middlewareFunction: Middleware) =>
  middleware.push(middlewareFunction);

export const syncMiddleware: Middleware = store => next => action => {
  if (action.type === SYNC_ACTION) {
    const shouldSendSync = action.payload === undefined;
    const { id, type } = action.meta;
    if (shouldSendSync) {
      const entity = utils.denormalize(id, type, store.getState().entities);
      const actionWithPayload = { ...action, payload: entity };
      socket.sendAction(actionWithPayload);
    } else {
      const entity = action.payload;
      const record = records.getRecordInitByNamespace(type)(
        store,
        `${type}-${id}`,
      );
      record.update(entity, { loading: false, loaded: true });
    }
    return;
  }
  next(action);
};
