import {
  Step,
  updateStepState,
  User,
  Lesson,
  TYPE_LESSON,
  TYPE_ACTIVITY,
} from '@chess-tent/models';
import { hooks, requests } from '@application';
import { useCallback, useContext, useEffect } from 'react';
import { Hooks, LessonActivity, RecordHookReturn } from '@types';
import { editorContext } from './context';

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
  hooks.useRecord<Lesson[]>(`${user.id}-lessons`, TYPE_LESSON);

export const useUserTrainings = (
  user: User,
): RecordHookReturn<LessonActivity[]> => {
  const [trainings, setTrainings, resetTrainings] = useRecord<LessonActivity[]>(
    `trainings-${user.id}`,
    TYPE_ACTIVITY,
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

export const useLessons: Hooks['useLessons'] = (
  key: string,
  filters,
  options,
) => {
  const [lessons, setLessons, resetLessons] = useRecord<Lesson[]>(
    key,
    TYPE_LESSON,
  );
  const { fetch, response, loading, error } = useApi(
    options?.my ? requests.myLessons : requests.lessons,
  );
  useEffect(() => {
    if (!response || error) {
      return;
    }
    setLessons(response.data);
  }, [loading, response, setLessons, error]);
  useEffect(() => {
    fetch(filters);
  }, [filters, fetch]);
  return [lessons, setLessons, resetLessons];
};

export const useEditor = () => {
  const context = useContext(editorContext);
  if (!context) {
    throw new Error('Component using Editor context not in the Editor scope.');
  }
  return context;
};
