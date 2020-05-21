import { denormalize } from 'normalizr';
import { Exercise } from '@chess-tent/models';
import { AppState } from '../../state';
import { exerciseSchema } from '../';

const exerciseSelector = (exerciseId: Exercise['id']) => (
  state: AppState,
): Exercise => denormalize(exerciseId, exerciseSchema, state.trainer);

export { exerciseSelector };
