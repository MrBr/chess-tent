import { Middleware, State, SYNC_ACTION } from '@types';
import { socket, utils, services } from '@application';

export const middleware: State['middleware'] = [];

export const registerMiddleware = (middlewareFunction: Middleware) =>
  middleware.push(middlewareFunction);

export const syncMiddleware: Middleware = store => next => action => {
  if (action.type === SYNC_ACTION) {
    console.log('syncMiddleware', action);
    const shouldSendSync = action.payload === undefined;
    const { id, type } = action.meta;
    if (shouldSendSync) {
      const entity = utils.denormalize(id, type, store.getState().entities);
      const actionWithPayload = { ...action, payload: entity };
      socket.sendAction(actionWithPayload);
    } else {
      const entity = action.payload;
      const record = services.createRecordService(`${type}-${id}`, type)(store);
      console.log('entity in syncMiddleware', entity);
      const entityToRecord = entity === null ? { id, type } : entity;
      console.log('entityToRecord in syncMiddleware', entityToRecord);
      record.update(entity, { loading: false, loaded: true });
    }
    return;
  }
  next(action);
};
