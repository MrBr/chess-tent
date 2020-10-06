import {
  Chapter,
  getLessonChapterPath,
  getLessonStatePath,
  getLessonStepPath,
  Lesson,
  Step,
} from '@chess-tent/models';
import {
  ADD_LESSON_CHAPTER,
  AddLessonChapterAction,
  State,
  UPDATE_LESSON,
  UPDATE_LESSON_CHAPTER,
  UPDATE_LESSON_STATE,
  UPDATE_LESSON_STEP,
  UpdateLessonChapterAction,
  UpdateLessonStateAction,
  UpdateLessonStepAction,
} from '@types';
import { utils } from '@application';
import { merge } from 'lodash';

export const updateLessonAction: State['actions']['updateLesson'] = (
  lesson,
  patch,
) => ({
  type: UPDATE_LESSON,
  payload: utils.normalize(merge({}, lesson, patch)).result,
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

export const addLessonChapterAction = (
  lesson: Lesson,
  chapter: Chapter,
): AddLessonChapterAction => ({
  type: ADD_LESSON_CHAPTER,
  payload: chapter,
  meta: {
    lessonId: lesson.id,
    path: ['state', 'chapters', lesson.state.chapters.length],
  },
});

export const updateLessonChapterAction = (
  lesson: Lesson,
  chapter: Chapter,
): UpdateLessonChapterAction => ({
  type: UPDATE_LESSON_CHAPTER,
  payload: chapter,
  meta: {
    lessonId: lesson.id,
    chapterId: chapter.id,
    path: getLessonChapterPath(lesson, chapter.id),
  },
});

export const updateLessonStateAction = <T extends keyof Lesson['state']>(
  lesson: Lesson,
  key: keyof Lesson['state'],
  value: Lesson['state'][T],
): UpdateLessonStateAction => ({
  type: UPDATE_LESSON_STATE,
  payload: { [key]: value },
  meta: {
    lessonId: lesson.id,
    path: getLessonStatePath(key),
  },
});
