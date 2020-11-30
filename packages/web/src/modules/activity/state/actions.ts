import {
  UPDATE_ACTIVITY_STEP_STATE,
  UpdateActivityStepAction,
  State,
  UPDATE_ACTIVITY_PROPERTY,
  UpdateActivityPropertyAction,
} from '@types';

export const updateActivityPropertyAction: State['actions']['updateActivityProperty'] = (
  activity,
  path,
  payload,
): UpdateActivityPropertyAction => ({
  type: UPDATE_ACTIVITY_PROPERTY,
  payload,
  meta: {
    activityId: activity.id,
    path,
  },
});

export const updateActivityStepAction: State['actions']['updateActivityStepState'] = (
  activity,
  stepId,
  payload,
): UpdateActivityStepAction => ({
  type: UPDATE_ACTIVITY_STEP_STATE,
  payload,
  meta: {
    activityId: activity.id,
    path: ['state', stepId],
  },
});

export const updateActivityStepAnalysisAction: State['actions']['updateActivityStepAnalysis'] = (
  activity,
  stepId,
  path,
  payload,
): UpdateActivityStepAction => ({
  type: UPDATE_ACTIVITY_STEP_STATE,
  payload,
  meta: {
    activityId: activity.id,
    path: ['state', stepId, 'analysis', ...path],
  },
});
