import { NormalizedExercise } from '@chess-tent/models';
import { UPDATE_ENTITIES } from '../../state';

import {
  ExerciseAction,
  SET_EXERCISE_ACTIVE_STEP,
  UPDATE_EXERCISE,
} from './actions';

export type ExercisesState = { [key: string]: NormalizedExercise };

export const reducer = (state: ExercisesState = {}, action: ExerciseAction) => {
  switch (action.type) {
    case SET_EXERCISE_ACTIVE_STEP: {
      const exerciseId = action.meta.id;
      const newActiveStepId = action.payload;
      const exercise = state[exerciseId];
      return {
        ...state,
        [exerciseId]: {
          ...exercise,
          activeStep: newActiveStepId,
        },
      };
    }
    case UPDATE_EXERCISE: {
      const exerciseId = action.meta.id;
      const patch = action.payload;
      const exercise = state[exerciseId];
      return {
        ...state,
        [exerciseId]: {
          ...exercise,
          ...patch,
        },
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.exercises
        ? {
            ...state,
            ...action.payload.exercises,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
