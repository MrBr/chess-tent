import {
  Middleware,
  SYNC_ACTIVITY_REQUEST,
  UPDATE_ENTITY,
  LessonActivity,
} from '@types';
import application, { socket, state } from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { syncActivityAction } from './actions';
import { activitySelector } from './selectors';

export const middleware: Middleware = store => next => action => {
  if (
    action.type === UPDATE_ENTITY &&
    action.meta.type === TYPE_ACTIVITY &&
    !action.meta.push
  ) {
    const { id, type, patch } = action.meta;
    socket.sendAction(state.actions.sendPatchAction(patch, id, type));
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
application.state.registerMiddleware(middleware);
