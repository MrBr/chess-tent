import { Step, updateStepState, User, Lesson } from '@chess-tent/models';
import { hooks } from '@application';
import { useCallback } from 'react';

export const useUpdateLessonStepState = <T extends Step>(
  updateStep: (step: T) => void,
  step: T,
) => {
  return useCallback(
    (state: Partial<T['state']>) => updateStep(updateStepState(step, state)),
    [step, updateStep],
  );
};

export const useUserLessonRecord = (user: User) =>
  hooks.useRecord<Lesson[]>(`${user.id}-lessons`);
