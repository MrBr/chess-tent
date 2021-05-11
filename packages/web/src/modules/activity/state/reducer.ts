import {
  UPDATE_ENTITIES,
  ActivityAction,
  ActivityState,
  UPDATE_ACTIVITY_PROPERTY,
  UPDATE_ACTIVITY_STEP_STATE,
  SYNC_ACTIVITY,
} from '@types';
import { Subject, updateSubjectValueAt } from '@chess-tent/models';

export const reducer = (
  state: ActivityState = {},
  action: ActivityAction<Subject>,
) => {
  switch (action.type) {
    case UPDATE_ACTIVITY_PROPERTY:
    case UPDATE_ACTIVITY_STEP_STATE: {
      const { activityId, path } = action.meta;
      const activity = state[activityId];
      return {
        ...state,
        [activityId]: updateSubjectValueAt(activity, path, action.payload),
      };
    }
    case SYNC_ACTIVITY: {
      const activity = action.payload;
      console.log('SYNC_ACTIVITY reducer', activity);
      return {
        ...state,
        [activity.id]: activity,
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.activities
        ? {
            ...state,
            ...action.payload.activities,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
