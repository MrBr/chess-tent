import { Step } from '../step';
import { Chapter } from '../chapter';
import { Analysis } from '../analysis';
import { createService } from '../_helpers';
import {
  LessonActivity,
  LessonActivityBoardState,
  LessonActivityUserSettings,
} from './types';

export const getLessonActivityBoardState = (
  activity: LessonActivity,
  boardId: string,
): LessonActivityBoardState => {
  const board = activity.state.boards[boardId];
  if (!board) {
    throw new Error('Missing board');
  }
  return board;
};

export const getLessonActivityUserSettings = (
  activity: LessonActivity,
  userId: string,
): LessonActivityUserSettings => {
  return activity.state.userSettings[userId] || {};
};

/**
 * User always have an active board.
 * Behavior described in types.
 */
export const getLessonActivityUserActiveBoardState = (
  activity: LessonActivity,
  userId: string,
): LessonActivityBoardState => {
  const { selectedBoardId } = getLessonActivityUserSettings(activity, userId);
  const activeBoardId = selectedBoardId || activity.state.mainBoardId;
  return activity.state.boards[activeBoardId];
};

export const markStepCompleted = createService(
  (
    draft: LessonActivity,
    board: LessonActivityBoardState,
    step: Step,
  ): LessonActivity => {
    const state = getLessonActivityBoardState(draft, board.id);
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
  (
    draft: LessonActivity,
    board: LessonActivityBoardState,
    step: Step,
    initialState: {},
  ): LessonActivity => {
    const state = getLessonActivityBoardState(draft, board.id);
    if (!state[step.id]) {
      state[step.id] = initialState;
    }
    state.activeStepId = step.id;
    return draft;
  },
);

export const updateActivityActiveChapter = createService(
  (
    draft: LessonActivity,
    board: LessonActivityBoardState,
    chapter: Chapter,
  ): LessonActivity => {
    const state = getLessonActivityBoardState(draft, board.id);
    state.activeChapterId = chapter.id;
    state.activeStepId = chapter.state.steps[0].id;
    return draft;
  },
);

export const updateActivityStepAnalysis = createService(
  (
    draft: LessonActivity,
    board: LessonActivityBoardState,
    step: Step,
    analysis: Analysis<any>,
  ): LessonActivity => {
    const state = getLessonActivityBoardState(draft, board.id);
    state[step.id].analysis = analysis;
    return draft;
  },
);

export const updateActivityStepState = createService(
  (
    draft: LessonActivity,
    board: LessonActivityBoardState,
    step: Step,
    patch: {},
  ): LessonActivity => {
    const state = getLessonActivityBoardState(draft, board.id);
    state[step.id] = {
      ...(state[step.id] || {}),
      ...patch,
    };
    return draft;
  },
);

export const isLessonActivityBoardStepCompleted = (
  board: LessonActivityBoardState,
  step: Step,
) => board.completedSteps?.some(stepId => stepId === step.id);
