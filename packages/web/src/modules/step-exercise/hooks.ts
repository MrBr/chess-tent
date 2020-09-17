import { hooks, state } from '@application';
import { ExerciseState, ExerciseStep } from '@types';
import { useCallback } from 'react';
import { Chapter, Lesson } from '@chess-tent/models';

const {
  actions: { updateLessonStepState },
} = state;
const { useDispatch } = hooks;

export const useUpdateExerciseState = <T extends ExerciseState>(
  lesson: Lesson,
  chapter: Chapter,
  step: ExerciseStep,
) => {
  const dispatch = useDispatch();
  return useCallback(
    (exerciseState: ExerciseState) => {
      dispatch(
        updateLessonStepState(lesson, chapter, step, {
          exerciseState: {
            ...step.state.exerciseState,
            ...exerciseState,
          },
        }),
      );
    },
    [dispatch, lesson, chapter, step],
  );
};

export const useUpdateExerciseStateProp = <T>(
  lesson: Lesson,
  chapter: Chapter,
  step: ExerciseStep,
  prop: T extends ExerciseState ? keyof T : never,
) => {
  const updateExerciseState = useUpdateExerciseState(lesson, chapter, step);
  return useCallback(
    (value: T[typeof prop]) => updateExerciseState({ [prop]: value }),
    [updateExerciseState, prop],
  );
};
