import { utils } from '@application';
import { Step, TYPE_STEP } from '@chess-tent/models';
import { AppState } from '@types';

const stepSelector = (stepId: Step['id']) => (state: AppState) =>
  utils.denormalize(stepId, TYPE_STEP, state.entities);

export { stepSelector };
