import {
  Middleware,
  UPDATE_ACTIVITY_PROPERTY,
  UPDATE_ACTIVITY_STEP_STATE,
  SYNC_ACTIVITY_REQUEST,
  LessonActivity,
} from '@types';
import { socket } from '@application';
import { syncActivityAction } from './actions';
import { activitySelector } from './selectors';

export const middleware: Middleware = store => next => action => {
  if (
    action.type === UPDATE_ACTIVITY_PROPERTY ||
    action.type === UPDATE_ACTIVITY_STEP_STATE
  ) {
    if (!action.meta.push) {
      socket.sendAction(action);
    }
  }

  if (action.type === SYNC_ACTIVITY_REQUEST) {
    console.log('SYNC_ACTIVITY_REQUEST middleware');
    const { entityId, fromSocketId } = action.meta;
    const selector = activitySelector(entityId);
    const activity = selector(store.getState()) as LessonActivity;
    socket.sendAction(syncActivityAction(activity, activity.id, fromSocketId));
    //return;
  }

  next(action);
};
