import { ExerciseModule, ExerciseStep } from '@types';
import {
  createStep as coreCreateStep,
  updateStepState,
} from '@chess-tent/models';
import { stepType } from './model';

export const updateExerciseStep = <T extends ExerciseStep>(
  step: T,
  exerciseState: Partial<T['state']['exerciseState']>,
  state: Partial<T['state']> = {},
): T =>
  updateStepState(step, {
    ...state,
    exerciseState: exerciseState,
  });

export const createStep: ExerciseModule['createStep'] = (id, initialState) =>
  coreCreateStep<ExerciseStep>(id, stepType, {
    shapes: [],
    steps: [],
    exerciseType: 'variation',
    exerciseState: {},
    ...(initialState || {}),
  });
