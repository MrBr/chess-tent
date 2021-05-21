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
import { Hooks, LessonActivity, CollectionRecordHookReturn } from '@types';
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

export const useUserTrainingsRecord = (user: User) =>
  hooks.useCollectionRecord<LessonActivity>(
    `trainings-${user.id}`,
    TYPE_ACTIVITY,
  );

export const useUserTrainings = (
  user: User,
): CollectionRecordHookReturn<LessonActivity> => {
  const [
    trainings,
    setTrainings,
    pushTraining,
    resetTrainings,
    trainingsMeta,
  ] = useUserTrainingsRecord(user);
  const { fetch, response, loading, error } = useApi(requests.activities);
  useEffect(() => {
    console.log('response', response);
    if (!response) {
      return;
    }
    setTrainings(response.data as LessonActivity[]);
  }, [response, setTrainings]);
  useEffect(() => {
    console.log(loading, response, error);
    if (loading || response || error) {
      return;
    }
    fetch({ owner: user.id, users: user.id, state: { training: true } });
  }, [fetch, loading, response, error, user]);
  return [trainings, setTrainings, pushTraining, resetTrainings, trainingsMeta];
};

export const useLessons: Hooks['useLessons'] = (
  key: string,
  filters,
  options,
) => {
  const [lessons, setLessons, resetLessons, lessonsMeta] = useRecord<Lesson[]>(
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
  return [lessons, setLessons, resetLessons, lessonsMeta];
};

export const useEditor = () => {
  const context = useContext(editorContext);
  if (!context) {
    throw new Error('Component using Editor context not in the Editor scope.');
  }
  return context;
};
