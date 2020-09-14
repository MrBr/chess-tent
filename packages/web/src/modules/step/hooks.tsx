import { hooks, state, services } from '@application';
import { useCallback } from 'react';
import { addStep, addStepRightToSame, Lesson, Step } from '@chess-tent/models';
import { FEN } from '@types';

const { useDispatchBatched } = hooks;
const {
  actions: { updateStepState, setLessonActiveStep, updateEntities },
} = state;

export const useAddDescriptionStep = (
  lesson: Lesson,
  step: Step,
  position: FEN,
) => {
  const dispatch = useDispatchBatched();
  return useCallback(() => {
    const newDescriptionStep = services.createStep('description', position);
    dispatch(
      updateEntities(addStepRightToSame(step, newDescriptionStep)),
      setLessonActiveStep(lesson, newDescriptionStep),
    );
  }, [step, position, lesson, dispatch]);
};

export const useAddExerciseStep = (
  lesson: Lesson,
  step: Step,
  position: FEN,
) => {
  const dispatch = useDispatchBatched();
  return useCallback(() => {
    const newExerciseStep = services.createStep('exercise', position);
    dispatch(
      updateEntities(addStep(step, newExerciseStep)),
      setLessonActiveStep(lesson, newExerciseStep),
    );
  }, [step, position, lesson, dispatch]);
};

export const useUpdateStepState = (step: Step) => {
  const dispatch = useDispatchBatched();
  return useCallback(
    (state: {}) => {
      dispatch(updateStepState(step, state));
    },
    [dispatch, step],
  );
};

hooks.useAddDescriptionStep = useAddDescriptionStep;
hooks.useAddExerciseStep = useAddExerciseStep;
hooks.useUpdateStepState = useUpdateStepState;
