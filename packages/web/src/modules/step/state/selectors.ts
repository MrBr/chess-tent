import { denormalize } from 'normalizr';
import { Step } from '@chess-tent/models';
import { AppState } from '@types';
import { stepSchema } from '../model';

const stepSelector = (stepId: Step['id']) => (state: AppState) =>
  denormalize(stepId, stepSchema, state.entities);

export { stepSelector };
