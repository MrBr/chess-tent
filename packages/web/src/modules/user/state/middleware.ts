import { Middleware, USER_LOGGED_IN } from '@types';
import { updateEntitiesAction } from '../../state/actions';

export const activeUserEntityMiddleware: Middleware = store => next => action => {
  if (action.type === USER_LOGGED_IN) {
    store.dispatch(updateEntitiesAction(action.payload));
  }
  next(action);
};
