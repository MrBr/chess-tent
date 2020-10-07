import {
  ADD_LESSON_CHAPTER,
  LessonAction,
  LessonState,
  UPDATE_ENTITIES,
  UPDATE_LESSON,
  UPDATE_LESSON_CHAPTER,
  UPDATE_LESSON_STATE,
  UPDATE_LESSON_STEP,
} from '@types';
import {
  addChapterToLesson,
  Lesson,
  NormalizedLesson,
  updateLessonStep,
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
    case UPDATE_LESSON_STATE: {
      const { lessonId } = action.meta;
      const lesson = state[lessonId];
      return {
        ...state,
        [lessonId]: {
          ...lesson,
          state: { ...lesson.state, ...action.payload },
        },
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
    case UPDATE_LESSON: {
      const lessonId = action.meta.id;
      const patch = action.payload;
      const lesson = state[lessonId];
      return {
        ...state,
        [lessonId]: {
          ...lesson,
          ...patch,
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
