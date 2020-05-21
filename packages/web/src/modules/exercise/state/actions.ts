import { Exercise, Step } from '@chess-tent/models';
import { SET_EXERCISE_ACTIVE_STEP, SetExerciseActiveStepAction } from '@types';

export const setExerciseActiveStepAction = (
  exercise: Exercise,
  step: Step,
): SetExerciseActiveStepAction => ({
  type: SET_EXERCISE_ACTIVE_STEP,
  payload: step.id,
  meta: {
    id: exercise.id,
  },
});
