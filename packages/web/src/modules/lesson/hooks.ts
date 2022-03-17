import { Lesson, Step, updateStepState, User } from '@chess-tent/models';
import { hooks } from '@application';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { ActivityFilters, Hooks } from '@types';
import { editorContext } from './context';
import { userTrainings, lessons, myLessons, lesson } from './record';
import { lessonSelector } from './state/selectors';

const { useRecordInit, useStore } = hooks;

export const useUpdateLessonStepState = <T extends Step>(
  updateStep: (step: T) => void,
  step: T,
) => {
  return useCallback(
    (state: Partial<T['state']>) => updateStep(updateStepState(step, state)),
    [step, updateStep],
  );
};

export const useUserTrainings: Hooks['useUserTrainings'] = (user: User) => {
  const record = useRecordInit(userTrainings, `trainings-${user.id}`);

  const filters: ActivityFilters = useMemo(
    () => ({
      users: user.id,
    }),
    [user.id],
  );

  useEffect(() => {
    if (record.get().meta.loading) {
      return;
    }
    record.load(filters);
    // eslint-disable-next-line
  }, [filters]);

  return record;
};

export const useLessons: Hooks['useLessons'] = (key: string, filters) => {
  const record = useRecordInit(lessons, key);

  useEffect(() => {
    record.load(filters);
    // eslint-disable-next-line
  }, [filters]);

  return record;
};

export const useLesson: Hooks['useLesson'] = (lessonId: Lesson['id']) => {
  const store = useStore();
  const record = useRecordInit(lesson, 'lesson' + lessonId);

  useEffect(() => {
    const state = store.getState();
    const lesson = lessonSelector(lessonId)(state);
    if (lesson) {
      record.update(lesson);
      return;
    }
    record.load(lessonId);
    // eslint-disable-next-line
  }, [lessonId]);

  return record;
};

export const useMyLessons: Hooks['useMyLessons'] = (key: string, filters) => {
  const record = useRecordInit(myLessons, key);

  useEffect(() => {
    record.load(filters);
    // eslint-disable-next-line
  }, [filters]);

  return record;
};

export const useEditor = () => {
  const context = useContext(editorContext);
  if (!context) {
    throw new Error('Component using Editor context not in the Editor scope.');
  }
  return context;
};

export const useLessonMeta: Hooks['useLessonMeta'] = activity => {
  return hooks.useMeta(`lesson-${activity.id}`);
};

export const useLessonActivity = () => {};
