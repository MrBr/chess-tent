import {
  ActivityRecord,
  Middleware,
  SEND_PATCH,
  State,
  SYNC_ACTION,
} from '@types';
import { socket, utils, records, services } from '@application';
import { LessonActivity, TYPE_ACTIVITY } from '@chess-tent/models';
import { InitedRecord } from '@chess-tent/redux-record/types';

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
      const record = records.getRecordInitByNamespace(type)(`${type}-${id}`)(
        store,
      );
      record.init();
      if (entity.type === TYPE_ACTIVITY) {
        (record as InitedRecord<ActivityRecord<LessonActivity>>).update(
          entity,
          {
            loading: false,
            loaded: true,
          },
        );
      }
    }
    return;
  }
  if (action.type === SEND_PATCH) {
    try {
      return next(action);
    } catch (e: unknown) {
      services.logException(e as Error);
      // This should fix problem for now.
      // TODO - In future trigger new sync action between the users.
      window.location.reload();
    }
  }
  next(action);
};
