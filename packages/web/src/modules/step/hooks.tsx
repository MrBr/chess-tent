import { stepModules, hooks, state } from '@application';
import { useCallback } from 'react';
import { addStepRightToSame, Lesson, Step } from '@chess-tent/models';
import { FEN } from '@types';
import { debounce } from 'lodash';

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
    const newDescriptionStep = stepModules.createStep('description', position);
    dispatch(
      updateEntities(addStepRightToSame(step, newDescriptionStep)),
      setLessonActiveStep(lesson, newDescriptionStep),
    );
  }, [step, position, lesson, dispatch]);
};

export const useUpdateStepDescriptionDebounced = (step: Step) => {
  const dispatch = useDispatchBatched();
  return useCallback(
    debounce((description: string) => {
      dispatch(updateStepState(step, { description }));
    }, 500),
    [dispatch, step],
  );
};

hooks.useAddDescriptionStep = useAddDescriptionStep;
hooks.useUpdateStepDescriptionDebounced = useUpdateStepDescriptionDebounced;
