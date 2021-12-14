import { isEqual } from 'lodash';
import { services } from '@application';
import {
  MoveStep,
  MoveStepState,
  NotableMove,
  VariationStep,
  VariationStepState,
} from '@types';
import { Lesson, LessonActivity, Mentorship, User } from '@chess-tent/models';

const { isMentorship } = services;

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

/**
 * The function search if any user assigned to the activity is the mentor's student.
 * If the given user is mentor to any user related to the activity, he can teach them.
 */
export const isStudentTraining = (
  activity: LessonActivity,
  mentorship: Mentorship[],
  mentor: User,
) =>
  // Weird case when coaches are mentors to each other?!
  activity.owner.id !== mentor.id &&
  (isMentorship(mentorship, activity.owner, mentor) ||
    activity.users.some(student => isMentorship(mentorship, student, mentor)));

/**
 * The function search if any user assigned to the activity is the student's mentor.
 * The given user has a mentor assigned to activity he can teach him.
 * My in this context is a student.
 */
export const isMyTraining = (
  activity: LessonActivity,
  mentorship: Mentorship[],
  student: User,
  // The condition should probably be more explicit
) =>
  activity.owner.id === student.id ||
  activity.users.some(mentor => isMentorship(mentorship, student, mentor));

export const isLessonTraining = (
  activity: LessonActivity,
  mentorship: Mentorship[],
  user: User,
) =>
  !isStudentTraining(activity, mentorship, user) && // current user not a mentor to anyone
  !isMyTraining(activity, mentorship, user); // current user not a student to anyone
