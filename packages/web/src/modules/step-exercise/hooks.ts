import { hooks, state } from '@application';
import { ExerciseStep } from '@types';
import { useCallback } from 'react';
import { ExerciseState } from './model';

const {
  actions: { updateStepState },
} = state;
const { useDispatch } = hooks;

export const useUpdateExerciseState = <T extends ExerciseState>(
  step: ExerciseStep,
) => {
  const dispatch = useDispatch();
  return useCallback(
    (exerciseState: ExerciseState) => {
      dispatch(
        updateStepState(step, {
          exerciseState: {
            ...step.state.exerciseState,
            ...exerciseState,
          },
        }),
      );
    },
    [step, dispatch],
  );
};

export const useUpdateExerciseStateProp = <T>(
  step: ExerciseStep,
  prop: T extends ExerciseState ? keyof T : never,
) => {
  const updateExerciseState = useUpdateExerciseState(step);
  return useCallback(
    (value: T[typeof prop]) => updateExerciseState({ [prop]: value }),
    [updateExerciseState, prop],
  );
};
