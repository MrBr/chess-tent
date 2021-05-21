import { Middleware, UPDATE_RECORD, PUSH_RECORD } from '@types';
import { updateEntitiesAction } from '../../state/actions';

export const updateRecordEntitiesMiddleware: Middleware = store => next => action => {
  // Record actions which update entities.
  if (
    [UPDATE_RECORD, PUSH_RECORD].includes(action.type) &&
    action.payload.value
  ) {
    store.dispatch(updateEntitiesAction(action.payload.value));
  }
  next(action);
};
