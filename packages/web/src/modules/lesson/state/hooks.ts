import { Chapter, Lesson, Step } from '@chess-tent/models';
import { useCallback } from 'react';
import { hooks, state } from '@application';

const { useDispatchBatched } = hooks;
const {
  actions: { updateLessonStepState },
} = state;

export const useUpdateLessonStepState = <T extends Step>(
  lesson: Lesson,
  chapter: Chapter,
  step: T,
) => {
  const dispatch = useDispatchBatched();
  return useCallback(
    (state: Partial<T['state']>) => {
      dispatch(updateLessonStepState(lesson, chapter, step, state));
    },
    [chapter, dispatch, lesson, step],
  );
};
