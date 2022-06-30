import { flattenSteps, Step } from '../step';
import { Chapter } from '../chapter';
import { Analysis } from '../analysis';
import { createService } from '../_helpers';
import {
  LessonActivity,
  LessonActivityBoardState,
  LessonActivityUserSettings,
} from './types';
import { removeChapterFromLesson } from './service';

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
    initialSate: {},
  ): LessonActivity => {
    const state = getLessonActivityBoardState(draft, board.id);
    state.activeChapterId = chapter.id;
    updateActivityActiveStep(draft, board, chapter.state.steps[0], initialSate);
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
    patch: {},
  ): LessonActivity => {
    const state = getLessonActivityBoardState(draft, board.id);
    const stepId = state.activeStepId;
    if (!state[stepId]) {
      state[stepId] = patch;
    } else {
      Object.assign(state[stepId], patch);
    }
    return draft;
  },
);

export const removeActivityBoardStepSate = createService(
  (draft: LessonActivity, board: LessonActivityBoardState, stepId: string) => {
    const state = getLessonActivityBoardState(draft, board.id);
    delete state[stepId];
  },
);

export const removeActivityChapter = createService(
  (
    draft: LessonActivity,
    chapter: Chapter,
    fallbackStepState: {},
    fallbackStepId: string,
  ) => {
    removeChapterFromLesson(draft.subject, chapter);

    const steps = flattenSteps(chapter);

    Object.values(draft.state.boards).forEach(boardState => {
      const newActiveChapter = draft.subject.state.chapters[0];

      // Cleanup deleted chapter step states from the board
      steps.forEach(({ id }) => {
        delete boardState[id];
      });

      if (boardState.activeChapterId === chapter.id && newActiveChapter) {
        boardState.activeChapterId = newActiveChapter.id;
        boardState.activeStepId = newActiveChapter.state.steps[0].id;
      } else if (!newActiveChapter) {
        boardState.activeStepId = fallbackStepId;
        boardState[fallbackStepId] = { ...fallbackStepState };
      }
    });
  },
);
