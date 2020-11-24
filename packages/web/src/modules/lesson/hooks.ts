import { Step, updateStepState, User, Lesson } from '@chess-tent/models';
import { hooks, requests } from '@application';
import { useCallback, useEffect } from 'react';
import { LessonActivity, RecordHookReturn } from '@types';

const { useApi, useRecord } = hooks;

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

export const useUserTrainings = (
  user: User,
): RecordHookReturn<LessonActivity[]> => {
  const [trainings, setTrainings, resetTrainings] = useRecord<LessonActivity[]>(
    `trainings-${user.id}`,
  );
  const { fetch, response, loading, error, reset } = useApi(
    requests.activities,
  );
  useEffect(() => {
    if (!response || trainings) {
      return;
    }
    setTrainings(response.data as LessonActivity[]);
  }, [reset, response, setTrainings, trainings]);
  useEffect(() => {
    if (loading || response || error || trainings) {
      return;
    }
    fetch({ owner: user.id, state: { training: true } });
  }, [fetch, loading, response, error, trainings, user]);
  return [trainings, setTrainings, resetTrainings];
};
