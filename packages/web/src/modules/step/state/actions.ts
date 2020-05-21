import { Step } from '@chess-tent/models';
import {
  UpdatableStepProps,
  UPDATE_STEP,
  UPDATE_STEP_STATE,
  UpdateStepAction,
  UpdateStepStateAction,
} from '@types';

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
