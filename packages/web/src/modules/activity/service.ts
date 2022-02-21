import { services, utils } from '@application';
import {
  Activity,
  createActivity as modelCreateActivity,
} from '@chess-tent/models';
import { ActivityStepMode, ActivityStepStateBase, Services } from '@types';

export const createActivity = <T extends Activity>(
  ...args: Parameters<Services['createActivity']>
) => modelCreateActivity(utils.generateIndex(), ...args) as T;

export const createActivityStepState = (initialState?: {}): ActivityStepStateBase => ({
  analysis: services.createAnalysis(),
  mode: ActivityStepMode.SOLVING,
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
