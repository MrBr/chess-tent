import { Step, updateStepState, User } from '@chess-tent/models';
import { hooks } from '@application';
import { useCallback, useContext, useEffect } from 'react';
import { Hooks } from '@types';
import { editorContext } from './context';
import { userTrainings, lessons, myLessons } from './record';

const { useRecordInit } = hooks;

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

  useEffect(() => {
    record.load({ owner: user.id, users: user.id });
    // eslint-disable-next-line
  }, []);

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
