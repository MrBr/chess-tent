import { isEqual } from 'lodash';
import { services, utils } from '@application';
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
} from '@chess-tent/models';
import { createRoles } from '@chess-tent/models/dist/role/service';

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
  state?: Partial<LessonActivityBoardState>,
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
    state,
  );
  const activityInitialState: LessonActivity['state'] = {
    mainBoard,
    presentedBoardId: mainBoard.id,
    userBoards: {},
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

export const getActivityUserBoard = (
  activity: LessonActivity,
  user: User,
): LessonActivityBoardState | undefined => {
  return activity.state.userBoards[user.id];
};

export const isOwned = (activities: LessonActivity[], lessonId: Lesson['id']) =>
  activities.some(({ subject }) => subject.id === lessonId);

export const getMentor = (activity: LessonActivity) => activity.subject.owner;

export const isStudent = (activity: LessonActivity, user: User) =>
  activity.roles.find(
    ({ user: { id }, role }) =>
      id === user.id && role === LessonActivityRole.STUDENT,
  );
