import { Activity, Subject } from '@chess-tent/models';
import {
  SYNC_ACTIVITY_REQUEST,
  SYNC_ACTIVITY,
  SyncActivityRequestAction,
  SyncActivityAction,
} from '@chess-tent/types';

export const syncActivityRequestAction = (
  activityId: string,
  fromSocketId: string,
  toSocketId: string,
): SyncActivityRequestAction => ({
  type: SYNC_ACTIVITY_REQUEST,
  payload: undefined,
  meta: {
    entityId: activityId,
    fromSocketId,
    toSocketId,
  },
});

export const syncActivityAction = (
  activity: Activity<Subject, any>,
  socketId: string,
): SyncActivityAction => ({
  type: SYNC_ACTIVITY,
  payload: activity,
  meta: {
    entityId: activity.id,
    toSocketId: socketId,
  },
});
