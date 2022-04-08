import { isEqual } from 'lodash';
import { constants, services, utils } from '@application';
import {
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
} from '@chess-tent/models';

const { createStep } = services;
const { generateIndex } = utils;
const { START_FEN } = constants;

export const createLessonActivityBoard = (
  activeChapterId: string,
  activeStepId: string,
  state = {},
) => ({
  id: utils.generateIndex(),
  ...state,
  activeStepId,
  activeChapterId,
  [activeStepId]: services.createActivityStepState(),
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
  const activeChapterId = lesson.state.chapters[0].id;
  const activeStepId = lesson.state.chapters[0].state.steps[0].id;
  const roles = [
    createRoles(owner, LessonActivityRole.OWNER),
    ...createRoles(students, LessonActivityRole.STUDENT),
    ...createRoles(coaches, LessonActivityRole.COACH),
  ];
  const mainBoard = createLessonActivityBoard(
    activeChapterId,
    activeStepId,
    boardState,
  );
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

export const createNewLesson = (user: User) => {
  const defaultStep: Step = createStep('variation', {
    position: START_FEN,
  });
  const newLessonId = generateIndex();
  const defaultChapter = createChapter(generateIndex(), 'Chapter', [
    defaultStep,
  ]);
  return createLesson(newLessonId, [defaultChapter], user, 'Lesson');
};
