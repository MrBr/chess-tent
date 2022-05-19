import { isEqual } from 'lodash';
import { constants, services, utils } from '@application';
import {
  ActivityStepMode,
  ActivityStepStateBase,
  MoveStep,
  MoveStepState,
  NotableMove,
  VariationStep,
  VariationStepState,
} from '@types';
import {
  addStep,
  Chapter,
  createActivity,
  createChapter,
  createLesson,
  createRoles,
  createService,
  getLessonActivityBoardState,
  Lesson,
  LessonActivity,
  LessonActivityBoardState,
  LessonActivityRole,
  PatchListener,
  removeActivityChapter as modelRemoveActivityChapter,
  Step,
  updateActivityActiveChapter as modelUpdateActivityActiveChapter,
  updateActivityActiveStep as modelUpdateActivityActiveStep,
  updateAnalysisActiveStepId,
  User,
} from '@chess-tent/models';

const { createStep } = services;
const { generateIndex } = utils;
const { START_FEN } = constants;

export const createActivityStepState =
  (initialState?: {}): ActivityStepStateBase => ({
    analysis: services.createAnalysis(),
    mode: ActivityStepMode.SOLVING,
    ...(initialState || {}),
  });

export const createLessonActivityBoard = (
  activeChapterId: string | undefined,
  activeStepId: string,
  boardState = {},
  initialStepState: {} = {},
): LessonActivityBoardState => {
  const stepActivityState = createActivityStepState(initialStepState);
  const newBoardState = {
    id: utils.generateIndex(),
    ...boardState,
    activeStepId,
    activeChapterId,
    [activeStepId]: stepActivityState,
  };

  if (!activeChapterId) {
    // Handle empty training lesson without chapters
    const { analysis } = stepActivityState;
    const newStep = services.createStep('variation', {});
    stepActivityState.mode = ActivityStepMode.ANALYSING;

    addStep(analysis, newStep);
    updateAnalysisActiveStepId(analysis, newStep.id);
  }

  return newBoardState;
};

export const updateActivityActiveStep = (
  activity: LessonActivity,
  board: LessonActivityBoardState,
  step: Step,
  patchListener?: PatchListener,
): LessonActivity =>
  modelUpdateActivityActiveStep(
    activity,
    board,
    step,
    createActivityStepState(),
    patchListener,
  );

export const updateActivityActiveChapter = (
  activity: LessonActivity,
  board: LessonActivityBoardState,
  chapter: Chapter,
  patchListener?: PatchListener,
): LessonActivity =>
  modelUpdateActivityActiveChapter(
    activity,
    board,
    chapter,
    createActivityStepState(),
    patchListener,
  );

export const removeActivityChapter = createService(
  (
    draft: LessonActivity,
    board: LessonActivityBoardState,
    chapter: Chapter,
  ) => {
    const fallbackBoardState = createLessonActivityBoard(
      undefined,
      'analysis-step',
    );
    modelRemoveActivityChapter(draft, board, chapter, fallbackBoardState);
  },
);

export const createLessonActivity = (
  lesson: Lesson,
  owner: User,
  optionals?: Partial<LessonActivity>,
  boardState?: Partial<LessonActivityBoardState>,
  students: User[] = [],
  coaches: User[] = [],
): LessonActivity => {
  const id = utils.generateIndex();
  const activeChapterId =
    boardState?.activeChapterId || lesson.state.chapters[0]?.id;
  // There always should be an active step
  const activeStepId =
    boardState?.activeStepId ||
    lesson.state.chapters[0]?.state.steps[0].id ||
    'analysis-step';

  const roles = [
    ...createRoles(owner, LessonActivityRole.OWNER),
    ...createRoles(students, LessonActivityRole.STUDENT),
    ...createRoles(coaches, LessonActivityRole.COACH),
  ];

  const mainBoard = createLessonActivityBoard(
    activeChapterId,
    activeStepId,
    boardState,
    {},
  );

  const activityInitialState: LessonActivity['state'] = {
    mainBoardId: mainBoard.id,
    boards: {
      [mainBoard.id]: mainBoard,
    },
    userSettings: {},
  };
  return createActivity(id, lesson, roles, activityInitialState, optionals);
};

export const hasVariationMove = (
  step: MoveStep | VariationStep,
  move: NotableMove,
) => {
  return step.state.steps.some(({ stepType, state }) => {
    if (stepType === 'variation' || stepType === 'move') {
      const stepMove = (state as MoveStepState | VariationStepState).move;
      return isEqual(stepMove, move);
    }
    return false;
  });
};

export const isOwned = (activities: LessonActivity[], lessonId: Lesson['id']) =>
  activities.some(({ subject }) => subject.id === lessonId);

export const getMentor = (activity: LessonActivity) => activity.subject.owner;

export const isStudent = (activity: LessonActivity, user: User) =>
  activity.roles.find(
    ({ user: { id }, role }) =>
      id === user.id && role === LessonActivityRole.STUDENT,
  );

export const createNewLesson = (user: User, chapters?: Chapter[]) => {
  const newLessonId = generateIndex();
  let initialChapters = chapters;

  if (!initialChapters) {
    const defaultStep: Step = createStep('variation', {
      position: START_FEN,
    });
    initialChapters = [
      createChapter(generateIndex(), 'Chapter', [defaultStep]),
    ];
  }

  return createLesson(newLessonId, initialChapters, user, 'Untitled lesson');
};

export const isInitialLessonActivity = (activity: LessonActivity) =>
  activity.subject.state.chapters.length === 0;

// This is a bit implicit. Maybe the subject in the training case should just be a StepRoot and not a Lesson
export const isLessonActivity = (activity: LessonActivity) =>
  activity.subject.published && !!activity.subject.docId;

export const importLessonActivityChapters = createService(
  (draft: LessonActivity, chapters: Chapter[]) => {
    if (chapters.length === 0) {
      return;
    }
    chapters.forEach(chapter => {
      draft.subject.state.chapters.push(chapter);
    });
    const boardState = getLessonActivityBoardState(
      draft,
      draft.state.mainBoardId,
    );
    updateActivityActiveChapter(draft, boardState, chapters[0]);
    return draft;
  },
);

export const isActivityStepAnalysing = <T extends ActivityStepStateBase>(
  state: T,
) => state.mode === ActivityStepMode.ANALYSING;
export const isActivityStepSolving = <T extends ActivityStepStateBase>(
  state: T,
) => state.mode === ActivityStepMode.SOLVING;
