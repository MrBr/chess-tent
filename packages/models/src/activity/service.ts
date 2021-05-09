import produce from 'immer';
import { Subject } from '../subject';
import { User } from '../user';
import { Activity, TYPE_ACTIVITY } from './types';
import { Step } from '../step';
import { Chapter } from '../chapter';
import { Analysis } from '../analysis';

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

// TODO - move LessonActivity specifics to web
export const markStepCompleted = <T extends Activity>(
  activity: T,
  step: Step,
): T =>
  produce(activity, draft => {
    draft.completedSteps.push(step.id);
  });

export const updateActivityActiveStep = <T extends Activity>(
  activity: T,
  step: Step,
  initialState = {},
): T =>
  produce(activity, draft => {
    if (!draft.state[step.id]) {
      draft.state[step.id] = initialState;
    }
    draft.state.activeStepId = step.id;
  });

export const updateActivityActiveChapter = <T extends Activity>(
  activity: T,
  chapter: Chapter,
): T =>
  produce(activity, draft => {
    draft.state.activeChapterId = chapter.id;
  });

export const updateActivityStepAnalysis = <T extends Activity>(
  activity: T,
  stepId: Step['id'],
  analysis: Analysis<any>,
): T =>
  produce(activity, draft => {
    draft.state[stepId].analysis = analysis;
  });

export const updateActivityStepState = <T extends Activity>(
  activity: T extends Activity ? T : never,
  stepId: Step['id'],
  state: {},
): T extends Activity ? T : never => ({
  ...activity,
  state: {
    ...activity.state,
    [stepId]: {
      ...(activity.state[stepId] || {}),
      ...state,
    },
  },
});
