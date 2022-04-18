import { isEqual } from 'lodash';
import { constants, services, utils } from '@application';
import {
  ActivityStepMode,
  MoveStep,
  MoveStepState,
  NotableMove,
  VariationStep,
  VariationStepState,
} from '@types';
import {
  Lesson,
  LessonActivity,
  LessonActivityBoardState,
  PatchListener,
  Step,
  updateActivityActiveStep as modelUpdateActivityActiveStep,
  User,
  createActivity,
  LessonActivityRole,
  createChapter,
  createLesson,
  createRoles,
  Chapter,
  addStep,
  updateAnalysisActiveStepId,
} from '@chess-tent/models';

const { createStep } = services;
const { generateIndex } = utils;
const { START_FEN } = constants;

export const createLessonActivityBoard = (
  activeChapterId: string,
  activeStepId: string,
  boardState = {},
  initialStepState: {} = {},
): LessonActivityBoardState => ({
  id: utils.generateIndex(),
  ...boardState,
  activeStepId,
  activeChapterId,
  [activeStepId]: services.createActivityStepState(initialStepState),
});

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
    {
      analysis: services.createAnalysis(),
    },
    patchListener,
  );

export const createLessonActivity = (
  lesson: Lesson,
  owner: User,
  state: Partial<LessonActivity>,
  boardState?: Partial<LessonActivityBoardState>,
  students: User[] = [],
  coaches: User[] = [],
): LessonActivity => {
  const id = utils.generateIndex();
  const activeChapterId =
    boardState?.activeChapterId || lesson.state.chapters[0]?.id;
  const activeStepId =
    boardState?.activeStepId || lesson.state.chapters[0]?.state.steps[0].id;
  const roles = [
    ...createRoles(owner, LessonActivityRole.OWNER),
    ...createRoles(students, LessonActivityRole.STUDENT),
    ...createRoles(coaches, LessonActivityRole.COACH),
  ];
  const mainBoard = createLessonActivityBoard(
    activeChapterId,
    activeStepId,
    boardState,
    { mode: ActivityStepMode.ANALYSING },
  );
  if (!lesson.state.chapters[0]) {
    // Handle empty training lesson without chapters
    const { analysis } = mainBoard[mainBoard.activeStepId];
    const newStep = services.createStep('variation', {});

    addStep(analysis, newStep);
    updateAnalysisActiveStepId(analysis, newStep.id);
  }

  const activityInitialState: LessonActivity['state'] = {
    mainBoardId: mainBoard.id,
    boards: {
      [mainBoard.id]: mainBoard,
    },
    userSettings: {},
    ...state,
  };
  return createActivity(id, lesson, roles, activityInitialState);
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

  return createLesson(newLessonId, initialChapters, user, 'Lesson');
};

export const isInitialLessonActivity = (activity: LessonActivity) =>
  activity.subject.state.chapters.length === 0;
