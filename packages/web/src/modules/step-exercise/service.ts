import { ExerciseStep } from '@types';
import { updateStepState } from '@chess-tent/models';

export const updateExerciseStep = <T extends ExerciseStep>(
  step: T,
  exerciseState: Partial<T['state']['exerciseState']>,
  state: Partial<T['state']> = {},
): T =>
  updateStepState(step, {
    ...state,
    exerciseState: exerciseState,
  });
