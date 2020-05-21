import {
  UPDATE_ENTITIES,
  StepAction,
  UPDATE_STEP,
  UPDATE_STEP_STATE,
  StepsState,
} from '@types';

export const reducer = (state: StepsState = {}, action: StepAction) => {
  switch (action.type) {
    case UPDATE_STEP_STATE: {
      const stepId = action.meta.id;
      const statePatch = action.payload;
      const step = state[stepId];
      return {
        ...state,
        [stepId]: {
          ...step,
          state: {
            ...step.state,
            ...statePatch,
          },
        },
      };
    }
    case UPDATE_STEP: {
      const stepId = action.meta.id;
      const patch = action.payload;
      const step = state[stepId];
      return {
        ...state,
        [stepId]: {
          ...step,
          ...patch,
        },
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.steps
        ? {
            ...state,
            ...action.payload.steps,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
