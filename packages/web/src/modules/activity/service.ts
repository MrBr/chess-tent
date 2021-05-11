import { services, utils } from '@application';
import {
  Activity,
  createActivity as modelCreateActivity,
  Step,
  PatchListener,
  updateActivityActiveStep as modelUpdateActivityActiveStep,
} from '@chess-tent/models';
import { ActivityStepStateBase, Services } from '@types';

export const createActivity = <T extends Activity>(
  ...args: Parameters<Services['createActivity']>
) => modelCreateActivity(utils.generateIndex(), ...args) as T;

export const createActivityStepState = (initialState?: {}): ActivityStepStateBase => ({
  analysis: services.createAnalysis(),
  ...(initialState || {}),
});

export const createActivityComment: Services['createActivityComment'] = (
  user,
  text,
) => ({
  userId: user.id,
  text,
  id: utils.generateIndex(),
});

export const updateActivityActiveStep = <T extends Activity>(
  activity: T,
  step: Step,
  patchListener?: PatchListener,
) =>
  modelUpdateActivityActiveStep(
    activity,
    step,
    {
      analysis: services.createAnalysis(),
    },
    patchListener,
  );
