import { Activity, Subject } from '@chess-tent/models';
import {
  UPDATE_ACTIVITY,
  UPDATE_ACTIVITY_STATE,
  UpdateActivityAction,
  UpdateActivityStateAction,
} from '@types';
import { normalize } from 'normalizr';
import { activitySchema } from '../model';

export const updateActivityAction = <T extends Subject>(
  activity: Activity<T>,
  patch: Partial<Activity<T>>,
): UpdateActivityAction<T> => ({
  type: UPDATE_ACTIVITY,
  payload: normalize({ ...activity, ...patch }, activitySchema).result,
  meta: {
    id: activity.id,
  },
});

export const updateActivityStateAction = (
  activity: Activity<Subject>,
  statePatch: {},
): UpdateActivityStateAction => ({
  type: UPDATE_ACTIVITY_STATE,
  payload: statePatch,
  meta: {
    id: activity.id,
  },
});
