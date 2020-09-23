import { Activity, TYPE_ACTIVITY } from '@chess-tent/models';
import { utils } from '@application';
import { AppState } from '@types';

const activitySelector = (activityId: Activity['id']) => (state: AppState) =>
  utils.denormalize(activityId, TYPE_ACTIVITY, state.entities);

export { activitySelector };
