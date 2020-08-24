import { denormalize } from 'normalizr';
import { Step } from '@chess-tent/models';
import { AppState } from '@types';
import { activitySchema } from '../model';

const activitySelector = (stepId: Step['id']) => (state: AppState) =>
  denormalize(stepId, activitySchema, state.entities);

export { activitySelector };
