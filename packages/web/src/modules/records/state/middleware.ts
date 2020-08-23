import { Middleware, RECORD_UPDATE_ACTION } from '@types';
import { updateEntitiesAction } from '../../state/actions';

export const updateRecordEntitiesMiddleware: Middleware = store => next => action => {
  if (action.type === RECORD_UPDATE_ACTION) {
    store.dispatch(updateEntitiesAction(action.payload.value));
  }
  next(action);
};
