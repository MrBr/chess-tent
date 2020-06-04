import {
  LessonAction,
  LessonState,
  UPDATE_ENTITIES,
  UPDATE_LESSON,
  SET_LESSON_ACTIVE_STEP,
} from '@types';
import { updateSubjectState } from '@chess-tent/models';

export const reducer = (state: LessonState = {}, action: LessonAction) => {
  switch (action.type) {
    case SET_LESSON_ACTIVE_STEP: {
      const lessonId = action.meta.id;
      const newActiveStepId = action.payload;
      const lesson = state[lessonId];
      return {
        ...state,
        [lessonId]: updateSubjectState(lesson, {
          activeStep: newActiveStepId,
        }),
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
          state: {
            ...lesson.state,
          },
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
