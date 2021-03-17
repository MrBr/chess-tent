import { ExerciseSteps } from '@types';
import { useCallback } from 'react';
import { updateStepState } from '@chess-tent/models';
import { set } from 'lodash';

export const useUpdateExerciseStep = <T extends ExerciseSteps>(
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

export const useUpdateExerciseStateProp = <
  S extends ExerciseSteps,
  T extends keyof S['state'],
  K extends keyof Required<S['state']>[T]
>(
  updateStep: (step: S) => void,
  step: S,
  prop: [T, K] | T,
) => {
  const updateExerciseState = useUpdateExerciseStep(updateStep, step);
  return useCallback(
    (value: Partial<S['state'][T]> | Partial<Required<S['state']>[T][K]>) => {
      const updatedState = {};
      set(updatedState, prop, value);
      updateExerciseState(updatedState);
    },
    [updateExerciseState, prop],
  );
};
