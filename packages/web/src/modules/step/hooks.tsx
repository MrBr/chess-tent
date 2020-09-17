import { hooks, state, services } from '@application';
import { useCallback } from 'react';
import {
  addStep,
  addStepRightToSame,
  Chapter,
  Lesson,
  Step,
} from '@chess-tent/models';
import { FEN } from '@types';

const { useDispatchBatched } = hooks;
const {
  actions: { setLessonActiveStep, updateLessonStep },
} = state;

export const useAddDescriptionStep = (
  lesson: Lesson,
  chapter: Chapter,
  step: Step,
  position: FEN,
) => {
  const dispatch = useDispatchBatched();
  return useCallback(() => {
    const newDescriptionStep = services.createStep('description', position);
    dispatch(
      updateLessonStep(
        lesson,
        chapter,
        addStepRightToSame(step, newDescriptionStep),
      ),
      setLessonActiveStep(lesson, newDescriptionStep),
    );
  }, [position, dispatch, lesson, chapter, step]);
};

export const useAddExerciseStep = (
  lesson: Lesson,
  chapter: Chapter,
  step: Step,
  position: FEN,
) => {
  const dispatch = useDispatchBatched();
  return useCallback(() => {
    const newExerciseStep = services.createStep('exercise', position);
    dispatch(
      updateLessonStep(lesson, chapter, addStep(step, newExerciseStep)),
      setLessonActiveStep(lesson, newExerciseStep),
    );
  }, [position, dispatch, lesson, chapter, step]);
};

hooks.useAddDescriptionStep = useAddDescriptionStep;
hooks.useAddExerciseStep = useAddExerciseStep;
