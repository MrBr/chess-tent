import { isEqual } from 'lodash';
import {
  MoveStep,
  MoveStepState,
  NotableMove,
  VariationStep,
  VariationStepState,
} from '@types';
import { Lesson, LessonActivity, User } from '@chess-tent/models';

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

export const getStudent = (activity: LessonActivity) => activity.users[0];

export const isMyTraining = (
  activity: LessonActivity,
  userId: User['id'],
  // The condition should probably be more explicit
) => activity.users.some(({ id }) => id === userId);

export const isStudentTraining = (
  activity: LessonActivity,
  userId: User['id'],
) => activity.owner.id === userId && !activity.subject.docId;

export const isLessonTraining = (activity: LessonActivity) =>
  activity.subject.docId && activity.subject.published;
