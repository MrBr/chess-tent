import { Step } from '@chess-tent/models';
import { Action, UpdateEntitiesAction } from '../../state';

export const UPDATE_STEP = 'UPDATE_STEP';
export const UPDATE_STEP_STATE = 'UPDATE_STEP_STATE';

type UpdatableStepProps = Omit<{}, 'moves' | 'schema' | 'shapes' | 'id'>;
type UpdateStepAction = Action<
  typeof UPDATE_STEP,
  UpdatableStepProps,
  { id: Step['id'] }
>;
type UpdateStepStateAction = Action<
  typeof UPDATE_STEP_STATE,
  {},
  { id: Step['id'] }
>;

export type StepAction =
  | UpdateEntitiesAction
  | UpdateStepAction
  | UpdateStepStateAction;

export const updateStepAction = (
  step: Step,
  patch: UpdatableStepProps,
): UpdateStepAction => ({
  type: UPDATE_STEP,
  payload: patch,
  meta: {
    id: step.id,
  },
});
export const updateStepStateAction = (
  step: Step,
  statePatch: {},
): UpdateStepStateAction => ({
  type: UPDATE_STEP_STATE,
  payload: statePatch,
  meta: {
    id: step.id,
  },
});
