import { Activity, Step, Subject } from '@chess-tent/models';
import {
  SET_ACTIVITY_ACTIVE_STEP,
  SetActivityActiveStepAction,
  UPDATE_ACTIVITY,
  UPDATE_ACTIVITY_STATE,
  UpdateActivityAction,
  UpdateActivityStateAction,
} from '@types';
import { utils } from '@application';

export const updateActivityAction = <T extends Subject>(
  activity: Activity<T>,
  patch: Partial<Activity<T>>,
): UpdateActivityAction<T> => ({
  type: UPDATE_ACTIVITY,
  payload: utils.normalize({ ...activity, ...patch }).result,
  meta: {
    id: activity.id,
  },
});

export const setActivityActiveStepAction = (
  activity: Activity,
  step: Step,
): SetActivityActiveStepAction => ({
  type: SET_ACTIVITY_ACTIVE_STEP,
  payload: step.id,
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
