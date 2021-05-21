import { Middleware, UPDATE_RECORD, PUSH_RECORD } from '@types';
import { updateEntitiesAction } from '../../state/actions';

const updateEntitiesActions = [UPDATE_RECORD, PUSH_RECORD];

export const updateRecordEntitiesMiddleware: Middleware = store => next => action => {
  if (updateEntitiesActions.includes(action.type) && action.payload.value) {
    store.dispatch(updateEntitiesAction(action.payload.value));
  }
  next(action);
};
