import { Exercise, NormalizedExercise, Step } from '@chess-tent/models';
import { Action, UpdateEntitiesAction } from '../../state';

export const SET_EXERCISE_ACTIVE_STEP = 'SET_EXERCISE_ACTIVE_STEP';
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE';

/**
 * Exercise actions
 */
type SetExerciseActiveStepAction = Action<
  typeof SET_EXERCISE_ACTIVE_STEP,
  Step['id'],
  { id: Exercise['id'] }
>;
type UpdateExerciseAction = Action<
  typeof UPDATE_EXERCISE,
  Omit<NormalizedExercise, 'schema' | 'id'>,
  { id: Exercise['id'] }
>;

export type ExerciseAction =
  | UpdateEntitiesAction
  | SetExerciseActiveStepAction
  | UpdateExerciseAction;

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
