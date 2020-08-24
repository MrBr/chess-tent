import { Step, TYPE_ACTIVITY } from '@chess-tent/models';
import { utils } from '@application';
import { AppState } from '@types';

const activitySelector = (stepId: Step['id']) => (state: AppState) =>
  utils.denormalize(stepId, TYPE_ACTIVITY, state.entities);

export { activitySelector };
