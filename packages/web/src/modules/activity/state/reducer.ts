import {
  UPDATE_ENTITIES,
  UPDATE_ACTIVITY,
  UPDATE_ACTIVITY_STATE,
  ActivityAction,
  ActivityState,
} from '@types';
import { Subject } from '@chess-tent/models';

export const reducer = (
  state: ActivityState = {},
  action: ActivityAction<Subject>,
) => {
  switch (action.type) {
    case UPDATE_ACTIVITY_STATE: {
      const activityId = action.meta.id;
      const statePatch = action.payload;
      const activity = state[activityId];
      return {
        ...state,
        [activityId]: {
          ...activity,
          state: {
            ...activity.state,
            ...statePatch,
          },
        },
      };
    }
    case UPDATE_ACTIVITY: {
      const activityId = action.meta.id;
      const patch = action.payload;
      const activity = state[activityId];
      return {
        ...state,
        [activityId]: {
          ...activity,
          ...patch,
        },
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
