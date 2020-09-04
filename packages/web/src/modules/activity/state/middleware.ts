import { Middleware, SET_ACTIVITY_ACTIVE_STEP } from '@types';
import { services } from '@application';

export const middleware: Middleware = store => next => action => {
  if (action.type === SET_ACTIVITY_ACTIVE_STEP) {
    services.history.replace({
      ...services.history.location,
      search: `?activeStep=${action.payload}`,
    });
  }
  next(action);
};
