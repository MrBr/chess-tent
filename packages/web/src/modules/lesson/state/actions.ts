import { Chapter, getLessonStepPath, Lesson, Step } from '@chess-tent/models';
import {
  SET_LESSON_ACTIVE_STEP,
  SetLessonActiveStepAction,
  UPDATE_LESSON_STEP,
  UpdateLessonStepAction,
} from '@types';

export const setLessonActiveStepAction = (
  lesson: Lesson,
  step: Step,
): SetLessonActiveStepAction => ({
  type: SET_LESSON_ACTIVE_STEP,
  payload: step.id,
  meta: {
    id: lesson.id,
  },
});

export const updateLessonStepAction = <T extends Step>(
  lesson: Lesson,
  chapter: Chapter,
  step: T,
): UpdateLessonStepAction => ({
  type: UPDATE_LESSON_STEP,
  payload: step,
  meta: {
    lessonId: lesson.id,
    chapterId: chapter.id,
    path: getLessonStepPath(lesson, chapter, step),
  },
});

export const updateLessonStepStateAction = <T extends Step>(
  lesson: Lesson,
  chapter: Chapter,
  step: T,
  state: Partial<T['state']>,
): UpdateLessonStepAction =>
  updateLessonStepAction(lesson, chapter, {
    ...step,
    state: { ...step.state, ...state },
  });
