import { Middleware, UPDATE_RECORD } from '@types';
import { updateEntitiesAction } from '../../state/actions';

export const updateRecordEntitiesMiddleware: Middleware = store => next => action => {
  if (action.type === UPDATE_RECORD && action.payload.value) {
    store.dispatch(updateEntitiesAction(action.payload.value));
  }
  next(action);
};
