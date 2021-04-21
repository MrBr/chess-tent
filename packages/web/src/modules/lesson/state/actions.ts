import {
  Chapter,
  getLessonChapterPath,
  getLessonStepPath,
  Lesson,
  LessonDetails,
  Step,
} from '@chess-tent/models';
import {
  ADD_LESSON_CHAPTER,
  AddLessonChapterAction,
  PublishLessonAction,
  State,
  UPDATE_LESSON_CHAPTER,
  UPDATE_LESSON_PATH,
  UPDATE_LESSON_STEP,
  UpdateLessonChapterAction,
  UpdateLessonPathAction,
  UpdateLessonStepAction,
  PUBLISH_LESSON,
} from '@types';

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

export const publishLessonAction = (
  lesson: Lesson,
  lessonDetails: LessonDetails,
): PublishLessonAction => ({
  type: PUBLISH_LESSON,
  payload: lessonDetails,
  meta: {
    lessonId: lesson.id,
    path: ['versions', lesson.versions.length],
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

export const updateLessonPathAction: State['actions']['updateLessonPath'] = (
  lesson,
  path,
  value,
): UpdateLessonPathAction => ({
  type: UPDATE_LESSON_PATH,
  payload: value,
  meta: {
    lessonId: lesson.id,
    path: path,
  },
});
