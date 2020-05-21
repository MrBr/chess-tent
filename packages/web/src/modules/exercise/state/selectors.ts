import { denormalize } from 'normalizr';
import { Exercise } from '@chess-tent/models';
import { AppState } from '@types';
import { model } from '@application';

const exerciseSelector = (exerciseId: Exercise['id']) => (
  state: AppState,
): Exercise => denormalize(exerciseId, model.exerciseSchema, state.entities);

export { exerciseSelector };
