import { Step } from '../step';
import { Chapter } from '../chapter';
import { Analysis } from '../analysis';
import { createService } from '../_helpers';
import { LessonActivity, LessonActivityState } from './types';
import { Activity } from '../activity';

export const getLessonActivityState = (
  activity: LessonActivity,
  board: string,
): LessonActivityState => {
  if (!activity.state.boards?.[board]) {
    throw new Error('Missing board');
  }
  return activity.state.boards?.[board];
};

export const markStepCompleted = createService(
  <T extends LessonActivity>(draft: T, board: string, step: Step): T => {
    const state = getLessonActivityState(draft, board);
    if (!state?.completedSteps) {
      state.completedSteps = [];
    }
    if (state && !state?.completedSteps?.includes(step.id)) {
      state.completedSteps.push(step.id);
    }
    return draft;
  },
);

export const updateActivityActiveStep = createService(
  <T extends LessonActivity>(
    draft: T,
    board: string,
    step: Step,
    initialState: {},
  ): T => {
    const state = getLessonActivityState(draft, board);
    if (!state[step.id]) {
      state[step.id] = initialState;
    }
    state.activeStepId = step.id;
    return draft;
  },
);

export const updateActivityActiveChapter = createService(
  <T extends LessonActivity>(draft: T, board: string, chapter: Chapter): T => {
    const state = getLessonActivityState(draft, board);
    state.activeChapterId = chapter.id;
    state.activeStepId = chapter.state.steps[0].id;
    return draft;
  },
);

export const updateActivityStepAnalysis = createService(
  <T extends LessonActivity>(
    draft: T,
    board: string,
    stepId: Step['id'],
    analysis: Analysis<any>,
  ): T => {
    const state = getLessonActivityState(draft, board);
    state[stepId].analysis = analysis;
    return draft;
  },
);

export const isLessonActivityStepCompleted = (
  activity: LessonActivity,
  board: string,
  step: Step,
) =>
  getLessonActivityState(activity, board).completedSteps?.some(
    stepId => stepId === step.id,
  );

export const updateActivityStepState = createService(
  <T extends LessonActivity>(
    draft: T extends LessonActivity ? T : never,
    board: string,
    stepId: Step['id'],
    patch: {},
  ): T extends LessonActivity ? T : never => {
    const state = getLessonActivityState(draft, board);
    state[stepId] = {
      ...(state[stepId] || {}),
      ...patch,
    };
    return draft;
  },
);
