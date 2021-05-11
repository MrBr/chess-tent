import {
  UPDATE_ACTIVITY_STEP_STATE,
  UpdateActivityStepAction,
  State,
  UPDATE_ACTIVITY_PROPERTY,
  UpdateActivityPropertyAction,
  SYNC_ACTIVITY,
  SyncActivityAction,
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

export const syncActivityAction: State['actions']['syncActivity'] = (
  activity,
  activityId,
  socketId,
): SyncActivityAction => ({
  type: SYNC_ACTIVITY,
  payload: activity,
  meta: {
    entityId: activityId,
    toSocketId: socketId,
  },
});
