import { denormalize } from 'normalizr';
import { Step } from '@chess-tent/models';
import { AppState } from '../../state';
import { stepSchema } from '../';

const stepSelector = (stepId: Step['id']) => (state: AppState) =>
  denormalize(stepId, stepSchema, state.trainer);

export { stepSelector };
