import { Subject } from '../subject';
import { User } from '../user';
import { Activity, TYPE_ACTIVITY } from './types';
import { Step } from '../step';
import { createService } from '../_helpers';

export const isActivity = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_ACTIVITY;

export const createActivity = <T extends Subject, K extends {}>(
  id: string,
  subject: T,
  owner: User,
  state: K,
  users: User[] = [],
): Activity<T, K> => ({
  id,
  type: TYPE_ACTIVITY,
  subject,
  owner,
  users,
  state,
  completed: false,
  completedSteps: [],
});

export const isStepCompleted = (activity: Activity, step: Step) =>
  activity.completedSteps.some(stepId => stepId === step.id);

export const updateActivityStepState = createService(
  <T extends Activity>(
    draft: T extends Activity ? T : never,
    stepId: Step['id'],
    state: {},
  ): T extends Activity ? T : never => {
    draft.state[stepId] = {
      ...(draft.state[stepId] || {}),
      ...state,
    };
    return draft;
  },
);
