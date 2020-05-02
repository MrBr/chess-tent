import { denormalize } from 'normalizr';
import {
  AppState,
  Exercise,
  exerciseSchema,
  StepInstance,
  stepSchema,
} from '../../app/types';

const exerciseSelector = (exerciseId: Exercise['id']) => (
  state: AppState,
): Exercise => denormalize(exerciseId, exerciseSchema, state.trainer);

const stepSelector = (stepId: StepInstance['id']) => (state: AppState) =>
  denormalize(stepId, stepSchema, state.trainer);

export { stepSelector, exerciseSelector };
