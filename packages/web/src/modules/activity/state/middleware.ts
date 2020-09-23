import {
  Middleware,
  SET_ACTIVITY_ACTIVE_STEP,
  UPDATE_ACTIVITY,
  UPDATE_ACTIVITY_STATE,
} from '@types';
import { services, socket } from '@application';

export const middleware: Middleware = store => next => action => {
  if (action.type === SET_ACTIVITY_ACTIVE_STEP) {
    services.history.replace({
      ...services.history.location,
      search: `?activeStep=${action.payload}`,
    });
  }
  if (
    action.type === UPDATE_ACTIVITY ||
    action.type === UPDATE_ACTIVITY_STATE ||
    action.type === SET_ACTIVITY_ACTIVE_STEP
  ) {
    if (!action.meta.push) {
      socket.sendAction(action);
    }
  }
  next(action);
};
