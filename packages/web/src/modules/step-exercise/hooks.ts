import { ExerciseState, ExerciseStep } from '@types';
import { useCallback } from 'react';
import { updateStepState } from '@chess-tent/models';

export const useUpdateExerciseStep = <T extends ExerciseState>(
  updateStep: (step: ExerciseStep) => void,
  step: ExerciseStep,
) => {
  return useCallback(
    (exerciseState: T, state: Partial<ExerciseStep['state']> = {}) => {
      const updatedStep = updateStepState(step, {
        ...state,
        exerciseState: {
          ...step.state.exerciseState,
          ...exerciseState,
        },
      });
      updateStep(updatedStep);
    },
    [step, updateStep],
  );
};

export const useUpdateExerciseStateProp = <T>(
  updateStep: (step: ExerciseStep) => void,
  step: ExerciseStep,
  prop: T extends ExerciseState ? keyof T : never,
) => {
  const updateExerciseState = useUpdateExerciseStep(updateStep, step);
  return useCallback(
    (value: T[typeof prop]) => updateExerciseState({ [prop]: value }),
    [updateExerciseState, prop],
  );
};
