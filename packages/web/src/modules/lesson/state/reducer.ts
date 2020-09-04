import {
  LessonAction,
  LessonState,
  UPDATE_ENTITIES,
  UPDATE_LESSON,
} from '@types';

export const reducer = (
  state: LessonState = {},
  action: LessonAction,
): LessonState => {
  switch (action.type) {
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
