import { Lesson, Step } from '@chess-tent/models';
import { SET_LESSON_ACTIVE_STEP, SetLessonActiveStepAction } from '@types';

export const setLessonActiveStepAction = (
  exercise: Lesson,
  step: Step,
): SetLessonActiveStepAction => ({
  type: SET_LESSON_ACTIVE_STEP,
  payload: step.id,
  meta: {
    id: exercise.id,
  },
});
