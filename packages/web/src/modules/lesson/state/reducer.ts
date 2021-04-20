import {
  ADD_LESSON_CHAPTER,
  ADD_LESSON_DETAILS_TO_LESSON_VERSIONS,
  LessonAction,
  LessonState,
  UPDATE_ENTITIES,
  UPDATE_LESSON_CHAPTER,
  UPDATE_LESSON_PATH,
  UPDATE_LESSON_STEP,
} from '@types';
import {
  addChapterToLesson,
  addLessonDetailsToLessonVersions,
  Lesson,
  NormalizedLesson,
  updateLessonStep,
  updateSubjectValueAt,
} from '@chess-tent/models';

export const reducer = (
  state: LessonState = {},
  action: LessonAction,
): LessonState => {
  switch (action.type) {
    case UPDATE_LESSON_STEP: {
      const { lessonId, path } = action.meta;
      return {
        ...state,
        [lessonId]: (updateLessonStep(
          (state[lessonId] as unknown) as Lesson,
          action.payload,
          path,
        ) as unknown) as NormalizedLesson,
      };
    }
    case UPDATE_LESSON_PATH: {
      const { lessonId, path } = action.meta;
      const lesson = state[lessonId];
      return {
        ...state,
        [lessonId]: updateSubjectValueAt(lesson, path, action.payload),
      };
    }
    case ADD_LESSON_CHAPTER: {
      const { lessonId } = action.meta;
      const lesson = state[lessonId];
      return {
        ...state,
        [lessonId]: addChapterToLesson(lesson, action.payload),
      };
    }
    case ADD_LESSON_DETAILS_TO_LESSON_VERSIONS: {
      const { lessonId } = action.meta;
      const lesson = state[lessonId];
      return {
        ...state,
        [lessonId]: addLessonDetailsToLessonVersions(lesson, action.payload),
      };
    }
    case UPDATE_LESSON_CHAPTER: {
      const { lessonId, chapterId } = action.meta;
      const lesson = state[lessonId];
      const chapters = lesson.state.chapters.map(chapter =>
        chapter.id === chapterId ? action.payload : chapter,
      );
      return {
        ...state,
        [lessonId]: {
          ...lesson,
          state: { ...lesson.state, chapters },
        },
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.lessons
        ? {
            ...state,
            ...action.payload.lessons,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
