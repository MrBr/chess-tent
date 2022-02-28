import { services, utils } from '@application';
import { ActivityStepMode, ActivityStepStateBase, Services } from '@types';

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
