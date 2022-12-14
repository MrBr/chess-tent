import {
  ExerciseSegmentKeys,
  ExerciseSegments,
  ExerciseStep,
  ExerciseSteps,
} from '@types';
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

export const useUpdateSegment =
  <T extends ExerciseStep<any, any>, K extends keyof ExerciseSegments>(
    step: T,
    updateStep: (step: T) => void,
    activeSegment: K,
  ) =>
  (segmentPatch: Partial<T['state'][K]>) => {
    const updatedSegment: T['state'][ExerciseSegmentKeys] = {
      ...step.state[activeSegment],
      ...segmentPatch,
    };
    updateStep(
      updateStepState(step, {
        [activeSegment]: updatedSegment,
      } as Partial<T['state']>),
    );
  };
