import { services, utils } from '@application';
import {
  Activity,
  createActivity as modelCreateActivity,
} from '@chess-tent/models';
import { ActivityStepStateBase, Services, Steps } from '@types';

export const createActivity = <T extends Activity>(
  ...args: Parameters<Services['createActivity']>
) => modelCreateActivity(utils.generateIndex(), ...args) as T;

export const createActivityStepState = (
  activeStep: Steps,
  initialState?: {},
): ActivityStepStateBase => ({
  analysis: services.createAnalysis(services.getStepPosition(activeStep)),
  ...(initialState || {}),
});
