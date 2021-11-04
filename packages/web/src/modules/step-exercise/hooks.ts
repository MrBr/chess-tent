import { ExerciseSegments, ExerciseSteps } from '@types';
import { useCallback } from 'react';
import { updateStepState } from '@chess-tent/models';

export const useUpdateExerciseStepState = <T extends ExerciseSteps>(
  updateStep: (step: T) => void,
  step: T,
) => {
  return useCallback(
    (exerciseState: Partial<T['state']>) => {
      const updatedStep = updateStepState(step, exerciseState);
      updateStep(updatedStep);
    },
    [step, updateStep],
  );
};

export const useUpdateExerciseActiveSegment = <T extends ExerciseSteps>(
  updateStep: (step: T) => void,
  step: T,
) => {
  const updateExerciseState = useUpdateExerciseStepState(updateStep, step);
  return useCallback(
    (activeSegment: keyof ExerciseSegments) => {
      updateExerciseState({ activeSegment } as Partial<T['state']>);
    },
    [updateExerciseState],
  );
};

export const useUpdateSegment = <
  T extends ExerciseSteps,
  K extends keyof ExerciseSegments
>(
  step: T,
  updateStep: (step: T) => void,
  activeSegment: K,
) => (segmentPatch: Partial<T['state'][K]>) => {
  updateStep(
    updateStepState(step, {
      [activeSegment]: segmentPatch,
    } as Partial<T['state']>),
  );
};
